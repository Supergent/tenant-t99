/**
 * Endpoint Layer: Dashboard
 *
 * Provides aggregate data and recent items for the dashboard view.
 * Powers dashboard widgets and overview screens.
 */

import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Todos from "../db/todos";
import type { DataModel } from "../_generated/dataModel";

/**
 * Get dashboard summary statistics
 */
export const summary = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      // Return empty stats for unauthenticated users
      return {
        totalTodos: 0,
        activeTodos: 0,
        completedTodos: 0,
        highPriorityTodos: 0,
      };
    }

    const counts = await Todos.countTodosByUser(ctx, authUser._id);
    const priorities = await Todos.countTodosByPriority(ctx, authUser._id);

    return {
      totalTodos: counts.total,
      activeTodos: counts.active,
      completedTodos: counts.completed,
      highPriorityTodos: priorities.high,
    };
  },
});

/**
 * Get recent todos for the dashboard
 */
export const recent = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    // Get user's recent todos (limit 10)
    return await Todos.getTodosByUser(ctx, authUser._id);
  },
});

/**
 * Get overall system statistics (admin view)
 * This demonstrates the dynamic table query pattern
 */
export const systemStats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const TABLES = [
      "todos",
      "threads",
      "messages",
      "userPreferences",
    ] as const;
    const perTable: Record<string, number> = {};

    for (const table of TABLES) {
      // Use type assertion for dynamic table queries
      const records = await ctx.db.query(table as keyof DataModel).collect();
      const scopedRecords = records.filter(
        (record: any) => record.userId === authUser._id
      );
      perTable[table] = scopedRecords.length;
    }

    return {
      perTable,
      totalRecords: Object.values(perTable).reduce((a, b) => a + b, 0),
    };
  },
});
