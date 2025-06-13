import {
  ingredientFunctions,
  type IngredientFunctionNames,
} from "../domains/ingredients/functions";
import { ingredientHandlers } from "../domains/ingredients/handlers";

export const functionDeclarations = ingredientFunctions;
export const allHandlers = ingredientHandlers;
export type AllFunctionNames = IngredientFunctionNames;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function executeFunctionCall(name: string, args: Record<string, any>) {
  const handler = allHandlers[name as AllFunctionNames];
  if (!handler) throw new Error(`Unknown function: ${name}`);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return await handler(args as any);
}
