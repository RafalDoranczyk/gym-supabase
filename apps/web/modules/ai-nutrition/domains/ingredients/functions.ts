import type { Tool } from "@anthropic-ai/sdk/resources/index";
import type { IngredientHandlerNames } from "./handlers";

type IngredientToolFunction = Tool & {
  name: IngredientHandlerNames;
};

export const ingredientFunctions = [
  {
    name: "getExistingIngredients" as const,
    description:
      "Get user's current ingredients organized by groups. Use this when user asks about their database.",
    input_schema: {
      type: "object",
      properties: {
        groupName: {
          type: "string",
          description: "Optional: filter by specific group name",
        },
      },
      required: [],
    },
  },
] satisfies IngredientToolFunction[];
