/**
 * Endpoint Layer: Todos
 *
 * Business logic for todo management.
 * Composes database operations from the db layer.
 * Handles authentication, authorization, and rate limiting.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Todos from "../db/todos";
import {
  sanitizeTodoTitle,
  sanitizeTodoDescription,
  sanitizeTags,
} from "../helpers/validation";

/**
 * Create a new todo
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "createTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Sanitize inputs
    const title = sanitizeTodoTitle(args.title);
    const description = args.description
      ? sanitizeTodoDescription(args.description)
      : undefined;
    const tags = args.tags ? sanitizeTags(args.tags) : undefined;

    // 4. Create todo
    return await Todos.createTodo(ctx, {
      userId: authUser._id,
      title,
      description,
      priority: args.priority,
      dueDate: args.dueDate,
      tags,
    });
  },
});

/**
 * List all todos for the authenticated user
 */
export const list = query({
  args: {
    completed: v.optional(v.boolean()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Filter by completed status if specified
    if (args.completed !== undefined) {
      return await Todos.getTodosByUserAndCompleted(
        ctx,
        authUser._id,
        args.completed
      );
    }

    // Filter by priority if specified
    if (args.priority) {
      return await Todos.getTodosByUserAndPriority(
        ctx,
        authUser._id,
        args.priority
      );
    }

    // Return all todos
    return await Todos.getTodosByUser(ctx, authUser._id);
  },
});

/**
 * Get a single todo by ID
 */
export const get = query({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Verify ownership
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to view this todo");
    }

    return todo;
  },
});

/**
 * Update a todo
 */
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
    ),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // 4. Sanitize inputs
    const updateArgs: any = {};
    if (args.title !== undefined) {
      updateArgs.title = sanitizeTodoTitle(args.title);
    }
    if (args.description !== undefined) {
      updateArgs.description = sanitizeTodoDescription(args.description);
    }
    if (args.priority !== undefined) {
      updateArgs.priority = args.priority;
    }
    if (args.dueDate !== undefined) {
      updateArgs.dueDate = args.dueDate;
    }
    if (args.tags !== undefined) {
      updateArgs.tags = sanitizeTags(args.tags);
    }

    // 5. Update todo
    return await Todos.updateTodo(ctx, args.id, updateArgs);
  },
});

/**
 * Toggle todo completion status
 */
export const toggleComplete = mutation({
  args: {
    id: v.id("todos"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // 4. Toggle completion
    return await Todos.toggleTodoCompleted(ctx, args.id, args.completed);
  },
});

/**
 * Delete a todo
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Retry after ${status.retryAfter}ms`
      );
    }

    // 3. Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to delete this todo");
    }

    // 4. Delete todo
    return await Todos.deleteTodo(ctx, args.id);
  },
});

/**
 * Get todo statistics for the current user
 */
export const stats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const counts = await Todos.countTodosByUser(ctx, authUser._id);
    const priorities = await Todos.countTodosByPriority(ctx, authUser._id);

    return {
      ...counts,
      priorities,
    };
  },
});
