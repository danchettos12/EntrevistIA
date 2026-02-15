
import { GoogleGenAI, Type } from "@google/genai";
import { SessionConfig, QuestionFeedback } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

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
          type: { type: Type.STRING, description: 'weak (débil), strong (fuerte), o neutral' },
          reason: { type: Type.STRING, description: 'Razón del análisis' }
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

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const ai = getAI();
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
            text: "Transcribe exactamente lo que se dice en este audio de entrevista profesional en español. Solo devuelve el texto transcrito, nada más."
          }
        ]
      }
    ]
  });
  return response.text?.trim() || "";
};

export const generateInterviewQuestion = async (config: SessionConfig, previousQuestions: string[] = []): Promise<string> => {
  const ai = getAI();
  const prompt = `Actúa como un entrevistador de Recursos Humanos de alto nivel para el puesto de: ${config.role}. 
  Rigor de la evaluación: ${config.pressure}/100. Enfoque técnico/conductual: ${config.focus}/100.
  Preguntas ya realizadas para evitar repetición: ${previousQuestions.join(', ') || 'ninguna'}.
  Genera una pregunta desafiante en ESPAÑOL que requiera una respuesta estructurada bajo estándares corporativos. Solo devuelve la pregunta.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text || "Hubo un error al generar la pregunta de evaluación.";
};

export const analyzeQuestionResponse = async (
  question: string,
  userResponse: string,
  config: SessionConfig
): Promise<QuestionFeedback> => {
  const ai = getAI();
  const prompt = `Analiza detalladamente esta respuesta de entrevista bajo estándares profesionales en ESPAÑOL:
  Pregunta: "${question}"
  Respuesta del Candidato: "${userResponse}"
  Cargo Objetivo: ${config.role}
  
  Instrucciones:
  1. Identifica los componentes STAR (Situación, Tarea, Acción, Resultado).
  2. Evalúa el tono y la asertividad.
  3. Proporciona una "Respuesta Ideal" (Modo Espejo) que el candidato debería haber dado para sonar como un profesional senior.
  4. Devuelve el análisis estrictamente en formato JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: FEEDBACK_SCHEMA
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateSessionSummary = async (
  questions: QuestionFeedback[],
  config: SessionConfig
): Promise<{ overallSummary: string, fillerWordAnalysis: string, mistakes: string[], overallScore: number }> => {
  const ai = getAI();
  const transcript = questions.map(q => `Pregunta: ${q.question}\nRespuesta: ${q.originalResponse}`).join('\n\n');
  
  const prompt = `Actúa como un Consultor de Selección Senior. Analiza el rendimiento global de esta sesión de práctica en ESPAÑOL:
  ${transcript}
  Contexto del Cargo: ${config.role}.
  
  Tareas:
  1. Redacta un resumen ejecutivo del desempeño.
  2. Analiza el uso de muletillas y fluidez verbal.
  3. Identifica 3 errores críticos cometidos.
  4. Asigna una calificación global de competencia (0-100).
  
  Devuelve el resultado estrictamente en formato JSON.`;

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

  return JSON.parse(response.text || '{}');
};
