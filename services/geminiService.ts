import { GoogleGenAI, Type } from "@google/genai";
import { Expense, ProjectSettings, AiAnalysisResult, Category } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBudgetHealth = async (
  expenses: Expense[],
  settings: ProjectSettings
): Promise<AiAnalysisResult> => {
  try {
    const expensesSummary = expenses.map(e => ({
      desc: e.description,
      amt: e.amount,
      cat: e.category,
      date: e.date
    }));

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const budgetUtilization = ((totalSpent / settings.totalBudget) * 100).toFixed(1);

    const prompt = `
      You are a senior project finance analyst. Analyze this project budget.
      
      Project Details:
      - Name: ${settings.name}
      - Total Budget: ${settings.totalBudget}
      - Total Spent So Far: ${totalSpent} (${budgetUtilization}%)
      - Start Date: ${settings.startDate}
      
      Expenses List:
      ${JSON.stringify(expensesSummary)}
      
      Provide a structured JSON assessment of the project's financial health.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: ["On Track", "Warning", "Critical"],
              description: "Overall financial health status based on burn rate and remaining budget.",
            },
            summary: {
              type: Type.STRING,
              description: "A concise 2-sentence executive summary of the current financial state.",
            },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of top 3 potential financial risks or anomalies detected.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 actionable recommendations to optimize spending.",
            },
          },
          required: ["status", "summary", "risks", "recommendations"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AiAnalysisResult;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      status: "Warning",
      summary: "AI analysis unavailable at the moment. Please check your network connection or API key.",
      risks: ["Analysis service unreachable"],
      recommendations: ["Manually review large expenses"]
    };
  }
};
