/**
 * Rate Limiter Configuration
 *
 * Configures rate limiting for production API protection.
 * Uses token bucket algorithm for bursts and fixed window for hard limits.
 */

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  /**
   * TODO OPERATIONS
   * Token bucket: allows bursts, refills over time
   */
  createTodo: {
    kind: "token bucket",
    rate: 10, // 10 todos per minute
    period: MINUTE,
    capacity: 3, // Allow burst of 3
  },
  updateTodo: {
    kind: "token bucket",
    rate: 50, // 50 updates per minute
    period: MINUTE,
  },
  deleteTodo: {
    kind: "token bucket",
    rate: 30, // 30 deletes per minute
    period: MINUTE,
  },

  /**
   * AI ASSISTANT OPERATIONS
   * More restrictive limits due to API costs
   */
  createThread: {
    kind: "token bucket",
    rate: 5, // 5 new threads per minute
    period: MINUTE,
    capacity: 2,
  },
  createMessage: {
    kind: "token bucket",
    rate: 20, // 20 messages per minute
    period: MINUTE,
    capacity: 5, // Allow burst of 5
  },

  /**
   * USER PREFERENCES
   * Less restrictive, rarely updated
   */
  updatePreferences: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
  },

  /**
   * AUTHENTICATION
   * Fixed window: hard limit to prevent brute force
   */
  signup: {
    kind: "fixed window",
    rate: 3, // 3 signups per hour per IP
    period: HOUR,
  },
  login: {
    kind: "fixed window",
    rate: 10, // 10 login attempts per hour
    period: HOUR,
  },
});
