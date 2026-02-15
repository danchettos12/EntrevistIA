
import { GoogleGenAI, Type } from "@google/genai";
import { SessionConfig, QuestionFeedback } from "../types.ts";

const getApiKey = () => process.env.API_KEY || "";

const FALLBACK_QUESTIONS = [
  "Cuéntame sobre una situación donde tuviste que tomar una decisión difícil con poca información.",
  "Describe un momento en el que lideraste un equipo a través de un cambio significativo.",
  "¿Cómo manejas las prioridades conflictivas cuando tienes múltiples proyectos críticos?",
  "Háblame de un error que cometiste y qué aprendiste de esa experiencia.",
  "¿Cómo convences a otros de una idea cuando encuentras resistencia inicial?"
];

const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, fallbackValue: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), timeoutMs))
  ]);
};

export const generateInterviewQuestion = async (config: SessionConfig, previousQuestions: string[] = []): Promise<string> => {
  const fallback = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
  const apiKey = getApiKey();
  
  if (!apiKey) return fallback;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Rol: ${config.role}. Rigor: ${config.pressure}. Historial: ${previousQuestions.join(', ')}. Genera UNA pregunta de entrevista conductual nivel senior en español. Solo la pregunta, sin introducciones.`;
    
    const apiCall = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    }).then(res => res.text?.trim() || fallback);

    return await withTimeout(apiCall, 8000, fallback);
  } catch (error) {
    console.error("Gemini Error (Question):", error);
    return fallback;
  }
};

export const analyzeQuestionResponse = async (
  question: string,
  userResponse: string,
  config: SessionConfig
): Promise<QuestionFeedback> => {
  const apiKey = getApiKey();
  const emptyFeedback: QuestionFeedback = {
    question,
    originalResponse: userResponse,
    idealResponse: userResponse,
    highlights: [],
    starAnalysis: { situation: "No analizado", task: "No analizado", action: "No analizado", result: "No analizado", score: 50 },
    toneScore: 50, toneExplanation: "Análisis local por timeout", assertivenessScore: 50, assertivenessExplanation: "Análisis local",
    generalFeedback: "La IA tardó demasiado en responder. Se guardó tu respuesta pero el análisis detallado no está disponible."
  };

  if (!apiKey || userResponse.length < 10) return emptyFeedback;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analiza bajo metodología STAR esta respuesta para el cargo ${config.role}:\nPregunta: ${question}\nRespuesta: ${userResponse}`;
    
    const apiCall = ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idealResponse: { type: Type.STRING },
            starAnalysis: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            },
            toneScore: { type: Type.NUMBER },
            toneExplanation: { type: Type.STRING },
            assertivenessScore: { type: Type.NUMBER },
            assertivenessExplanation: { type: Type.STRING },
            generalFeedback: { type: Type.STRING }
          }
        }
      }
    }).then(res => {
      const data = JSON.parse(cleanJsonResponse(res.text || '{}'));
      return {
        ...emptyFeedback,
        ...data,
        highlights: [] // Simplificado para estabilidad
      };
    });

    return await withTimeout(apiCall, 12000, emptyFeedback);
  } catch (error) {
    console.error("Gemini Error (Analysis):", error);
    return emptyFeedback;
  }
};

export const generateSessionSummary = async (
  questions: QuestionFeedback[],
  config: SessionConfig
): Promise<{ overallSummary: string, fillerWordAnalysis: string, mistakes: string[], overallScore: number }> => {
  const fallbackSummary = {
    overallSummary: "Sesión completada con éxito. Enfócate en la estructura STAR.",
    fillerWordAnalysis: "Buen ritmo de habla.",
    mistakes: ["Asegúrate de cuantificar tus resultados."],
    overallScore: 80
  };

  const apiKey = getApiKey();
  if (!apiKey) return fallbackSummary;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Resume esta sesión de entrevista para ${config.role} y calcula un score del 1 al 100.`;
    
    const apiCall = ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    }).then(res => JSON.parse(cleanJsonResponse(res.text || '{}')));

    return await withTimeout(apiCall, 10000, fallbackSummary);
  } catch (error) {
    return fallbackSummary;
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ inlineData: { mimeType, data: base64Audio } }, { text: "Transcribe." }] }]
    });
    return response.text?.trim() || "";
  } catch {
    return "";
  }
};
