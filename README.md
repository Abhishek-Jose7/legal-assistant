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
