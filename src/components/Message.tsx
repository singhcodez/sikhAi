// src/components/Message.tsx
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ChatMessage } from '../types'; // Adjust if you have TranslationLanguage exported here
import Citation from './Citation';

interface MessageProps {
  message: ChatMessage;
  preferredLanguage?: 'english' | 'hindi'; // Default to english if not provided yet
}

export default function Message({ message, preferredLanguage = 'english' }: MessageProps) {
  const isUser = message.sender === 'user';
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedbackGiven(type);
    // TODO: We will wire this up to Supabase in the next step!
    console.log(`User voted: ${type} on message: ${message.text.substring(0, 20)}...`);
  };
  
  return (
    <div className={`p-4 rounded-xl ${isUser ? 'bg-amber-600/10 border border-amber-600/20 ml-auto max-w-[85%]' : 'bg-slate-800 border border-slate-700 w-full'}`}>
      
      {/* 1. Main Chat Text */}
      <p className={`text-sm font-medium whitespace-pre-wrap leading-relaxed ${isUser ? 'text-amber-50' : 'text-slate-200'}`}>
        {message.text}
      </p>
      
      {/* 2. Scripture Citations */}
      {!isUser && message.citations && message.citations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Sources</p>
          {message.citations.map((c, i) => (
            <Citation 
              key={i} 
              data={c} 
              preferredLanguage={preferredLanguage} 
            />
          ))}
        </div>
      )}

      {/* 3. Continuous Learning Feedback Buttons (RLHF) */}
      {!isUser && (
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-700/50">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Was this helpful?</span>
          <button 
            onClick={() => handleFeedback('up')}
            disabled={feedbackGiven !== null}
            className={`p-1.5 rounded-md transition-colors ${
              feedbackGiven === 'up' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-emerald-400'
            }`}
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={() => handleFeedback('down')}
            disabled={feedbackGiven !== null}
            className={`p-1.5 rounded-md transition-colors ${
              feedbackGiven === 'down' 
                ? 'bg-rose-500/20 text-rose-400' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-rose-400'
            }`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
