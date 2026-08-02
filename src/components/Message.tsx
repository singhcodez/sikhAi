// src/components/Message.tsx
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ChatMessage } from '../types';
import Citation from './Citation';
import { useSettings } from '../context/SettingsContext'; // 1. Imported our DRY Context

interface MessageProps {
  message: ChatMessage;
  // 2. Removed `preferredLanguage` from here. We get it globally now!
}

export default function Message({ message }: MessageProps) {
  // 3. Grab the dynamic font size and language from Settings
  const { settings } = useSettings(); 
  
  const isUser = message.sender === 'user';
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedbackGiven(type);
    // TODO: We will wire this up to Supabase in the next step!
    console.log(`User voted: ${type} on message: ${message.text.substring(0, 20)}...`);
  };
  
  return (
    // 4. Added Light Mode fallback classes (e.g., bg-white, bg-amber-100)
    <div className={`p-4 rounded-xl ${
      isUser 
        ? 'bg-amber-100 dark:bg-amber-600/10 border border-amber-200 dark:border-amber-600/20 ml-auto max-w-[85%]' 
        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 w-full shadow-sm dark:shadow-none'
    }`}>
      
      {/* 5. Main Chat Text - Connected to the Gurbani Font Size slider */}
      <p 
        className={`whitespace-pre-wrap leading-relaxed ${
          isUser 
            ? 'text-amber-900 dark:text-amber-50 text-sm font-medium' 
            : 'text-gray-800 dark:text-slate-200'
        }`}
        style={!isUser ? { fontSize: `${settings.gurbaniFontSize}px` } : {}}
      >
        {message.text}
      </p>
      
      {/* Scripture Citations */}
      {!isUser && message.citations && message.citations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-slate-400">Sources</p>
          {message.citations.map((c, i) => (
            <Citation 
              key={i} 
              data={c} 
              preferredLanguage={settings.language} // 6. Passed globally selected language dynamically
            />
          ))}
        </div>
      )}

      {/* Continuous Learning Feedback Buttons (RLHF) */}
      {!isUser && (
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-slate-700/50">
          <span className="text-[10px] text-gray-500 dark:text-slate-400 font-medium uppercase tracking-widest">Was this helpful?</span>
          <button 
            onClick={() => handleFeedback('up')}
            disabled={feedbackGiven !== null}
            className={`p-1.5 rounded-md transition-colors ${
              feedbackGiven === 'up' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-emerald-400'
            }`}
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={() => handleFeedback('down')}
            disabled={feedbackGiven !== null}
            className={`p-1.5 rounded-md transition-colors ${
              feedbackGiven === 'down' 
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-rose-400'
            }`}
          >
            <ThumbsDown size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
