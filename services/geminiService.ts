
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
  // Extraer el primer objeto JSON válido encontrado en el texto
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return match[0];
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
    const prompt = `Actúa como un reclutador de élite de una empresa Fortune 500. Para el rol de ${config.role}, genera UNA pregunta conductual de alta complejidad técnica y emocional en español. El nivel de presión es ${config.pressure}/100. Evita estas preguntas: ${previousQuestions.join(', ')}. Solo entrega el texto de la pregunta.`;
    
    const apiCall = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    }).then(res => res.text?.trim() || fallback);

    return await withTimeout(apiCall, 10000, fallback);
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
    starAnalysis: { 
      situation: "Faltante o no detectado", 
      task: "Faltante o no detectado", 
      action: "Faltante o no detectado", 
      result: "Faltante o no detectado", 
      score: 0 
    },
    toneScore: 0, 
    toneExplanation: "Análisis no disponible", 
    assertivenessScore: 0, 
    assertivenessExplanation: "Análisis no disponible",
    generalFeedback: "La respuesta fue demasiado breve o el servicio de análisis no respondió a tiempo."
  };

  if (!apiKey) return emptyFeedback;
  if (userResponse.trim().length < 10) {
    return {
      ...emptyFeedback,
      generalFeedback: "Respuesta demasiado corta para un análisis STAR riguroso. Intenta expandir tu contexto."
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Actúa como un Coach de Carreras Senior EXTREMADAMENTE RIGUROSO. Tu tarea es analizar la RESPUESTA del usuario a una pregunta de entrevista para el puesto de ${config.role} usando el método STAR.
    
Pregunta del Entrevistador: ${question}
Respuesta del Candidato: ${userResponse}

Instrucciones Críticas:
1. Analiza EXCLUSIVAMENTE la "Respuesta del Candidato". No analices el texto de la "Pregunta del Entrevistador".
2. Divide la respuesta en Situación, Tarea, Acción y Resultado. Si un componente falta en la respuesta del candidato, escribe explícitamente "No detectado en la respuesta".
3. Sé implacable. Si el Resultado no tiene métricas o impactos claros, penaliza el score.
4. Genera una 'idealResponse' que sea un ejemplo de nivel C-Suite (CEO/CTO/VP) para esta misma pregunta.
5. Proporciona feedback directo y accionable sobre cómo el candidato puede mejorar su estructura STAR.
6. Los puntajes son de 0 a 100.`;
    
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
      const cleaned = cleanJsonResponse(text);
      const data = JSON.parse(cleaned);
      return { 
        ...emptyFeedback, 
        ...data,
        originalResponse: userResponse // Asegurar que mantenemos la original
      };
    });

    return await withTimeout(apiCall, 25000, emptyFeedback);
  } catch (error) {
    console.error("Gemini Error (Analysis):", error);
    return emptyFeedback;
  }
};

export const generateSessionSummary = async (
  questions: QuestionFeedback[],
  config: SessionConfig
): Promise<{ overallSummary: string, fillerWordAnalysis: string, mistakes: string[], overallScore: number, communicationMetrics: any, improvementPlan: string[] }> => {
  const fallback = {
    overallSummary: "Análisis técnico básico completado. Se requiere mayor profundidad en las respuestas para un análisis ejecutivo.",
    fillerWordAnalysis: "Se recomienda trabajar en la fluidez y reducir pausas innecesarias.",
    mistakes: ["Falta de cuantificación en los resultados.", "Estructura STAR incompleta en algunas respuestas."],
    overallScore: 60,
    communicationMetrics: { pacing: 50, vocabulary: 60, clarity: 55, confidence: 50 },
    improvementPlan: ["Integrar métricas de éxito.", "Practicar pausas deliberadas.", "Usar vocabulario más específico del sector."]
  };

  const apiKey = getApiKey();
  if (!apiKey || questions.length === 0) return fallback;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = questions.map(q => `P: ${q.question}\nR: ${q.originalResponse}\nAnálisis STAR detectado: ${JSON.stringify(q.starAnalysis)}`).join("\n\n");
    const prompt = `Analiza el desempeño global de una entrevista para el cargo de ${config.role}. 
    
    Contexto de la sesión:\n${context}\n\n
    
    Instrucciones:
    1. Identifica muletillas y patrones de lenguaje débil.
    2. Evalúa la capacidad de liderazgo y resolución según las respuestas.
    3. Asigna puntajes reales basados en rigor ejecutivo.
    4. Devuelve el resultado estrictamente en JSON.`;
    
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
      const cleaned = cleanJsonResponse(text);
      return JSON.parse(cleaned);
    });

    return await withTimeout(apiCall, 25000, fallback);
  } catch (error) {
    console.error("Summary Error:", error);
    return fallback;
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "";
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ 
        parts: [
          { inlineData: { mimeType, data: base64Audio } }, 
          { text: "Transcribe exactamente lo que dice el usuario. No añadas comentarios, solo el texto transcrito en español." }
        ] 
      }]
    });
    return response.text?.trim() || "";
  } catch (err) {
    console.error("Transcripción fallida:", err);
    return "";
  }
};
