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
    /* ADDED: 
      - sticky & bottom-0: Anchors it to the bottom of the screen.
      - bg-slate-900: Prevents scrolling chat messages from being visible under the input.
      - z-10: Ensures the input stays on top of the scrolling messages.
      - mt-auto: Pushes it to the bottom if the chat is empty.
    */
    <div className="sticky bottom-0 z-10 bg-slate-900 py-2 sm:py-4 flex gap-3 border-t border-slate-700 mt-auto">
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
        className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '...' : 'Send'}
      </button>
    </div>
  );
}
