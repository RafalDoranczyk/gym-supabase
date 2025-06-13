import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";
import { NUTRITION_ASSISTANT_SYSTEM_PROMPT } from "./prompts";
import { functionDeclarations } from "./registry";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function convertFunctionDeclarations(): Anthropic.Messages.ToolUnion[] {
  return functionDeclarations.map((func) => ({
    name: func.name,
    description: func.description,
    input_schema: {
      type: "object" as const,
      properties: func.parameters?.properties || {},
      required: func.parameters?.required || [],
    },
  }));
}

type ClaudeConfigType = Omit<MessageCreateParamsNonStreaming, "messages">;

export const CLAUDE_CONFIG: ClaudeConfigType = {
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  temperature: 0.7,
  system: NUTRITION_ASSISTANT_SYSTEM_PROMPT,
  tools: convertFunctionDeclarations(),
};

export { anthropic };
