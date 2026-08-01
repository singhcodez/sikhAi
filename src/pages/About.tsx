// src/pages/About.tsx
import React from 'react';
import { Heart, ShieldCheck, Database, Code2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-slate-200">
      
      {/* Header Section */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-bold text-amber-500">About SikhAI</h1>
        <p className="text-slate-400 text-sm">
          A Nishkam (Selfless) Digital Seva for the Global Sangat.
        </p>
      </div>

      {/* 1. Free & Funding Section */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="text-rose-400" size={24} />
          <h2 className="text-xl font-semibold text-white">100% Free & Community Funded</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-300 mb-4">
          SikhAI is built as a free educational tool. We do not run ads, and we do not sell your data. 
          To keep the AI running for everyone, we rely entirely on community donations to cover our monthly server and API costs.
        </p>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Where do funds go?</h3>
          <ul className="text-sm space-y-2 text-slate-400 list-disc list-inside">
            <li>Google Gemini AI API (Processing user questions)</li>
            <li>Qdrant Vector Database (Searching scriptures instantly)</li>
            <li>Vercel Cloud Hosting (Keeping the website live)</li>
          </ul>
        </div>
        {/* Placeholder for your actual donation link */}
        <button className="mt-5 w-full md:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors">
          Support the Seva (Donate)
        </button>
      </section>

      {/* 2. Security & Privacy Section */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-emerald-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Your privacy is strictly protected. We do not require you to create an account or log in to use the bot. 
          Chat logs are stored locally on your own device. The only data we collect is anonymous feedback (when you click the 👍 or 👎 buttons) 
          so our human admins can correct any AI mistakes and improve the system.
        </p>
      </section>

      {/* 3. Legal & Technology Attribution Section */}
      <section className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-blue-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Technology & Data Sources</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-300 mb-4">
          SikhAI is powered by a Retrieval-Augmented Generation (RAG) architecture. To prevent AI hallucinations, 
          the bot is strictly restricted to reading from verified databases. We extend our deepest gratitude to the following platforms:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50">
            <Code2 className="text-slate-500 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-slate-200">BaniDB & Shabad OS</p>
              <p className="text-xs text-slate-500">For providing the open-source, peer-reviewed Gurbani text and translations.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50">
            <Code2 className="text-slate-500 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-slate-200">Google Gemini AI</p>
              <p className="text-xs text-slate-500">For providing the Large Language Model (LLM) processing engine.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50">
            <Code2 className="text-slate-500 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-slate-200">Qdrant Cloud</p>
              <p className="text-xs text-slate-500">For powering the high-speed vector scripture search.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/50">
            <Code2 className="text-slate-500 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-medium text-slate-200">Supabase</p>
              <p className="text-xs text-slate-500">For securely storing our Continuous Learning feedback loop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <p className="text-center text-xs text-slate-500 pt-4">
        SikhAI is an independent, open-source initiative. <br />
        Built with reverence and respect.
      </p>

    </div>
  );
}
