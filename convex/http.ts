import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router for Convex
 *
 * Handles HTTP requests for authentication endpoints.
 * Better Auth requires these routes to process login, signup, logout, etc.
 */
const http = httpRouter();

/**
 * POST /auth/*
 * Handles all POST authentication requests (login, signup, etc.)
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

/**
 * GET /auth/*
 * Handles all GET authentication requests (session checks, etc.)
 */
http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
