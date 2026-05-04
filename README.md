# MythosFlow - AI-Driven Storytelling SaaS

An AI-powered storytelling platform for sci-fi and mythology creators, featuring RAG-powered lore management, AI image generation, and interactive storyboarding.

## Features

- **Lore Vault**: RAG-powered knowledge base with semantic search
- **Context-Aware Editor**: Write scripts with AI-assisted lore context
- **Scene-to-Prompt Engine**: Transform scenes into AI-generated images
- **Interactive Storyboard**: Drag-and-drop canvas for visual planning

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Shadcn/UI, Lucide Icons
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL (Railway or Supabase recommended)
- **AI Services**: Gemini 1.5 Pro (embeddings + text), Replicate (Stable Diffusion XL)
- **Vector DB**: Pinecone
- **UI Libraries**: TanStack Query, dnd-kit, Sonner

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- API keys for:
  - Google AI Studio (Gemini)
  - Replicate
  - Pinecone

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Railway Public URL or Supabase URL)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# AI Services
GEMINI_API_KEY="your_gemini_api_key"
REPLICATE_API_TOKEN="your_replicate_token"

# Pinecone
PINECONE_API_KEY="your_pinecone_key"
PINECONE_ENVIRONMENT="your_pinecone_environment"
PINECONE_INDEX_NAME="mythosflow"
```

### 4. Set Up Database

Run Prisma commands to sync schema and generate client:

```bash
npx prisma generate
npx prisma db push
```

### 5. Create Pinecone Index

1. Log in to [Pinecone](https://www.pinecone.io/)
2. Create a new index named `mythosflow`
3. Set dimensions to `768` (for Gemini text-embedding-004)
4. Choose `cosine` metric.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mythosflow/
├── app/                    # Next.js App Router pages
├── components/            # React components
├── lib/                  # Utilities and services
│   ├── ai/              # AI service classes
│   └── db/              # Database client & initialization
├── actions/             # Server Actions
└── prisma/              # Database schema
```

## License

MIT
