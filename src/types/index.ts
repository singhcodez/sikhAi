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
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
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
