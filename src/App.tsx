// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// Aliased 'Settings' to 'SettingsIcon' to avoid clashing with your page name
import { MessageSquare, Info, Settings as SettingsIcon } from 'lucide-react'; 

// Hooks & Context
import { useChat } from './hooks/useChat';
import { SettingsProvider } from './context/SettingsContext';

// Pages & Components
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import About from './pages/About';
import Settings from './pages/Settings'; // Imported your new page

// ============================================================================
// 1. CHAT INTERFACE
// ============================================================================
function ChatInterface() {
  const { messages, loading, error, sendMessage } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-68px)] max-w-3xl mx-auto w-full p-4 sm:p-6">
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            <p>Start a conversation to search scriptures.</p>
          </div>
        )}
        
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        
        {loading && (
          <div className="flex items-center gap-2 text-amber-500/70">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
          </div>
        )}
        
        {error && (
           <p className="text-xs text-red-400 text-center">{error}</p>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>

      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}

// ============================================================================
// 2. TOP NAVIGATION BAR (Updated with Settings Link)
// ============================================================================
function Navigation() {
  const location = useLocation();
  const isChat = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isSettings = location.pathname === '/settings';
  
  return (
    // Note: Removed hardcoded bg-slate-950 to allow Dark/Light mode classes to take over if implemented globally
    <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        
        {/* Logo and Subtitle */}
        <div>
          <h1 className="text-xl font-bold text-amber-500 tracking-tight flex items-center gap-1.5">
            ੴ SikhAI
          </h1>
          <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">Gurbani & History Knowledge Base</p>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link 
            to="/" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isChat ? 'bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-500' : 'text-gray-600 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-400'
            }`}
          >
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Chat</span>
          </Link>
          <Link 
            to="/about" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isAbout ? 'bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-500' : 'text-gray-600 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-400'
            }`}
          >
            <Info size={14} />
            <span className="hidden sm:inline">About</span>
          </Link>
          {/* New Settings Link Added */}
          <Link 
            to="/settings" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isSettings ? 'bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-500' : 'text-gray-600 hover:text-amber-600 dark:text-slate-200 dark:hover:text-amber-400'
            }`}
          >
            <SettingsIcon size={14} />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}

// ============================================================================
// 3. MAIN APP ROUTER SHELL (Wrapped in SettingsProvider)
// ============================================================================
export default function App() {
  return (
    // DRY Code: Wrapping the router ensures useSettings() works everywhere
    <SettingsProvider>
      <Router>
        {/* Let Tailwind handle the global background via Light/Dark mode */}
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-200">
          
          <Navigation />
          
          <main className="flex-1 flex flex-col w-full">
            <Routes>
              <Route path="/" element={<ChatInterface />} />
              <Route path="/about" element={<About />} />
              {/* Connected Settings Route */}
              <Route path="/settings" element={<Settings />} /> 
            </Routes>
          </main>

        </div>
      </Router>
    </SettingsProvider>
  );
}
