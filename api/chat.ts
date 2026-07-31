import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { QdrantClient } from "@qdrant/js-client-rest";
import { z } from "zod";

// ============================================================================
// 1. ZOD SCHEMAS (Security & Validation)
// ============================================================================

// Validate incoming requests
const RequestSchema = z.object({
  message: z.string().optional(),
  imageBase64: z.string().optional()
}).refine(data => data.message || data.imageBase64, {
  message: "Either a text message or an image is required."
});

// Force structured JSON output from Gemini
const SikhAiSchema = z.object({
  answer: z.string().describe("A helpful, respectful answer. For general greetings like 'hello', reply politely with a Sikh greeting."),
  citations: z.array(
    z.object({
      gurmukhi: z.string().describe("Original Gurmukhi line"),
      english: z.string().describe("English translation"),
      hindi: z.string().optional().describe("Hindi translation if available"),
      source: z.string().describe("Source name"),
      author: z.string().describe("Author"),
      ang: z.number().optional()
    })
  ).optional().default([])
});

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

// Helper: Get embedding vector instantly via Direct Google REST API
async function getQueryEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  // REVERTED to gemini-embedding-001 as requested
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

  // Ensure this matches the collection name you used during ingestion
  const searchResults = await qdrant.search("sikh_scriptures_master", {
    vector: queryVector,
    limit: 4, 
  });

  return searchResults.map((item) => item.payload);
}

// ============================================================================
// 3. FALLBACK ENGINE
// ============================================================================
async function generateWithFallback(messages: HumanMessage[], hasImage: boolean) {
  // Using stable production models for fallback
  const models = hasImage
    ? ["gemini-1.5-flash", "gemini-1.5-pro"]
    : ["gemini-1.5-flash", "gemini-1.5-pro"];

  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Attempting generation with model: ${modelName}...`);

      const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.1, // Low temperature for high accuracy
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

// ============================================================================
// 4. MAIN API HANDLER
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const parsedBody = RequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.errors[0].message });
    }

    const { message, imageBase64 } = parsedBody.data;

    // Step 1: Search Qdrant using the text prompt
    const queryText = message || "Analyze this scripture image and explain its meaning.";
    const queryVector = await getQueryEmbedding(queryText);
    const retrievedContext = await searchScriptures(queryVector);

    // Step 2: Prepare RAG Prompt
    const contextString = JSON.stringify(retrievedContext, null, 2);
    const ragPrompt = `
You are SikhAI, a respectful assistant grounded in Sri Guru Granth Sahib Ji, Dasam Granth, and Sikh History.
USER QUESTION: "${queryText}"

RETRIEVED SCRIPTURE CONTEXT FROM DATABASE:
${contextString}

INSTRUCTIONS:
1. Answer the user's question using ONLY the provided scripture context above (or by analyzing the uploaded image if one was provided).
2. Always return exact citations from the retrieved context. Include the Gurmukhi, English, Source, and Ang.
3. If the context does not contain enough information, acknowledge what is present and state respectfully that additional scripture search is needed. Do NOT invent Gurbani.
`;

    // Step 3: Construct Payload (with optional Base64 Image)
    const contentPayload: any[] = [{ type: "text", text: ragPrompt }];
    const hasImage = Boolean(imageBase64);

    if (hasImage && imageBase64) {
      contentPayload.push({
        type: "image_url",
        image_url: imageBase64.startsWith("data:") 
          ? imageBase64 
          : `data:image/jpeg;base64,${imageBase64}`
      });
    }

    // Step 4: Execute Generation
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
