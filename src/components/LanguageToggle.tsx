// src/components/LanguageToggle.tsx
import React from 'react';
import { TranslationLanguage } from '../types';

interface LanguageToggleProps {
  currentLanguage: TranslationLanguage;
  setLanguage: (lang: TranslationLanguage) => void;
}

export default function LanguageToggle({ currentLanguage, setLanguage }: LanguageToggleProps) {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
      <button
        onClick={() => setLanguage('english')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentLanguage === 'english'
            ? 'bg-white shadow-sm text-amber-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('hindi')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentLanguage === 'hindi'
            ? 'bg-white shadow-sm text-amber-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        हिंदी (Hindi)
      </button>
    </div>
  );
}
