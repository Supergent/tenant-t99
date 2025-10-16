import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Todo List Application
 *
 * Architecture: Four-layer Convex pattern
 * - User-scoped: All tables include userId
 * - Real-time: Convex provides automatic synchronization
 * - Type-safe: Full TypeScript support
 */

export default defineSchema({
  /**
   * TODOS TABLE
   * Core table for todo items with user scoping
   */
  todos: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_completed", ["userId", "completed"])
    .index("by_user_and_priority", ["userId", "priority"])
    .index("by_created_at", ["createdAt"]),

  /**
   * AI THREADS TABLE
   * Conversation threads for AI assistant (Agent component)
   */
  threads: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  /**
   * AI MESSAGES TABLE
   * Messages within AI conversation threads
   */
  messages: defineTable({
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),

  /**
   * USER PREFERENCES TABLE
   * Store user-specific settings and preferences
   */
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    defaultPriority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    enableNotifications: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
