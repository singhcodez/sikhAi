import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define Strict Types for Security & Predictability
export type Theme = 'light' | 'dark';
export type Language = 'English' | 'Punjabi' | 'Spanish';

interface SettingsState {
  theme: Theme;
  gurbaniFontSize: number; 
  language: Language;
}

interface SettingsContextType {
  settings: SettingsState;
  updateTheme: (theme: Theme) => void;
  updateFontSize: (size: number) => void;
  updateLanguage: (lang: Language) => void;
}

// Default preferences
const defaultSettings: SettingsState = {
  theme: 'light',
  gurbaniFontSize: 24, // Optimized default for Gurmukhi readability
  language: 'English',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // 2. Securely Initialize from LocalStorage (Fallback to defaults if missing/corrupt)
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem('sikhai_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // 3. Sync to LocalStorage & DOM when settings change (DRY Code)
  useEffect(() => {
    localStorage.setItem('sikhai_settings', JSON.stringify(settings));
    
    // Instantly apply Dark Mode to the entire app via Tailwind's 'dark' class
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateTheme = (theme: Theme) => setSettings((s) => ({ ...s, theme }));
  const updateFontSize = (gurbaniFontSize: number) => setSettings((s) => ({ ...s, gurbaniFontSize }));
  const updateLanguage = (language: Language) => setSettings((s) => ({ ...s, language }));

  return (
    <SettingsContext.Provider value={{ settings, updateTheme, updateFontSize, updateLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 4. Custom Hook for absolute simplicity in other files
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
 