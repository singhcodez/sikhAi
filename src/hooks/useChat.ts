// src/hooks/useChat.ts
import { useState } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({ message: text });
      
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: response.answer,
        citations: response.citations,
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err.message);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: "Apologies, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, sendMessage };
}
