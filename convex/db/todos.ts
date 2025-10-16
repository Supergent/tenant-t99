/**
 * Database Layer: Todos
 *
 * This is the ONLY file that directly accesses the todos table using ctx.db.
 * All todos-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// CREATE
export async function createTodo(
  ctx: MutationCtx,
  args: {
    userId: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    dueDate?: number;
    tags?: string[];
  }
) {
  const now = Date.now();
  return await ctx.db.insert("todos", {
    ...args,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getTodoById(ctx: QueryCtx, id: Id<"todos">) {
  return await ctx.db.get(id);
}

// READ - Get all by user
export async function getTodosByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

// READ - Get by user and completed status
export async function getTodosByUserAndCompleted(
  ctx: QueryCtx,
  userId: string,
  completed: boolean
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_completed", (q) =>
      q.eq("userId", userId).eq("completed", completed)
    )
    .order("desc")
    .collect();
}

// READ - Get by user and priority
export async function getTodosByUserAndPriority(
  ctx: QueryCtx,
  userId: string,
  priority: "low" | "medium" | "high"
) {
  return await ctx.db
    .query("todos")
    .withIndex("by_user_and_priority", (q) =>
      q.eq("userId", userId).eq("priority", priority)
    )
    .order("desc")
    .collect();
}

// READ - Get recent todos (limited)
export async function getRecentTodos(ctx: QueryCtx, limit: number = 10) {
  return await ctx.db
    .query("todos")
    .withIndex("by_created_at")
    .order("desc")
    .take(limit);
}

// UPDATE - Update todo fields
export async function updateTodo(
  ctx: MutationCtx,
  id: Id<"todos">,
  args: {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    dueDate?: number;
    tags?: string[];
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// UPDATE - Toggle completed status
export async function toggleTodoCompleted(
  ctx: MutationCtx,
  id: Id<"todos">,
  completed: boolean
) {
  const now = Date.now();
  return await ctx.db.patch(id, {
    completed,
    completedAt: completed ? now : undefined,
    updatedAt: now,
  });
}

// DELETE
export async function deleteTodo(ctx: MutationCtx, id: Id<"todos">) {
  return await ctx.db.delete(id);
}

// ANALYTICS - Count todos by user
export async function countTodosByUser(ctx: QueryCtx, userId: string) {
  const todos = await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length,
  };
}

// ANALYTICS - Count todos by priority
export async function countTodosByPriority(ctx: QueryCtx, userId: string) {
  const todos = await ctx.db
    .query("todos")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return {
    high: todos.filter((t) => t.priority === "high" && !t.completed).length,
    medium: todos.filter((t) => t.priority === "medium" && !t.completed).length,
    low: todos.filter((t) => t.priority === "low" && !t.completed).length,
  };
}
