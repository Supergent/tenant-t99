import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth Client for Convex
 *
 * Provides authentication utilities for the Convex backend.
 * Use authComponent.getAuthUser(ctx) to get the authenticated user in queries/mutations.
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth Instance
 *
 * Configures Better Auth with Convex adapter and authentication methods.
 * This function is called by HTTP routes to handle auth requests.
 *
 * @param ctx - Convex context
 * @param options - Configuration options
 * @returns Better Auth instance
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,
    database: authComponent.adapter(ctx),

    // Email and password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Disabled for development
    },

    plugins: [
      // Convex plugin for JWT-based sessions
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),

      // Note: Organization plugin NOT included
      // This is a single-tenant app (personal todos only)
      // Add organization() plugin if you need multi-tenant support
    ],
  });
};
