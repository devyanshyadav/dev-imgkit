import { GoogleGenerativeAI } from "@google/generative-ai";

export async function TxtLLM(prompt: string): Promise<string | undefined> {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    return await result.response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return undefined;
  }
}