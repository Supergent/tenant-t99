/**
 * Application Constants
 *
 * Shared constants used across the application.
 */

/**
 * Pagination limits
 */
export const PAGINATION_LIMIT = 50;
export const RECENT_TODOS_LIMIT = 10;

/**
 * Rate limiting (requests per minute)
 */
export const RATE_LIMITS = {
  CREATE_TODO: 10,
  UPDATE_TODO: 50,
  DELETE_TODO: 30,
  CREATE_MESSAGE: 20,
  CREATE_THREAD: 5,
} as const;

/**
 * Priority levels
 */
export const PRIORITY_LEVELS = ["low", "medium", "high"] as const;
export const DEFAULT_PRIORITY = "medium";

/**
 * Theme options
 */
export const THEME_OPTIONS = ["light", "dark", "system"] as const;
export const DEFAULT_THEME = "system";

/**
 * Todo limits
 */
export const MAX_TODO_TITLE_LENGTH = 200;
export const MAX_TODO_DESCRIPTION_LENGTH = 2000;
export const MAX_TAGS_PER_TODO = 10;
export const MAX_TAG_LENGTH = 50;

/**
 * AI Assistant configuration
 */
export const AI_ASSISTANT_NAME = "Todo Assistant";
export const AI_ASSISTANT_INSTRUCTIONS = `You are a helpful AI assistant for a todo list application.

Your role is to:
1. Help users organize and manage their tasks
2. Suggest task priorities based on context
3. Break down complex tasks into smaller, actionable steps
4. Provide time management advice
5. Help with task categorization and tagging

Be concise, friendly, and action-oriented. Focus on productivity and organization.`;

/**
 * Message role types
 */
export const MESSAGE_ROLES = ["user", "assistant"] as const;
