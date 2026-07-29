// src/types/index.ts

export interface Citation {
  gurmukhi: string;
  english: string;
  source: string;
  author: string;
}

export interface ChatMessage {
  id: string; // Add an ID for React keys
  sender: 'user' | 'bot';
  text: string;
  citations?: Citation[];
}

export interface ApiRequest {
  message: string;
  imageBase64?: string;
}

export interface ApiResponse {
  answer: string;
  citations: Citation[];
  error?: string;
}
