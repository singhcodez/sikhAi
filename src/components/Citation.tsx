// src/components/Citation.tsx
import React from 'react';
import { Language } from '../context/SettingsContext'; 

interface CitationData {
  gurmukhi: string;
  english: string;
  hindi?: string;
  source: string;
  author: string;
  ang?: number;
}

interface CitationProps {
  data: CitationData;
  preferredLanguage: Language;
}

export default function Citation({ data, preferredLanguage }: CitationProps) {
  // Check if they want Hindi, but the database doesn't have it yet
  const showHindiFallback = preferredLanguage === 'hindi' && !data.hindi;

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 my-2">
      <p className="text-lg text-center text-amber-500 font-medium mb-3 leading-loose">
        {data.gurmukhi}
      </p>
      
      <p className="text-slate-300 text-center italic mb-2 text-sm">
        {preferredLanguage === 'hindi' && data.hindi 
          ? data.hindi 
          : data.english}
      </p>

      {/* UX Pillar: Politely inform the user if Hindi is pending */}
      {showHindiFallback && (
        <p className="text-center text-[10px] text-amber-500/70 mb-4 italic">
          * Hindi translation is currently indexing. Showing English.
        </p>
      )}
      
      <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider border-t border-slate-700/50 pt-2 mt-2">
        <span className="font-semibold">{data.source}</span>
        <span>{data.author} {data.ang ? `• Ang ${data.ang}` : ''}</span>
      </div>
    </div>
  );
}
