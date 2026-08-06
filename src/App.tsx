// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Info, Settings as SettingsIcon } from 'lucide-react'; 

// Hooks & Context
import { useChat } from './hooks/useChat';
import { SettingsProvider } from './context/SettingsContext';

// Pages & Components
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import About from './pages/About';
import Settings from './pages/Settings'; 

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
    // UX Pillar: flex-1 and h-full ensure this component fills the remaining screen space perfectly.
    <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto h-full">
      
      {/* SCROLLING MIDDLE SECTION */}
      {/* flex-1 overflow-y-auto forces ONLY this box to scroll, leaving the input fixed below it. */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
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

      {/* FIXED BOTTOM CHAT INPUT */}
      {/* Because it sits outside the overflow-y-auto div, it acts as a fixed footer. */}
      <div className="p-4 sm:px-6 sm:pb-6 pt-2 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}

// ============================================================================
// 2. TOP NAVIGATION BAR
// ============================================================================
function Navigation() {
  const location = useLocation();
  const isChat = location.pathname === '/';
  const isAbout = location.pathname === '/about';
  const isSettings = location.pathname === '/settings';
  
  return (
    // DRY Code: Cleaned up the duplicate "sticky" class and ensured borders adapt to dark/light mode.
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 transition-colors duration-200">
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
// 3. MAIN APP ROUTER SHELL
// ============================================================================
export default function App() {
  return (
    <SettingsProvider>
      <Router>
        {/* 
          UX Pillar: Using `h-screen` instead of `min-h-screen` guarantees the app 
          never exceeds the device's visible height, preventing double-scrollbars on mobile browsers.
        */}
        <div className="h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-200">
          
          <Navigation />
          
          {/* 
            flex-1 overflow-hidden ensures the <main> block fills the space between the header 
            and the bottom of the screen, safely containing the chat UI.
          */}
          <main className="flex-1 flex flex-col w-full overflow-hidden">
            <Routes>
              <Route path="/" element={<ChatInterface />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} /> 
            </Routes>
          </main>

        </div>
      </Router>
    </SettingsProvider>
  );
}
