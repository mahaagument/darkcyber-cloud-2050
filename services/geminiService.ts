
import { GoogleGenAI, Type } from "@google/genai";

// Initializing the GenAI client with the required named parameter and using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFileSecurity = async (fileName: string, fileType: string, content?: string) => {
  // Use gemini-3-flash-preview for basic utility and logic tasks.
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Analyze the following file for potential security risks.
    File Name: ${fileName}
    File Type: ${fileType}
    ${content ? `Content Preview (Base64): ${content.substring(0, 1000)}` : ''}

    Return a JSON object with:
    1. riskScore (0-100)
    2. threatSummary (A brief 1-sentence analysis)
    3. recommendation (What should the user do?)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            threatSummary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["riskScore", "threatSummary", "recommendation"]
        }
      }
    });
    // Use the .text property to get the generated text output.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Security Scan Error:", error);
    return null;
  }
};

export const generateFileSummary = async (fileName: string, content: string) => {
  // Use gemini-3-flash-preview for standard summarization tasks.
  const model = 'gemini-3-flash-preview';
  const prompt = `Summarize the contents of this file in two concise sentences. File: ${fileName}. Content: ${content.substring(0, 2000)}`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    // Use the .text property to extract response content.
    return response.text;
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Summary unavailable.";
  }
};

export const vaultAssistantChat = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  // Use gemini-3-pro-preview for advanced reasoning and conversational logic.
  const model = 'gemini-3-pro-preview';
  const chat = ai.chats.create({
    model,
    // Fix: Properly passing history to the chat session constructor to maintain conversational state.
    history: history,
    config: {
      systemInstruction: "You are the DarkCyber Vault Assistant. You help users manage their cloud storage, analyze file security, and provide technical advice on encryption. Be concise, futuristic, and professional."
    }
  });

  try {
    const result = await chat.sendMessage({ message });
    // Use the .text property to retrieve the assistant's message.
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "System breach detected in communication. Please try again later.";
  }
};
