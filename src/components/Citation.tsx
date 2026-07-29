// src/components/Citation.tsx
import React from 'react';
import { Citation as CitationType } from '../types';

export default function Citation({ data }: { data: CitationType }) {
  return (
    <div className="text-xs bg-slate-900 p-3 rounded mt-2 border-l-2 border-amber-500">
      <p className="font-semibold text-amber-200 text-sm">{data.gurmukhi}</p>
      <p className="italic text-slate-300 mt-1">{data.english}</p>
      <p className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">
        — {data.source} ({data.author})
      </p>
    </div>
  );
}
