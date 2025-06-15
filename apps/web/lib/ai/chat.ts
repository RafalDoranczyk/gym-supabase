"use server";

import type { Tool } from "@anthropic-ai/sdk/resources/index";
import type { ContentBlock, ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { anthropic, createClaudeConfig } from "./client";

// Generic handler type
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AIHandler = (params: any) => Promise<any>;
type AIHandlers = Record<string, AIHandler>;

// Error responses type
type ErrorResponses = {
  FUNCTION_ERROR: string;
  GENERAL_ERROR: string;
  API_LIMIT: string;
};

export interface ChatConfig {
  systemPrompt: string;
  tools: Tool[];
  handlers: AIHandlers;
  errorResponses: ErrorResponses;
  maxTokens?: number;
  temperature?: number;
}

async function startConversation(message: string, config: ChatConfig) {
  const claudeConfig = createClaudeConfig(config.systemPrompt, config.tools, {
    max_tokens: config.maxTokens,
    temperature: config.temperature,
  });

  return await anthropic.messages.create({
    ...claudeConfig,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });
}

async function processTool(
  content: ContentBlock,
  handlers: AIHandlers,
  errorResponses: ErrorResponses
): Promise<ToolResultBlockParam> {
  if (content.type !== "tool_use") {
    return {} as ToolResultBlockParam;
  }

  const { name, input, id } = content;
  console.log(`🔧 AI calling function: ${name}`, input);

  try {
    const handler = handlers[name];
    if (!handler) {
      throw new Error(`Unknown function: ${name}`);
    }

    const functionResult = await handler(input || {});
    console.log(`✅ Function ${name} result:`, functionResult);

    return {
      type: "tool_result" as const,
      tool_use_id: id,
      content: JSON.stringify(functionResult),
    };
  } catch (error) {
    console.error(`❌ Function ${name} failed:`, error);

    const errorMessage =
      error instanceof Error && error.message.includes("Unknown function")
        ? `Function ${name} is not available`
        : errorResponses.FUNCTION_ERROR;

    return {
      type: "tool_result" as const,
      tool_use_id: id,
      content: JSON.stringify({ error: errorMessage }),
      is_error: true,
    };
  }
}

export async function chatWithAI(message: string, config: ChatConfig) {
  try {
    console.log("🤖 AI Processing message:", message);

    // Start conversation
    let response = await startConversation(message, config);

    // Handle tool calls
    while (response.content.some((content) => content.type === "tool_use")) {
      const toolResults = [];

      // Process each tool call
      for (const content of response.content) {
        if (content.type === "tool_use") {
          const toolResult = await processTool(content, config.handlers, config.errorResponses);
          toolResults.push(toolResult);
        }
      }

      // Send tool results back to AI
      const claudeConfig = createClaudeConfig(config.systemPrompt, config.tools);
      response = await anthropic.messages.create({
        ...claudeConfig,
        messages: [
          {
            role: "user",
            content: message,
          },
          {
            role: "assistant",
            content: response.content,
          },
          {
            role: "user",
            content: toolResults,
          },
        ],
      });
    }

    // Extract text response
    const textContent = response.content.find(
      (content): content is Extract<ContentBlock, { type: "text" }> => content.type === "text"
    );
    const responseText = textContent?.text || "Sorry, I couldn't generate a response.";

    return {
      success: true,
      message: responseText,
      usage: response.usage,
    };
  } catch (error) {
    console.error("💥 AI chat error:", error);

    // Enhanced error handling
    if (error instanceof Error) {
      // API Key errors
      if (error.message.includes("API key") || error.message.includes("authentication")) {
        return {
          success: false,
          message: "🔑 AI service configuration issue. Please contact support.",
          error: "API_KEY_ERROR",
        };
      }

      // Rate limit errors
      if (error.message.includes("rate limit") || error.message.includes("quota")) {
        return {
          success: false,
          message: config.errorResponses.API_LIMIT,
          error: "RATE_LIMIT_ERROR",
        };
      }

      // Network errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return {
          success: false,
          message: "🌐 Network connection issue. Please check your internet and try again.",
          error: "NETWORK_ERROR",
        };
      }
    }

    // Default error
    return {
      success: false,
      message: config.errorResponses.GENERAL_ERROR,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
