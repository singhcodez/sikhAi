// src/services/api.ts
import { ApiRequest, ApiResponse } from '../types';

export const sendChatMessage = async (payload: ApiRequest): Promise<ApiResponse> => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch response');
  }
  
  return data;
};
