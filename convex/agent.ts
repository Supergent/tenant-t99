/**
 * AI Agent Configuration
 *
 * Configures the AI assistant for helping users manage their todos.
 * Uses OpenAI GPT-4o-mini for cost-effective, fast responses.
 */

import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { openai } from "@ai-sdk/openai";
import { AI_ASSISTANT_NAME, AI_ASSISTANT_INSTRUCTIONS } from "./helpers/constants";

export const todoAssistant = new Agent(components.agent, {
  name: AI_ASSISTANT_NAME,
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: AI_ASSISTANT_INSTRUCTIONS,
});
