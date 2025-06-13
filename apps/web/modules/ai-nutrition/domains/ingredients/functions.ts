import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const ingredientFunctions = [
  {
    name: "getExistingIngredients",
    description:
      "Get user's current ingredients organized by groups. Use this when user asks about their database.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        groupName: {
          type: SchemaType.STRING,
          description: "Optional: filter by specific group name",
        },
      },
      required: [],
    },
  },
] as const satisfies readonly FunctionDeclaration[];

export type IngredientFunctionNames = (typeof ingredientFunctions)[number]["name"];
