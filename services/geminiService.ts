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

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
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
              text: "Transcribe exactamente lo que se dice en este audio de entrevista profesional en español. Solo devuelve el texto transcrito."
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const prompt = `Actúa como un reclutador senior para el cargo: ${config.role}. 
  Rigor: ${config.pressure}/100. Enfoque Conductual: ${config.focus}/100.
  Preguntas anteriores: ${previousQuestions.join(', ') || 'ninguna'}.
  Genera UNA pregunta desafiante en ESPAÑOL. Solo la pregunta.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "¿Podría describir un logro del que se sienta especialmente orgulloso?";
  } catch (error) {
    return "¿Cómo manejas situaciones de alta presión en el trabajo?";
  }
};

export const analyzeQuestionResponse = async (
  question: string,
  userResponse: string,
  config: SessionConfig
): Promise<QuestionFeedback> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const prompt = `Analiza esta respuesta de entrevista en ESPAÑOL:
  Pregunta: "${question}"
  Respuesta del Candidato: "${userResponse}"
  Cargo Objetivo: ${config.role}
  Analiza estructura STAR, tono y asertividad. Proporciona una "Respuesta Ideal" senior.`;

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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const transcript = questions.map(q => `P: ${q.question}\nR: ${q.originalResponse}`).join('\n\n');
  
  const prompt = `Genera un resumen ejecutivo del desempeño de la entrevista para el cargo de: ${config.role}.
  
  Basado en la siguiente transcripción de la sesión:
  ${transcript}

  Instrucciones:
  1. Analiza muletillas y fluidez.
  2. Identifica errores críticos en la narrativa profesional.
  3. Califica el desempeño general de 0 a 100.
  
  Devuelve la respuesta estrictamente en formato JSON.`;

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