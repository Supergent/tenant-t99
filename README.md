# Todo List Application

A minimal, elegant todo list application built with modern web technologies and real-time synchronization.

## 🏗️ Architecture

This project follows the **four-layer Convex architecture pattern** (The Cleargent Pattern):

1. **Database Layer** (`convex/db/`) - Pure CRUD operations
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic & authentication
3. **Workflow Layer** (`convex/workflows/`) - External service integrations
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions

### Tech Stack

- **Backend**: [Convex](https://convex.dev) - Real-time serverless database & functions
- **Authentication**: [Better Auth](https://better-auth.com) v1.3.27+ with Convex adapter
- **Frontend**: [Next.js 15](https://nextjs.org) App Router with React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) components
- **AI**: OpenAI/Anthropic for intelligent todo assistance
- **Language**: TypeScript with strict mode

## 🔧 Detected Components

This project uses the following Convex Components:

- **Better Auth** (`@convex-dev/better-auth`) - Authentication & session management
- **Rate Limiter** (`@convex-dev/rate-limiter`) - API rate limiting for production
- **Agent** (`@convex-dev/agent`) - AI agent orchestration & multi-step reasoning

## 📋 Prerequisites

- **Node.js** 18+ (20+ recommended)
- **pnpm** 8+ (install with `npm install -g pnpm`)
- **Convex Account** - Sign up at [dashboard.convex.dev](https://dashboard.convex.dev)
- **OpenAI API Key** - Get from [platform.openai.com](https://platform.openai.com) (or Anthropic)

## 🚀 Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

```bash
# Login to Convex (opens browser)
npx convex login

# Initialize Convex project
npx convex dev
```

This will:
- Create a new Convex deployment
- Generate `convex/_generated/` directory
- Install detected components automatically
- Start the Convex development server

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

```bash
# Convex (auto-filled by `convex dev`)
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=  # Generate with: openssl rand -base64 32
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI Provider (choose one)
OPENAI_API_KEY=sk-...  # From platform.openai.com
# OR
# ANTHROPIC_API_KEY=sk-...  # From console.anthropic.com
```

### 4. Install Convex Components

The components are configured in `convex/convex.config.ts` but need to be installed:

```bash
# Install Better Auth component
npx convex components install @convex-dev/better-auth --save

# Install Rate Limiter component
npx convex components install @convex-dev/rate-limiter --save

# Install Agent component
npx convex components install @convex-dev/agent --save
```

### 5. Start Development Servers

```bash
# Start both Convex and Next.js (recommended)
pnpm dev

# Or start separately:
pnpm convex:dev  # Convex backend
pnpm web:dev     # Next.js frontend
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Convex Dashboard**: https://dashboard.convex.dev

## 📁 Project Structure

```
todo-list-convex/
├── convex/                    # Convex backend
│   ├── convex.config.ts       # Component configuration
│   ├── schema.ts              # Database schema
│   ├── auth.ts                # Better Auth setup
│   ├── http.ts                # HTTP routes
│   ├── db/                    # Database layer (Phase 2)
│   ├── endpoints/             # Endpoint layer (Phase 2)
│   ├── workflows/             # Workflow layer (Phase 2)
│   └── helpers/               # Helper layer (Phase 2)
├── apps/
│   └── web/                   # Next.js application (Phase 2)
│       ├── app/               # App Router pages
│       ├── components/        # React components
│       └── lib/               # Utilities & auth clients
├── .env.local                 # Environment variables (do not commit)
└── package.json               # Root dependencies
```

## 🔐 Authentication

This app uses Better Auth with the Convex plugin for seamless authentication:

- **Email/Password** authentication enabled by default
- **Session Management** via JWT tokens (30-day expiration)
- **User Scoping** - All todos are automatically scoped to the authenticated user

## 🧪 Component-Specific Setup Notes

### Better Auth Component
- Configured in `convex/auth.ts`
- HTTP routes in `convex/http.ts` handle auth requests
- Client setup in `apps/web/lib/auth-client.ts` (Phase 2)
- No email verification required for development

### Rate Limiter Component
- Pre-configured rate limits for todo operations
- Token bucket algorithm allows bursts
- Default: 10 requests/minute with burst capacity of 3
- Automatically prevents abuse in production

### Agent Component
- AI-powered todo assistance
- Supports OpenAI and Anthropic models
- Thread-based conversations
- Context-aware suggestions and organization

## 📝 Next Steps

After installation, you can:

1. **Phase 2**: Generate implementation files (db, endpoints, workflows)
2. **Phase 3**: Build the Next.js frontend application
3. **Customize** the schema in `convex/schema.ts` for your needs
4. **Deploy** to production with `npx convex deploy`

## 🛠️ Development Commands

```bash
# Development
pnpm dev                # Start both Convex & Next.js
pnpm convex:dev         # Start Convex only
pnpm web:dev            # Start Next.js only

# Building
pnpm build              # Build Next.js for production

# Convex
npx convex dashboard    # Open Convex dashboard
npx convex deploy       # Deploy to production
npx convex logs         # View function logs

# Setup
pnpm setup              # Install deps & init Convex
```

## 📚 Resources

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This project follows the Cleargent Pattern for Convex applications. See the architecture documentation for contribution guidelines.

## 📄 License

MIT
