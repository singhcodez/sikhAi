import type { VercelRequest, VercelResponse } from '@vercel/node';
// DRY CODE & SECURITY: We removed `GoogleGenerativeAIEmbeddings` from the Langchain import.
// Using the third-party wrapper for embeddings frequently scrambles URL endpoints and causes 404 errors.
// Bypassing it and making a direct REST API call to Google is significantly more stable, secure, and lightweight.
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { QdrantClient } from "@qdrant/js-client-rest";
import { z } from "zod";

// 1. Zod Schema for Structured Citations
const SikhAiSchema = z.object({
  // UX FIX: Strict instructions preventing repeated greetings on every single response.
  answer: z.string().describe("If the user says 'hello' or sends a generic greeting, reply ONLY with 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh (The Khalsa belongs to Waheguru, Victory belongs to Waheguru).' If the user asks a specific question, DO NOT include any greeting. Answer the question directly and respectfully."),
  citations: z.array(
    z.object({
      gurmukhi: z.string().describe("Original Gurmukhi line"),
      english: z.string().describe("English translation"),
      source: z.string().describe("Source name"),
      author: z.string().describe("Author"),
      ang: z.number().optional()
    })
  ).optional().default([])
});

// Helper: Get embedding vector instantly via Direct Google REST API (Bypassing Langchain)
async function getQueryEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text: text }]
        }
      })
    }
  );

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Google API Error: ${data.error.message}`);
  }

  return data.embedding.values;
}

// Helper: Search Qdrant Vector Database
async function searchScriptures(queryVector: number[]) {
  const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const searchResults = await qdrant.search("sikh_scriptures_master", {
    vector: queryVector,
    limit: 10, // UX FIX: Increased from 3 to 10. This gives the AI vastly more context so it stops saying data doesn't exist!
  });

  return searchResults.map((item) => item.payload);
}

// ============================================================================
// FALLBACK ENGINE: Automatically switches models when limits are reached
// ============================================================================
async function generateWithFallback(
  messages: HumanMessage[], 
  hasImage: boolean
) {
  // Use currently available production models
  const models = hasImage
    ? ["gemini-1.5-flash", "gemini-1.5-pro"]
    : ["gemini-1.5-flash", "gemini-1.5-flash-lite", "gemma-2-9b-it"];

  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Attempting generation with model: ${modelName}...`);

      const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.1,
        maxRetries: 1, 
      }).withStructuredOutput(SikhAiSchema);

      const result = await model.invoke(messages);
      console.log(`Success using ${modelName}!`);
      return result;

    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`All fallback AI models exhausted. Last error: ${lastError?.message}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, imageBase64 } = req.body;
    if (!message && !imageBase64) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const queryText = message || "Analyze this scripture image and explain its meaning.";
    const queryVector = await getQueryEmbedding(queryText);
    const retrievedContext = await searchScriptures(queryVector);

    const contextString = JSON.stringify(retrievedContext, null, 2);
    
    // UX FIX: The Prompt has been strictly updated with Greeting Rules to prevent looping
    const ragPrompt = `
You are SikhAI, a respectful assistant grounded in Guru Granth Sahib Ji, Dasam Granth, and Sikh History.

USER QUESTION: "${queryText}"

RETRIEVED SCRIPTURE CONTEXT FROM DATABASE:
${contextString}

INSTRUCTIONS:
1. Answer the user's question using ONLY the provided scripture context above (or by analyzing the uploaded image if one was provided).
2. Always return exact citations from the retrieved context or image.
3. If the context does not contain enough information, acknowledge what is present and state respectfully that additional scripture search is needed. Do NOT invent Gurbani.
4. GREETING RULE: If the USER QUESTION is purely a greeting (e.g., 'hello', 'sat sri akal'), output exactly: "Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh (The Khalsa belongs to Waheguru, Victory belongs to Waheguru). How may I assist you with Gurbani today?". If the USER QUESTION asks a specific question, DO NOT include any greeting. Jump straight to the answer.
`;

    const contentPayload: any[] = [{ type: "text", text: ragPrompt }];
    const hasImage = Boolean(imageBase64);

    if (hasImage) {
      contentPayload.push({
        type: "image_url",
        image_url: imageBase64.startsWith("data:") 
          ? imageBase64 
          : `data:image/jpeg;base64,${imageBase64}`
      });
    }

    const result = await generateWithFallback(
      [new HumanMessage({ content: contentPayload })],
      hasImage
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: "Failed to process request.", 
      details: error.message 
    });
  }
}
