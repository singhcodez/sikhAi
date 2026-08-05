# ੴ SikhAIBot

SikhAIBot is a free, highly accurate, community-driven Artificial Intelligence platform designed to provide interactive knowledge and translations from **Sri Guru Granth Sahib Ji**, **Dasam Granth**, and **Sikh History**. 

Built entirely as a digital *Seva*, it utilizes a strict **Retrieval-Augmented Generation (RAG)** pipeline to ensure all answers are deeply rooted in peer-reviewed, authentic scripture and historical texts without AI hallucination.

## 🌟 3 Core Pillars

1. **User Experience (UX)**
   - **Accessible UI:** Dark/Light mode, adjustable Gurbani font sizes, and instant translations (English, Punjabi, Spanish).
   - **Continuous Learning (RLHF):** Integrated 👍/👎 feedback buttons on every AI response allowing the Sangat to improve the model continually.
   - **Multimodal Uploads:** Users can upload images of Gurmukhi text or historical artifacts to receive instant AI translations and context.
   - **Token-Optimized:** Performs complex reasoning in English (saving API tokens and latency), then translates final conversational text into the preferred language, while directly injecting untouched, authentic Gurmukhi scripture from the database.

2. **Security**
   - **Serverless API Isolation:** Hosted on Vercel (`/api/chat.ts`), ensuring that critical API keys (Google Gemini, Qdrant Vector DB, Supabase) are never exposed to the client browser.
   - **Deterministic Validation:** All incoming user prompts and outgoing AI responses are strictly validated via **Zod** schemas, preventing prompt injections and malformed JSON.
   - **Data Safety:** Vector databases safely and permanently store all parsed scriptures. 

3. **DRY Code (Don't Repeat Yourself)**
   - **Centralized Typings:** Single Source of Truth in `src/types/index.ts` for strictly typed interfaces.
   - **Modular UI:** Reusable, single-responsibility React components (`Citation.tsx`, `Message.tsx`, `ChatInput.tsx`).
   - **Global State Context:** Settings preferences (font size, language, theme) are managed centrally without prop-drilling via `SettingsContext.tsx`.

## 🛠 Tech Stack

* **Frontend:** Vite, React, TypeScript, Tailwind CSS, React Router DOM
* **Backend:** Vercel Serverless Functions (`/api/*`)
* **Vector Database:** Qdrant Cloud (Fast, Int8 Scalar Quantization for memory efficiency)
* **Relational Database:** Supabase PostgreSQL (For User Feedback & RLHF)
* **AI Engine:** Google Gemini (Gemini Flash for reasoning, Gemini-Embedding-001 for vectorization)

## 📂 Architecture Overview

```text
src/
├── api/
│   └── chat.ts             # Secure Serverless Backend (RAG, Gemini logic, Zod validation)
├── components/
│   ├── ChatInput.tsx       # UI for user queries & multimodal image uploads
│   ├── Citation.tsx        # UI explicitly separating AI text from authentic Gurbani citations
│   ├── Message.tsx         # Chat bubble with 👍/👎 feedback integration
│   └── Navigation.tsx      # Top bar for seamless React routing
├── context/
│   └── SettingsContext.tsx # Centralized global state & LocalStorage sync
├── hooks/
│   └── useChat.ts          # Centralized data fetching & side-effect handling
├── pages/
│   ├── About.tsx           # Transparency & Funding information
│   └── Settings.tsx        # Font sizing & Theme controls
├── services/
│   └── api.ts              # Single Source of Truth for frontend network requests
├── types/
│   └── index.ts            # Strict TypeScript interfaces
├── App.tsx                 # Main application shell and router wrapper
└── main.tsx                # Entry point
```

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- Node.js installed
- Free accounts on: [Google AI Studio](https://aistudio.google.com/), [Qdrant Cloud](https://qdrant.tech/), and [Supabase](https://supabase.com/).

### 2. Clone and Install
```bash
git clone https://github.com/your-username/sikh-ai-bot.git
cd sikh-ai-bot
npm install
```

### 3. Environment Variables (Security First)
Create a `.env` (or `.env.local`) file in the root directory and add your credentials. **Never commit this file to GitHub.**
```env
GOOGLE_API_KEY=your_google_gemini_key
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
```

### 4. Run the Application
```bash
npm run dev
```

## 🤝 Transparency & Funding

To maintain SikhAIBot as a 100% free tool for the public, we operate with complete financial transparency. API and server costs are covered by community donations. 
Visit our `/donate` page or Open Collective to view our public ledger and support the Seva.

