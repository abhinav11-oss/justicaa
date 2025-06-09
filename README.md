# ⚖️ Justicaa – Your AI Partner for Legal Help, Documents & Lawyers

**Justicaa** is a professional-grade AI-powered legal assistant built for Indian citizens. From filing RTIs to understanding rights during police arrests, Justicaa simplifies law with intelligent chat, auto-generated legal documents, and multilingual support.

---

## 🌐 Live Demo

🚀 **Try now:** [https://justicaa.vercel.app/](https://justicaa.vercel.app/)

---

## 📁 Project Structure

justicaa/
│
├── public/                         # Static files served directly (no processing)
│   ├── _redirects                  # Netlify/Vercel redirect rules
│   ├── favicon.ico                 # Website icon
│   ├── placeholder.svg             # Placeholder image
│   └── robots.txt                  # SEO crawler rules
│
├── src/                            # Main application source code
│   ├── components/                 # Reusable UI components (Chat UI, Sidebar, etc.)
│   ├── hooks/                      # Custom React hooks (e.g. auth, form state)
│   ├── integrations/supabase/     # Supabase client config & session handlers
│   ├── lib/                        # Utility functions (formatting, helpers)
│   ├── pages/                      # Page-level components (e.g., Home, Docs)
│   ├── App.tsx                     # Root component & layout provider
│   ├── App.css                     # App-specific styles
│   ├── main.tsx                    # ReactDOM mount point
│   ├── index.css                   # Global TailwindCSS + base styles
│   └── vite-env.d.ts               # Vite environment type declarations
│
├── supabase/                       # Supabase edge functions & project config
│   ├── functions/                  # Serverless functions (API routes, triggers)
│   └── config.toml                 # Supabase project configuration
│
├── .gitignore                      # Git ignored files list
├── README.md                       # 📘 Project documentation
├── bun.lockb                       # Bun package lock file (if using Bun)
├── components.json                 # UI component metadata (used by builder tools)
├── eslint.config.js                # Linting rules for code quality
├── index.html                      # Entry point HTML for Vite
├── package.json                    # Project dependencies & scripts
├── package-lock.json               # Exact dependency versions for npm
├── postcss.config.js               # PostCSS config (used with Tailwind)
├── tailwind.config.ts              # TailwindCSS theme & extensions
├── tsconfig.app.json               # TypeScript config for the app
├── tsconfig.json                   # Global TypeScript configuration
├── tsconfig.node.json              # TS config for backend/node files
├── vercel.json                     # Vercel deployment configuration
└── vite.config.ts                  # Vite bundler configuration


## 🚀 Features

- 💬 **AI Chatbot:** Natural-language legal Q&A
- 📄 **Document Generator:** RTI, FIR, complaint letters, etc.
- 🇮🇳 **Indian Legal Coverage:** IPC, RTI, NDPS, Consumer Law & more
- 🌍 **Multilingual:** English + Hindi support
- 📱 **Mobile-First UI:** Tailwind + ShadCN
- 🔐 **Supabase Auth:** Secure user login/signup

---

## 🧠 Problem Statement

Millions of Indians face:
- Lack of access to timely legal aid
- No knowledge of rights during arrests or disputes
- High cost and delay with traditional legal services

**Justicaa** empowers users to get **instant**, **reliable**, and **affordable** legal help.

---

## 💡 Solution

Justicaa is a digital legal assistant that:
- Explains rights and procedures
- Offers interactive legal chat
- Provides downloadable legal documents
- Connects users with trusted legal info sources

---

## 🏗️ Tech Stack

| Layer        | Technology                         |
|--------------|-------------------------------------|
| Frontend     | React + Vite + TypeScript + TailwindCSS + ShadCN |
| Backend      | Supabase (Auth, Edge Functions, DB) |
| AI Engine    | OpenAI GPT API + LangChain          |
| Hosting      | Vercel                              |
| Dev Tools    | GitHub, Postman, Supabase CLI       |

---

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/justicaa.git
cd justicaa

Install Dependencies
npm install

Set Up Environment Variables
Create a .env file in the root with:

VITE_OPENAI_API_KEY=your-openai-api-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

Local Development
npm run dev
```

🧭 **User Journey**  
- User opens app and enters a legal query  
- AI responds with advice, steps, and resources  
- User generates documents (e.g., RTI, complaints)  
- Authenticated users can download docs and track chats  

---

📊 **Roadmap**  
- OpenAI Chat Integration  
- Supabase Auth  
- Document Generator  
- Lawyer Connect (Coming Soon)  
- Regional Language Support (Future)  
- WhatsApp Integration (Future)  

---

🎯 **Use Cases**  
- Students confused about RTI process  
- Citizens facing police harassment  
- Startups needing legal docs  
- Rural India with no easy legal access  

---

📸 **Screenshots**  
*(Add real screenshots in `public/screenshots/`)*  
- Home page :
- ![image](https://github.com/user-attachments/assets/52bff9a8-90a9-408e-92c0-6c74fde6594d)
- ![image](https://github.com/user-attachments/assets/ed0ce47a-064a-43ea-b246-4f46d45e3632)
- ![image](https://github.com/user-attachments/assets/27bc67e8-29eb-4884-b705-14a5f0491889)


- Chatbot interface :
- ![image](https://github.com/user-attachments/assets/e46ec6eb-5342-406d-a6b4-6f6e81aa9d77)


- Document Generator :
- ![image](https://github.com/user-attachments/assets/4ff58e25-540b-47a3-ad41-90b4c3d5ddce)
- ![image](https://github.com/user-attachments/assets/1448bce7-754e-46b8-80c9-ea082dae3cd1)


- Generated Document :
- ![image](https://github.com/user-attachments/assets/9e8b12d4-8e1d-4241-a96d-af5fc91ba617)


- Login / Signup :
- ![image](https://github.com/user-attachments/assets/51be440b-9ba4-4d5b-a513-e54cfa3c55d1)
- ![image](https://github.com/user-attachments/assets/8984fa3d-b0a7-4ecf-86d2-55132d0d8f12)


---

📈 **Market Potential**  
- 🧑‍⚖️ 1.4B+ people in India – huge legal literacy gap  
- 💼 $2B+ legal tech industry and growing  
- 🌍 Scaling to NGOs, college students, startups & public portals  

---

⚠️ **Disclaimer**  
Justicaa is intended for informational purposes only.  
It is **not** a substitute for legal advice from a licensed professional.  

---

👥 **Team**  
- Team: ctrl+alt+Elite    
- Email: [abhinavlodhi99@gmail.com](mailto:abhinavlodhi99@gmail.com)  




