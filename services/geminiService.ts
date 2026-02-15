
import { GoogleGenAI, Type } from "@google/genai";
import { SessionConfig, QuestionFeedback } from "../types.ts";

const FEEDBACK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    originalResponse: { type: Type.STRING },
    idealResponse: { type: Type.STRING, description: 'La respuesta del usuario reescrita para sonar como un experto senior (Modo Espejo)' },
    highlights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          type: { type: Type.STRING, description: 'weak, strong, neutral' },
          reason: { type: Type.STRING }
        },
        required: ['text', 'type']
      }
    },
    starAnalysis: {
      type: Type.OBJECT,
      properties: {
        situation: { type: Type.STRING },
        task: { type: Type.STRING },
        action: { type: Type.STRING },
        result: { type: Type.STRING },
        score: { type: Type.NUMBER }
      },
      required: ['situation', 'task', 'action', 'result', 'score']
    },
    toneScore: { type: Type.NUMBER },
    toneExplanation: { type: Type.STRING },
    assertivenessScore: { type: Type.NUMBER },
    assertivenessExplanation: { type: Type.STRING },
    generalFeedback: { type: Type.STRING }
  },
  required: ['originalResponse', 'idealResponse', 'highlights', 'starAnalysis', 'toneScore', 'toneExplanation', 'assertivenessScore', 'assertivenessExplanation', 'generalFeedback']
};

const cleanJsonResponse = (text: string): string => {
  // Elimina bloques de código markdown si existen
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  // Always use the correct initialization for GoogleGenAI with a named parameter.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Audio
              }
            },
            {
              text: "Transcribe exactamente lo que se dice en este audio de entrevista profesional en español. Devuelve solo el texto de la transcripción, sin comentarios adicionales."
            }
          ]
        }
      ]
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Transcription error:", error);
    return "";
  }
};

export const generateInterviewQuestion = async (config: SessionConfig, previousQuestions: string[] = []): Promise<string> => {
  // Always use the correct initialization for GoogleGenAI with a named parameter.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Actúa como un reclutador senior para el cargo: ${config.role}. 
  Rigor: ${config.pressure}/100. Enfoque Conductual: ${config.focus}/100.
  Preguntas anteriores: ${previousQuestions.join(', ') || 'ninguna'}.
  Genera UNA pregunta desafiante en ESPAÑOL que evalúe competencias críticas para este nivel. Solo devuelve el texto de la pregunta.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text?.trim() || "¿Podría describir un logro del que se sienta especialmente orgulloso?";
  } catch (error) {
    return "¿Cómo manejas situaciones de alta presión en el trabajo?";
  }
};

export const analyzeQuestionResponse = async (
  question: string,
  userResponse: string,
  config: SessionConfig
): Promise<QuestionFeedback> => {
  // Always use the correct initialization for GoogleGenAI with a named parameter.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analiza esta respuesta de entrevista en ESPAÑOL para el cargo de ${config.role}:
  Pregunta: "${question}"
  Respuesta del Candidato: "${userResponse}"
  
  Instrucciones de análisis:
  1. Identifica componentes STAR (Situación, Tarea, Acción, Resultado).
  2. Evalúa tono y asertividad.
  3. Proporciona una "Respuesta Ideal" (Senior Rewrite) que use la misma experiencia del usuario pero con lenguaje ejecutivo de alto impacto.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: FEEDBACK_SCHEMA
      }
    });

    const jsonStr = cleanJsonResponse(response.text || '{}');
    const feedback = JSON.parse(jsonStr);
    // Fix: Include the 'question' property in the returned object to satisfy the QuestionFeedback interface.
    return {
      ...feedback,
      question: question
    };
  } catch (error) {
    console.error("Analysis error:", error);
    // Fallback object to prevent crashes.
    // Fix: Add missing 'question' property to match QuestionFeedback type.
    return {
      question: question,
      originalResponse: userResponse,
      idealResponse: "No se pudo generar la optimización en este momento.",
      highlights: [],
      starAnalysis: { situation: "No detectado", task: "No detectado", action: "No detectado", result: "No detectado", score: 0 },
      toneScore: 0,
      toneExplanation: "Error de análisis",
      assertivenessScore: 0,
      assertivenessExplanation: "Error de análisis",
      generalFeedback: "Hubo un problema procesando esta respuesta específica."
    };
  }
};

export const generateSessionSummary = async (
  questions: QuestionFeedback[],
  config: SessionConfig
): Promise<{ overallSummary: string, fillerWordAnalysis: string, mistakes: string[], overallScore: number }> => {
  // Always use the correct initialization for GoogleGenAI with a named parameter.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Genera un resumen ejecutivo del desempeño global de esta sesión de entrevista para el cargo de: ${config.role}.
  
  Datos de la sesión:
  ${questions.map(q => `P: ${q.question}\nR: ${q.originalResponse}\nScore STAR: ${q.starAnalysis.score}`).join('\n\n')}

  Instrucciones:
  - Analiza el uso de muletillas y la fluidez narrativa.
  - Identifica los 3 errores más críticos cometidos.
  - Calcula un puntaje de 0 a 100 basado en la calidad técnica y comunicativa.`;

  try {
    const response = await ai.models.generateContent({
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
          required: ['overallSummary', 'fillerWordAnalysis', 'mistakes', 'overallScore']
        }
      }
    });

    const jsonStr = cleanJsonResponse(response.text || '{}');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Summary error:", error);
    return {
      overallSummary: "La sesión finalizó, pero el motor de análisis experimentó una interrupción.",
      fillerWordAnalysis: "Análisis de fluidez no disponible por error técnico.",
      mistakes: ["No se pudieron identificar errores específicos debido a un problema de conexión."],
      overallScore: questions.reduce((acc, q) => acc + q.starAnalysis.score, 0) / (questions.length || 1)
    };
  }
};
