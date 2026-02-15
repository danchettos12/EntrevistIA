
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
    const prompt = `Actúa como un reclutador de élite. Para el rol de ${config.role}, con una rigurosidad de ${config.pressure}/100, genera UNA pregunta conductual desafiante en español que requiera una respuesta estructurada. Evita estas preguntas: ${previousQuestions.join(', ')}. Solo entrega el texto de la pregunta.`;
    
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
    const prompt = `Actúa como un Coach de Carreras Senior. Analiza la siguiente respuesta de entrevista bajo la metodología STAR.
    
Cargo: ${config.role}
Pregunta: ${question}
Respuesta del Candidato: ${userResponse}

Instrucciones Críticas:
1. Desglosa la respuesta en Situación, Tarea, Acción y Resultado.
2. Si un componente NO está presente o es muy vago, indica explícitamente "Faltante: [explicación de qué debería haber dicho]".
3. La 'idealResponse' debe ser una versión mejorada, impactante y profesional de la respuesta del usuario siguiendo perfectamente el método STAR.
4. Evalúa el tono y la asertividad de forma técnica.
5. Proporciona un feedback general constructivo en español.`;
    
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
      return {
        ...emptyFeedback,
        ...data,
        highlights: []
      };
    });

    // Aumentamos el timeout a 15s para dar tiempo al razonamiento profundo de Pro
    return await withTimeout(apiCall, 15000, emptyFeedback);
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
    overallSummary: "Sesión completada. Revisa el detalle de tus respuestas para mejorar.",
    fillerWordAnalysis: "Análisis de fluidez pendiente.",
    mistakes: ["No se pudieron identificar errores específicos por un problema técnico."],
    overallScore: 50
  };

  const apiKey = getApiKey();
  if (!apiKey || questions.length === 0) return fallbackSummary;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = questions.map(q => `P: ${q.question}\nR: ${q.originalResponse}\nFeedback: ${q.generalFeedback}`).join("\n\n");
    const prompt = `Eres un experto en oratoria y comunicación. Resume el desempeño global de esta entrevista para ${config.role}. 
    Contexto de la sesión:\n${context}\n\nAnaliza: 
    1. Resumen general. 
    2. Uso de muletillas y fluidez. 
    3. Lista de 3 errores críticos detectados. 
    4. Puntaje final del 1 al 100.`;
    
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
            overallScore: { type: Type.NUMBER }
          },
          required: ["overallSummary", "fillerWordAnalysis", "mistakes", "overallScore"]
        }
      }
    }).then(res => {
      const text = res.text;
      if (!text) throw new Error("No summary text");
      return JSON.parse(cleanJsonResponse(text));
    });

    return await withTimeout(apiCall, 10000, fallbackSummary);
  } catch (error) {
    console.error("Summary Error:", error);
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
      contents: [{ parts: [{ inlineData: { mimeType, data: base64Audio } }, { text: "Transcribe exactamente lo que escuchas en español. Si no hay audio legible, devuelve un string vacío." }] }]
    });
    return response.text?.trim() || "";
  } catch {
    return "";
  }
};
