import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { QdrantClient } from "@qdrant/js-client-rest";
import { z } from "zod";

// 1. Zod Schema for Structured Citations
const SikhAiSchema = z.object({
  answer: z.string().describe("A helpful, respectful answer based ONLY on the provided Gurbani/History context."),
  citations: z.array(
    z.object({
      gurmukhi: z.string().describe("Original Gurmukhi line from Gurbani or text from Itihas"),
      english: z.string().describe("English translation"),
      source: z.string().describe("Source name, e.g., Guru Granth Sahib Ji or Dasam Granth"),
      author: z.string().describe("Author, e.g., Guru Nanak Dev Ji"),
      ang: z.number().optional().describe("Ang number if available")
    })
  ).describe("Exact scripture references retrieved from the context that support the answer.")
});

// Helper: Get embedding vector from Hugging Face (BAAI/bge-m3)
async function getQueryEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-m3",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
    }
  );

  if (!response.ok) {
    throw new Error(`HF Embedding failed: ${response.statusText}`);
  }

  const embedding = await response.json();
  return Array.isArray(embedding[0]) ? embedding[0] : embedding;
}

// Helper: Search Qdrant Vector Database
async function searchScriptures(queryVector: number[]) {
  const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
  });

  const searchResults = await qdrant.search("sikh_scriptures", {
    vector: queryVector,
    limit: 3,
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
  // Define fallback sequence (Google AI Studio models)
  // Note: Gemma models are text-only, so we exclude them if an image is attached

 /* const models = hasImage
    ? ["gemini-1.5-flash", "gemini-1.5-pro"]
    : ["gemini-3.1-flash", "gemini-3.1-flash-lite", "gemma-2-9b-it","gemma-4-31b","gemma-4-26b"];
*/
  const models = ["gemini-3.1-flash", "gemini-3.1-flash-lite", "gemma-2-9b-it","gemma-4-31b","gemma-4-26b"];

  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Attempting generation with model: ${modelName}...`);

      const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.1,
        maxRetries: 1, // Fail fast so our custom fallback loop takes over immediately
      }).withStructuredOutput(SikhAiSchema);

      const result = await model.invoke(messages);
      console.log(`Success using ${modelName}!`);
      return result;

    } catch (error: any) {
      console.warn(`Model ${modelName} failed (Limit reached or error):`, error.message);
      lastError = error;
      // Loop continues automatically to the next model in the array!
    }
  }

  // If all fallback models fail, throw the last error
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

    // Step 1: Search Qdrant using the text prompt (defaulting to empty string if image-only)
    const queryText = message || "Analyze this scripture image and explain its meaning.";
    const queryVector = await getQueryEmbedding(queryText);
    const retrievedContext = await searchScriptures(queryVector);

    // Step 2: Prepare RAG Prompt & Multimodal Payload
    const contextString = JSON.stringify(retrievedContext, null, 2);
    const ragPrompt = `
You are SikhAI, a respectful assistant grounded in Guru Granth Sahib Ji, Dasam Granth, and Sikh History.
USER QUESTION: "${queryText}"

RETRIEVED SCRIPTURE CONTEXT FROM DATABASE:
${contextString}

INSTRUCTIONS:
1. Answer the user's question using ONLY the provided scripture context above (or by analyzing the uploaded image if one was provided).
2. Always return exact citations from the retrieved context or image.
3. If the context does not contain enough information, acknowledge what is present and state respectfully that additional scripture search is needed. Do NOT invent Gurbani.
`;

    // Construct message payload with optional Base64 Image
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

    // Step 3: Execute generation with automatic Gemini/Gemma fallback
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
