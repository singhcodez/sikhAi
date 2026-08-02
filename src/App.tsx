// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Info } from 'lucide-react';
import { useChat } from './hooks/useChat';
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import About from './pages/About';

// ============================================================================
// 1. CHAT INTERFACE (Your original code, converted into a routeable component)
// ============================================================================
function ChatInterface() {
  const { messages, loading, error, sendMessage } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
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
// 2. TOP NAVIGATION BAR (Shows active state based on route)
// ============================================================================
function Navigation() {
  const location = useLocation();
  const isChat = location.pathname === '/';
  
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        
        {/* Logo and Subtitle */}
        <div>
          <h1 className="text-xl font-bold text-amber-500 tracking-tight flex items-center gap-1.5">
            ੴ SikhAI
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">Gurbani & History Knowledge Base</p>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-3">
          <Link 
            to="/" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isChat ? 'bg-amber-600/20 text-amber-500' : 'bg-slate-800 text-slate-200 hover:text-amber-400'
            }`}
          >
            <MessageSquare size={14} />
            <span>Chat</span>
          </Link>
          <Link 
            to="/about" 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !isChat ? 'bg-amber-600/20 text-amber-500' : 'bg-slate-800 text-slate-200 hover:text-amber-400'
            }`}
          >
            <Info size={14} />
            <span>About</span>
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
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
        
        {/* The persistent header */}
        <Navigation />
        
        {/* The main content area that swaps between pages */}
        <main className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
