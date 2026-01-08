
import { GoogleGenAI, Type } from "@google/genai";
import { MarketAnalysis, NewsArticle } from "../types";

export async function getMarketAnalysis(symbol: string): Promise<MarketAnalysis> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a real-time technical analysis for the financial asset ${symbol}. 
      You MUST prioritize the "Force Index" (Índice de Fuerza) logic for your probability calculation:
      - If the current price is BELOW the Force Index level: Signal is BULLISH (Probability of UP is higher).
      - If the current price is ABOVE the Force Index level: Signal is BEARISH (Probability of DOWN is higher).
      
      Also, evaluate the Market Volatility:
      - If candles are moving rapidly and price swings are large, mark volatility as "HIGH / VOLATILE".
      - If movement is slow, mark as "STABLE / LOW".

      Provide a probability percentage (0-100) for it going UP (Bullish) or DOWN (Bearish). 
      The sum of both probabilities should be 100.
      Base this on the latest available market context from Google Search.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bullishProb: { type: Type.NUMBER },
            bearishProb: { type: Type.NUMBER },
            trend: { type: Type.STRING, enum: ['UP', 'DOWN', 'NEUTRAL'] },
            signals: {
              type: Type.OBJECT,
              properties: {
                rsi: { type: Type.STRING },
                macd: { type: Type.STRING },
                movingAverage: { type: Type.STRING },
                volatility: { type: Type.STRING },
              },
              required: ['rsi', 'macd', 'movingAverage', 'volatility']
            },
            summary: { type: Type.STRING },
          },
          required: ['bullishProb', 'bearishProb', 'trend', 'signals', 'summary'],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter(Boolean) || [];

    return { ...data, sources } as MarketAnalysis;
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return {
      bullishProb: 50,
      bearishProb: 50,
      trend: 'NEUTRAL',
      signals: {
        rsi: 'Neutral',
        macd: 'Consolidating',
        movingAverage: 'At 50 EMA',
        volatility: 'Moderate'
      },
      summary: 'Análisis temporalmente no disponible. Verifique su conexión.',
      sources: []
    };
  }
}

export async function getMarketNews(query: string = "Forex, Crypto, Gold"): Promise<NewsArticle[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Find the 6 most important and recent real news articles about ${query} from today. 
      The news must be relevant to traders and from reliable financial sources.
      Categorize each as 'Forex', 'Crypto', 'Gold', or 'General'.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              url: { type: Type.STRING },
              source: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['Forex', 'Crypto', 'Gold', 'General'] },
            },
            required: ['title', 'summary', 'url', 'source', 'timestamp', 'category']
          }
        },
      },
    });

    const text = response.text;
    if (!text) return [];

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText) as NewsArticle[];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
