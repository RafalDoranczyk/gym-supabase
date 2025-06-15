import { chatWithAI, type ChatConfig } from "@/lib/ai";
import { ingredientFunctions } from "../domains/ingredients/functions";
import { ingredientHandlers } from "../domains/ingredients/handlers";
import { ERROR_RESPONSES, NUTRITION_ASSISTANT_SYSTEM_PROMPT } from "./prompts";

const nutritionConfig: ChatConfig = {
  systemPrompt: NUTRITION_ASSISTANT_SYSTEM_PROMPT,
  tools: [
    ...ingredientFunctions,
    // Future: ...mealFunctions, ...workoutFunctions
  ],
  handlers: {
    ...ingredientHandlers,
    // Future: ...mealHandlers, ...workoutHandlers
  },
  errorResponses: ERROR_RESPONSES,
  maxTokens: 1024,
  temperature: 0.7,
};

export async function chatWithNutritionAssistant(message: string) {
  return await chatWithAI(message, nutritionConfig);
}
