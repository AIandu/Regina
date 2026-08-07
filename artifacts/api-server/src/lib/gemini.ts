import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./logger";

// The user's Gemini API key is stored under OPENAI_API_KEY
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  logger.warn("OPENAI_API_KEY (Gemini key) is not set — AI analysis will fail");
}

export const genAI = new GoogleGenerativeAI(apiKey ?? "");

export async function runGeminiJSON<T>(prompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`);
  }
}
