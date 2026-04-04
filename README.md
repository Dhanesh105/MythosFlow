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
- **Database**: PostgreSQL (Supabase recommended)
- **AI Services**: Gemini 1.5 Pro (embeddings + text), Replicate (Stable Diffusion XL)
- **Vector DB**: Pinecone
- **UI Libraries**: TanStack Query, dnd-kit

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase account recommended)
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
# Database
DATABASE_URL="postgresql://user:password@host:5432/mythosflow?schema=public"

# AI Services
GEMINI_API_KEY="your_gemini_api_key"
REPLICATE_API_TOKEN="your_replicate_token"

# Pinecone
PINECONE_API_KEY="your_pinecone_key"
PINECONE_ENVIRONMENT="your_pinecone_environment"
PINECONE_INDEX_NAME="mythosflow"
```

### 4. Set Up Database

Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Create Pinecone Index

1. Log in to [Pinecone](https://www.pinecone.io/)
2. Create a new index named `mythosflow`
3. Set dimensions to `768` (for Gemini text-embedding-004)
4. Choose your preferred metric (cosine recommended)

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### 1. Build Your Lore Vault

1. Navigate to **Lore Vault**
2. Add world bible snippets (characters, locations, rules, etc.)
3. Each entry is automatically embedded and stored in Pinecone

### 2. Write with Context

1. Go to **Script Editor**
2. Write your script
3. Click **Search Lore** to find relevant context from your vault
4. The most similar lore entries appear in the side panel

### 3. Generate Scene Images

1. Select a scene paragraph in the editor
2. Click **Generate Scene**
3. AI transforms your scene into a Stable Diffusion prompt
4. Image is generated and ready to send to storyboard

### 4. Organize Your Storyboard

1. Open **Storyboard**
2. Drag generated images to arrange them
3. Add dialogue and camera angle notes
4. Click **Save** to persist positions
5. Export as PDF for sharing

## Project Structure

```
mythosflow/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── lore-vault/        # Lore management
│   ├── editor/            # Script editor
│   └── storyboard/        # Visual canvas
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   ├── dashboard/        # Dashboard components
│   ├── lore/            # Lore components
│   ├── editor/          # Editor components
│   └── storyboard/      # Storyboard components
├── lib/                  # Utilities and services
│   ├── ai/              # AI service classes
│   └── db/              # Database client
├── actions/             # Server Actions
└── prisma/              # Database schema
```

## API Costs

Be aware of API usage costs:

- **Gemini**: Free tier available, then pay-as-you-go
- **Replicate**: ~$0.0044 per image (SDXL)
- **Pinecone**: Free tier (100k vectors), then $70/month

## Future Enhancements

- [ ] User authentication and multi-tenancy
- [ ] Collaborative editing
- [ ] PDF export with custom layouts
- [ ] Video storyboard generation
- [ ] Voice character generation
- [ ] Timeline view for scripts

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
