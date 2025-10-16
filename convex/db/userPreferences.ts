/**
 * Database Layer: User Preferences
 *
 * This is the ONLY file that directly accesses the userPreferences table using ctx.db.
 * All userPreferences-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE - Initialize default preferences for new user
export async function createUserPreferences(
  ctx: MutationCtx,
  args: {
    userId: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("userPreferences", {
    userId: args.userId,
    theme: "system",
    defaultPriority: "medium",
    enableNotifications: true,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by user
export async function getUserPreferencesByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

// UPDATE
export async function updateUserPreferences(
  ctx: MutationCtx,
  id: Id<"userPreferences">,
  args: {
    theme?: "light" | "dark" | "system";
    defaultPriority?: "low" | "medium" | "high";
    enableNotifications?: boolean;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// UPSERT - Get or create preferences
export async function getOrCreateUserPreferences(
  ctx: MutationCtx,
  userId: string
) {
  const existing = await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (existing) {
    return existing;
  }

  const now = Date.now();
  const id = await ctx.db.insert("userPreferences", {
    userId,
    theme: "system",
    defaultPriority: "medium",
    enableNotifications: true,
    createdAt: now,
    updatedAt: now,
  });

  return await ctx.db.get(id);
}
