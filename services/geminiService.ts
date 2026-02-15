
import { GoogleGenAI, Type } from "@google/genai";
import { SessionConfig, QuestionFeedback } from "../types.ts";

const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key || key === "undefined" || key === "null" || key.length < 10) return "";
  return key;
};

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
    const prompt = `Actúa como un reclutador de élite de una empresa Fortune 500. Para el rol de ${config.role}, genera UNA pregunta conductual de alta complejidad técnica y emocional en español. Evita estas preguntas: ${previousQuestions.join(', ')}. Solo entrega el texto de la pregunta.`;
    
    const apiCall = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    }).then(res => res.text?.trim() || fallback);

    return await withTimeout(apiCall, 6000, fallback);
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
    starAnalysis: { situation: "No analizado", task: "No analizado", action: "No analizado", result: "No analizado", score: 0 },
    toneScore: 0, toneExplanation: "Análisis no disponible", assertivenessScore: 0, assertivenessExplanation: "Análisis no disponible",
    generalFeedback: "Hubo un problema al procesar el análisis detallado."
  };

  if (!apiKey || userResponse.length < 5) return emptyFeedback;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Actúa como un Coach de Carreras Senior EXTREMADAMENTE ESTRICTO. Analiza esta respuesta de entrevista para el puesto de ${config.role}.
    
Pregunta: ${question}
Respuesta: ${userResponse}

Instrucciones:
1. Sé implacable con el método STAR. Si falta el resultado con métricas, penaliza fuertemente.
2. Identifica muletillas y falta de seguridad.
3. Propón una 'idealResponse' que suene como un directivo C-Level.
4. Evalúa con rigor técnico.`;
    
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
              },
              required: ["situation", "task", "action", "result", "score"]
            },
            toneScore: { type: Type.NUMBER },
            toneExplanation: { type: Type.STRING },
            assertivenessScore: { type: Type.NUMBER },
            assertivenessExplanation: { type: Type.STRING },
            generalFeedback: { type: Type.STRING }
          },
          required: ["idealResponse", "starAnalysis", "toneScore", "toneExplanation", "assertivenessScore", "assertivenessExplanation", "generalFeedback"]
        }
      }
    }).then(res => {
      const text = res.text;
      if (!text) throw new Error("No response text");
      const data = JSON.parse(cleanJsonResponse(text));
      return { ...emptyFeedback, ...data };
    });

    return await withTimeout(apiCall, 15000, emptyFeedback);
  } catch (error) {
    console.error("Gemini Error (Analysis):", error);
    return emptyFeedback;
  }
};

export const generateSessionSummary = async (
  questions: QuestionFeedback[],
  config: SessionConfig
): Promise<{ overallSummary: string, fillerWordAnalysis: string, mistakes: string[], overallScore: number, communicationMetrics: any, improvementPlan: string[] }> => {
  const apiKey = getApiKey();
  if (!apiKey || questions.length === 0) throw new Error("Missing API Key or questions");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = questions.map(q => `P: ${q.question}\nR: ${q.originalResponse}`).join("\n\n");
    const prompt = `Eres un Evaluador de Oratoria Forense y Coach de Liderazgo Senior. Tu objetivo es DESTRUIR los malos hábitos de comunicación del candidato para RECONSTRUIRLOS de forma profesional. 
    Analiza el desempeño global para el cargo de ${config.role}. 
    
    Contexto:\n${context}\n\n
    
    Sé específico y crítico:
    1. Identifica muletillas EXACTAS (eh, bueno, o sea, etc.).
    2. Evalúa si el vocabulario es pobre o genérico.
    3. Analiza el ritmo: ¿Hay pausas incómodas o habla demasiado rápido?
    4. Proporciona un plan de mejora de 3 puntos EXTREMADAMENTE DETALLADO.
    5. Asigna puntuaciones rigurosas (0-100) para Pacing, Vocabulary, Clarity y Confidence.`;
    
    const apiCall = ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: { type: Type.STRING },
            fillerWordAnalysis: { type: Type.STRING },
            mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallScore: { type: Type.NUMBER },
            communicationMetrics: {
              type: Type.OBJECT,
              properties: {
                pacing: { type: Type.NUMBER },
                vocabulary: { type: Type.NUMBER },
                clarity: { type: Type.NUMBER },
                confidence: { type: Type.NUMBER }
              },
              required: ["pacing", "vocabulary", "clarity", "confidence"]
            },
            improvementPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["overallSummary", "fillerWordAnalysis", "mistakes", "overallScore", "communicationMetrics", "improvementPlan"]
        }
      }
    }).then(res => {
      const text = res.text;
      if (!text) throw new Error("No summary text");
      return JSON.parse(cleanJsonResponse(text));
    });

    return await withTimeout(apiCall, 15000, {
        overallSummary: "Error analizando la sesión.",
        fillerWordAnalysis: "Análisis fallido.",
        mistakes: ["No se pudo completar el análisis crítico."],
        overallScore: 0,
        communicationMetrics: { pacing: 0, vocabulary: 0, clarity: 0, confidence: 0 },
        improvementPlan: ["Reintenta la sesión para obtener feedback."]
    });
  } catch (error) {
    console.error("Summary Error:", error);
    throw error;
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "";
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ inlineData: { mimeType, data: base64Audio } }, { text: "Transcribe exactamente, incluyendo muletillas como 'eh', 'mmm' o repeticiones. Es vital para el análisis de oratoria." }] }]
    });
    return response.text?.trim() || "";
  } catch {
    return "";
  }
};
