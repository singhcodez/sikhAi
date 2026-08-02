import React from 'react';
import { useSettings, Theme, Language } from '../context/SettingsContext';

export default function Settings() {
  // DRY: Bring in our global state functions easily
  const { settings, updateTheme, updateFontSize, updateLanguage } = useSettings();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4 dark:border-gray-700">App Preferences</h1>
      
      <div className="space-y-8">
        
        {/* THEME TOGGLE */}
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Adjust the visual theme of SikhAIBot to protect your eyes during nighttime reading.</p>
          <div className="flex gap-4">
            {(['light', 'dark'] as Theme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => updateTheme(theme)}
                className={`px-6 py-2 rounded-lg font-medium capitalize transition-all ${
                  settings.theme === theme 
                    ? 'bg-amber-600 text-white shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {theme} Mode
              </button>
            ))}
          </div>
        </section>

        {/* FONT SIZE SLIDER FOR GURBANI */}
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Gurbani Font Size</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Increase the font size specifically for Gurmukhi script for better readability.</p>
          
          <input 
            type="range" 
            min="16" 
            max="48" 
            step="2"
            value={settings.gurbaniFontSize} 
            onChange={(e) => updateFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-amber-600"
          />
          
          <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-600 text-center shadow-inner">
            <span className="text-sm text-gray-400 block mb-2">Live Preview</span>
            <p 
              className="text-amber-700 dark:text-amber-500 font-bold leading-relaxed" 
              style={{ fontSize: `${settings.gurbaniFontSize}px` }}
            >
              ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥
            </p>
          </div>
        </section>

        {/* LANGUAGE SELECTOR */}
        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Default Explanation Language</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose the language SikhAIBot will use when explaining meanings and history.</p>
          <select 
            value={settings.language}
            onChange={(e) => updateLanguage(e.target.value as Language)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="hindi">Hindi</option>
          </select>
        </section>

      </div>
    </div>
  );
}
