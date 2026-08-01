// src/types/index.ts

// src/types/index.ts

export interface Citation {
  gurmukhi: string;
  english: string;
  hindi?: string;
  source: string;
  author: string;
  ang?: number;
}

export interface ChatMessage {
  id?: string;
  sender: 'user' | 'bot' | 'assistant'; // Supports whatever your useChat hook uses!
  text: string;
  citations?: CitationData[];
}

export type TranslationLanguage = 'english' | 'hindi';


export interface ApiRequest {
  message: string;
  imageBase64?: string;
}

export interface ApiResponse {
  answer: string;
  citations: Citation[];
  error?: string;
}
