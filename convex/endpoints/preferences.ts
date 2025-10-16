/**
 * Endpoint Layer: User Preferences
 *
 * Business logic for managing user preferences.
 * Handles theme, default priority, and notification settings.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as UserPreferences from "../db/userPreferences";

/**
 * Get user preferences (or create defaults if none exist)
 */
export const get = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const prefs = await UserPreferences.getUserPreferencesByUser(
      ctx,
      authUser._id
    );

    // Return defaults if no preferences exist yet
    if (!prefs) {
      return {
        theme: "system" as const,
        defaultPriority: "medium" as const,
        enableNotifications: true,
      };
    }

    return prefs;
  },
});

/**
 * Update user preferences
 */
export const update = mutation({
  args: {
    theme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("system"))
    ),
    defaultPriority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    enableNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updatePreferences", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Get or create preferences
    const prefs = await UserPreferences.getOrCreateUserPreferences(
      ctx,
      authUser._id
    );

    // 4. Update preferences
    return await UserPreferences.updateUserPreferences(ctx, prefs._id, args);
  },
});

/**
 * Initialize default preferences for a new user
 * Called automatically on first login
 */
export const initialize = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Check if preferences already exist
    const existing = await UserPreferences.getUserPreferencesByUser(
      ctx,
      authUser._id
    );
    if (existing) {
      return existing;
    }

    // Create default preferences
    return await UserPreferences.createUserPreferences(ctx, {
      userId: authUser._id,
    });
  },
});
