"use server";

import { chatWithNutritionAssistant } from "../config/nutrition-ai";

export async function chatWithAI(message: string) {
  console.log("Received message:", message);

  if (!message.trim()) {
    return {
      success: false,
      message: "Please enter a message.",
    };
  }

  try {
    const result = await chatWithNutritionAssistant(message);
    console.log("AI Response:", result);
    return result;
  } catch (error) {
    console.error("Chat error:", error);
    return {
      success: false,
      message: "Sorry, I'm having trouble right now. Please try again.",
    };
  }
}
