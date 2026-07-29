// src/components/ChatInput.tsx
import React, { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex gap-3 pt-4 border-t border-slate-700">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={loading}
        placeholder="Ask about Gurbani or Sikh History..."
        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-shadow disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '...' : 'Send'}
      </button>
    </div>
  );
}
