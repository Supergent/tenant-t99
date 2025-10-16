import { defineApp } from "convex/server";

// Import detected Convex Components
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";

const app = defineApp();

// Configure components (betterAuth MUST be first)
app.use(betterAuth);      // Authentication & sessions
app.use(rateLimiter);     // API rate limiting for production
app.use(agent);           // AI agent orchestration & multi-step reasoning

export default app;
