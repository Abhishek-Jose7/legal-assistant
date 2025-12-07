# Legal AI - Your Personal AI Legal Assistant

Legal AI is a comprehensive web application designed to democratize access to legal information in India. It empowers users with AI-driven legal advice, document analysis, and a structured "Know Your Rights" knowledge base.

## 🚀 Key Features

*   **🤖 AI Legal Assistant**: Chat with an intelligent legal assistant powered by LLMs (Groq/OpenRouter). It understands natural language queries, provides legal context, and suggests relevant lawyers.
*   **📚 Know Your Rights**: A browseable, searchable library of legal rights categorized by persona (Student, Woman, Employee, Tenant, etc.). Includes actionable steps, required documents, and example scenarios.
*   **🧠 Legal Health Quiz**: An interactive quiz to assess your legal awareness and get personalized recommendations.
*   **📄 Document Analysis**: Upload legal documents (PDF/Image) for AI-powered summarization and analysis using OCR (Tesseract.js) and PDF parsing.
*   **⚖️ Lawyer Directory**: Find and connect with lawyers specializing in various fields (Consumer, Criminal, Family, etc.).
*   **👤 personalized Dashboard**: Track your learning progress, saved chats, and completed rights modules.
*   **🔒 Secure Authentication**: Robust user management and authentication via Clerk.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **Database**: [Supabase](https://supabase.com/)
*   **AI/LLM**: [Groq SDK](https://console.groq.com/) & [OpenRouter](https://openrouter.ai/) for high-speed inference.
*   **OCR/Document Processing**: `tesseract.js`, `pdf-parse`.
*   **Icons**: [Lucide React](https://lucide.dev/).

## ⚙️ Setup & Installation

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Supabase project
*   A Clerk application
*   Groq / OpenRouter API Keys

### 1. Clone the Repository

```bash
git clone <repository-url>
cd legal-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...

# AI Models
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-v1-...
```

### 4. Database Setup

Run the SQL scripts provided in `supabase_schema_v2.sql` in your Supabase SQL Editor to set up the necessary tables (`profiles`, `user_rights_progress`, `chat_sessions`, etc.) and Row Level Security (RLS) policies.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

*   `src/app`: Next.js App Router pages and API routes.
*   `src/components`: Reusable UI components (`KnowYourRights`, `AIChatSection`, `UserProfile`, etc.).
*   `src/lib`: Utility functions and clients (`supabaseClient`, `legalData`).
*   `src/data`: Static JSON data for legal rights and mock lawyer data.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
