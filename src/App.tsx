 // src/App.tsx
import React, { useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat';
import Message from './components/Message';
import ChatInput from './components/ChatInput';

export default function App() {
  const { messages, loading, error, sendMessage } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col p-4 sm:p-6">
      <header className="py-4 text-center">
        <h1 className="text-3xl font-bold text-amber-500 tracking-tight">ੴ SikhAI</h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">Gurbani & History Knowledge Base</p>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            <p>Start a conversation to search scriptures.</p>
          </div>
        )}
        
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        
        {loading && (
          <div className="flex items-center gap-2 text-amber-500/70">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
          </div>
        )}
        
        {error && (
           <p className="text-xs text-red-400 text-center">{error}</p>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>

      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}
