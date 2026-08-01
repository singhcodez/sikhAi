// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MessageSquare, Info } from 'lucide-react';
import { useChat } from './hooks/useChat';
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import About from './pages/About';

// Chat Screen Component
function ChatScreen() {
  const { messages, loading, error, sendMessage } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-73px)] max-w-3xl mx-auto w-full p-4 sm:p-6">
      <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-20">
            <p className="text-sm">Start a conversation or ask about Gurbani scriptures.</p>
          </div>
        )}
        
        {messages.map((m, index) => (
          <Message key={index} message={m} />
        ))}
        
        {loading && (
          <div className="flex items-center gap-2 text-amber-500/70 p-4">
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

// Main App Router Shell
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        
        {/* Persistent Navigation Header */}
        <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-amber-500 tracking-tight flex items-center gap-1.5">
                ੴ SikhAI
              </h1>
            </div>
            
            <nav className="flex items-center gap-3">
              <Link 
                to="/" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:text-amber-400 transition-colors"
              >
                <MessageSquare size={14} />
                <span>Chat</span>
              </Link>
              <Link 
                to="/about" 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:text-amber-400 transition-colors"
              >
                <Info size={14} />
                <span>About & Funding</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Route Switching Body */}
        <main className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/" element={<ChatScreen />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}
