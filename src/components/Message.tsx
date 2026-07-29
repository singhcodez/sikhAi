// src/components/Message.tsx
import React from 'react';
import { ChatMessage } from '../types';
import Citation from './Citation';

export default function Message({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`p-4 rounded-xl ${isUser ? 'bg-amber-600/10 border border-amber-600/20 ml-auto max-w-[85%]' : 'bg-slate-800 border border-slate-700'}`}>
      <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{message.text}</p>
      
      {message.citations && message.citations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Sources</p>
          {message.citations.map((c, i) => (
            <Citation key={i} data={c} />
          ))}
        </div>
      )}
    </div>
  );
}
