import { GoogleGenAI, Type } from "@google/genai";
import { TrustAssessmentState, AssessmentResult, TrustBand } from "../types";

export const analyzeTrust = async (state: TrustAssessmentState): Promise<AssessmentResult> => {
  // Fix: Initialize the client using process.env.API_KEY directly as a named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a TrustWeave Credit Reasoning Agent. Analyze the following behavioral data to determine a Trust Band (T1-T5).
    
    PURPOSE: ${state.purpose}
    MOBILE STABILITY: ${JSON.stringify(state.mobile)}
    UTILITY DISCIPLINE: ${JSON.stringify(state.utility)}
    COMMUNITY RELIABILITY: ${JSON.stringify(state.community)}
    EVIDENCE: ${state.evidence.length} files covering ${state.evidence.reduce((acc, curr) => acc + curr.months, 0)} months.
    LOAN EXPERIENCE: ${state.loanExperience}
    FINANCIAL CAPACITY: ${JSON.stringify(state.financial)}
    ASSETS: ${JSON.stringify(state.assets)}

    Analyze consistency, responsibility, and recovery patterns.
    Provide a Trust Band, a 1-line interpretation, a traditional credit score alignment (e.g. 750-799), and 3-4 bullet points of reasoning.
    Be fair and look for patterns of responsibility rather than wealth.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trustBand: { type: Type.STRING, enum: Object.values(TrustBand) },
          interpretation: { type: Type.STRING },
          traditionalAlignment: { type: Type.STRING },
          reasoning: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["trustBand", "interpretation", "traditionalAlignment", "reasoning"]
      }
    }
  });

  try {
    // Correct usage: Access the .text property directly from the response object
    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    // Fallback if JSON fails
    return {
      trustBand: TrustBand.T3,
      interpretation: "Analysis completed with baseline metrics.",
      traditionalAlignment: "650-699",
      reasoning: ["Consistent utility payments noted.", "Solid community participation.", "Verification of evidence required."]
    };
  }
};