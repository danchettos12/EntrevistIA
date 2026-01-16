
import { GoogleGenAI, Type } from "@google/genai";
import { SessionConfig, QuestionFeedback } from "../types";

// Acceso seguro a la API KEY inyectada por Vite/Vercel
const API_KEY = (process.env.API_KEY as string) || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

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
  if (!API_KEY) return "Error: API_KEY no configurada";
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
            text: "Transcribe exactamente lo que se dice en este audio. Solo devuelve el texto transcrito, nada más."
          }
        ]
      }
    ]
  });
  return response.text?.trim() || "";
};

export const generateInterviewQuestion = async (config: SessionConfig, previousQuestions: string[] = []): Promise<string> => {
  const prompt = `Actúa como un entrevistador de alto nivel para el puesto: ${config.role}. 
  Nivel de presión: ${config.pressure}/100. Enfoque: ${config.focus}/100.
  Preguntas ya realizadas: ${previousQuestions.join(', ')}.
  Genera una pregunta desafiante que requiera una respuesta estructurada.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text || "Hubo un error generando la pregunta.";
};

export const analyzeQuestionResponse = async (
  question: string,
  userResponse: string,
  config: SessionConfig
): Promise<QuestionFeedback> => {
  const prompt = `Analiza detalladamente esta respuesta de entrevista:
  Pregunta: "${question}"
  Respuesta del Candidato: "${userResponse}"
  Puesto: ${config.role}
  
  Devuelve el análisis en formato JSON siguiendo el método STAR y proporcionando feedback de élite.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: FEEDBACK_SCHEMA
    }
  });

  const data = JSON.parse(response.text || '{}');
  return { ...data, question };
};

export const generateSessionSummary = async (
  questions: QuestionFeedback[],
  config: SessionConfig
): Promise<{ overallSummary: string, fillerWordAnalysis: string, mistakes: string[], overallScore: number }> => {
  const transcript = questions.map(q => `P: ${q.question}\nR: ${q.originalResponse}`).join('\n\n');
  
  const prompt = `Actúa como un Coach de Carrera Senior. Analiza el rendimiento global:
  ${transcript}
  Contexto: ${config.role}.
  Identifica vicios de lenguaje, errores críticos y puntaje global.`;

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
