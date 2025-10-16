/**
 * Endpoint Layer: AI Assistant
 *
 * Business logic for AI-powered todo assistant.
 * Handles thread management and message creation.
 */

import { v } from "convex/values";
import { mutation, query, action } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import { internal } from "../_generated/api";
import * as Threads from "../db/threads";
import * as Messages from "../db/messages";

/**
 * Create a new conversation thread
 */
export const createThread = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "createThread", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Create thread
    return await Threads.createThread(ctx, {
      userId: authUser._id,
      title: args.title,
    });
  },
});

/**
 * List all threads for the authenticated user
 */
export const listThreads = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    if (args.status) {
      return await Threads.getThreadsByUserAndStatus(
        ctx,
        authUser._id,
        args.status
      );
    }

    return await Threads.getThreadsByUser(ctx, authUser._id);
  },
});

/**
 * Get a single thread by ID
 */
export const getThread = query({
  args: {
    id: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }

    // Verify ownership
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to view this thread");
    }

    return thread;
  },
});

/**
 * Update thread (rename or archive)
 */
export const updateThread = mutation({
  args: {
    id: v.id("threads"),
    title: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to update this thread");
    }

    const { id, ...updateArgs } = args;
    return await Threads.updateThread(ctx, id, updateArgs);
  },
});

/**
 * Delete a thread and all its messages
 */
export const deleteThread = mutation({
  args: {
    id: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.id);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to delete this thread");
    }

    // Delete all messages in the thread first
    await Messages.deleteMessagesByThread(ctx, args.id);

    // Delete the thread
    return await Threads.deleteThread(ctx, args.id);
  },
});

/**
 * Get all messages in a thread
 */
export const getMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify thread ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to view this thread");
    }

    return await Messages.getMessagesByThread(ctx, args.threadId);
  },
});

/**
 * Send a message to the AI assistant
 * This is an action because it calls external AI APIs
 */
export const sendMessage = action({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get auth user via mutation (actions can't access authComponent directly)
    const authUserId = await ctx.runMutation(
      internal.endpoints.assistant.verifyThreadAccess,
      { threadId: args.threadId }
    );

    // 2. Rate limiting
    const status = await ctx.runMutation(
      internal.endpoints.assistant.checkMessageRateLimit,
      { userId: authUserId }
    );
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Create user message
    await ctx.runMutation(internal.endpoints.assistant.createUserMessage, {
      threadId: args.threadId,
      userId: authUserId,
      content: args.content,
    });

    // 4. Get conversation history
    const messages = await ctx.runQuery(
      internal.endpoints.assistant.getThreadMessages,
      { threadId: args.threadId }
    );

    // 5. Call AI (simplified - in production, use Agent component)
    // For now, we'll create a placeholder assistant response
    const assistantResponse = `I received your message: "${args.content}". As your todo assistant, I can help you organize tasks, set priorities, and break down complex projects. How can I help you today?`;

    // 6. Create assistant message
    await ctx.runMutation(internal.endpoints.assistant.createAssistantMessage, {
      threadId: args.threadId,
      userId: authUserId,
      content: assistantResponse,
    });

    return { success: true };
  },
});

/**
 * INTERNAL: Verify thread access and return user ID
 */
export const verifyThreadAccess = mutation({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized");
    }

    return authUser._id;
  },
});

/**
 * INTERNAL: Check message rate limit
 */
export const checkMessageRateLimit = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await rateLimiter.limit(ctx, "createMessage", { key: args.userId });
  },
});

/**
 * INTERNAL: Create user message
 */
export const createUserMessage = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await Messages.createMessage(ctx, {
      threadId: args.threadId,
      userId: args.userId,
      role: "user",
      content: args.content,
    });
  },
});

/**
 * INTERNAL: Create assistant message
 */
export const createAssistantMessage = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await Messages.createMessage(ctx, {
      threadId: args.threadId,
      userId: args.userId,
      role: "assistant",
      content: args.content,
    });
  },
});

/**
 * INTERNAL: Get thread messages
 */
export const getThreadMessages = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await Messages.getMessagesByThread(ctx, args.threadId);
  },
});
