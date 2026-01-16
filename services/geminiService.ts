
import { GoogleGenAI, Type } from "@google/genai";
import { SessionConfig, QuestionFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    toneExplanation: { type: Type.STRING, description: 'Breve explicación de por qué se asignó ese puntaje de tono.' },
    assertivenessScore: { type: Type.NUMBER },
    assertivenessExplanation: { type: Type.STRING, description: 'Breve explicación de por qué se asignó ese puntaje de asertividad.' },
    generalFeedback: { type: Type.STRING }
  },
  required: ['originalResponse', 'idealResponse', 'highlights', 'starAnalysis', 'toneScore', 'toneExplanation', 'assertivenessScore', 'assertivenessExplanation', 'generalFeedback']
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
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
            text: "Transcribe exactamente lo que se dice en este audio. Solo devuelve el texto transcrito, nada más. Si no hay audio o no se entiende, devuelve una cadena vacía."
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
  Preguntas ya realizadas para evitar repetición: ${previousQuestions.join(', ')}.
  Genera una pregunta desafiante que requiera una respuesta estructurada. Solo devuelve el texto de la pregunta.`;

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
  
  Instrucciones para MODO ESPEJO: Crea una 'idealResponse' que sea la respuesta del usuario pero mejorada significativamente. Mantén los hechos que el usuario mencionó pero estructúralos bajo el método STAR con un lenguaje mucho más profesional, asertivo y de nivel senior.
  
  Analiza también el Tono (profesionalismo, calidez, entusiasmo) y la Asertividad (seguridad, claridad, impacto). Proporciona una explicación breve para cada puntaje de 0 a 100.
  
  Devuelve el análisis en formato JSON.`;

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
  
  const prompt = `Actúa como un Coach de Carrera Senior. Analiza el rendimiento global de esta sesión de entrevista:
  ${transcript}
  
  Contexto del puesto: ${config.role}.
  
  Requisitos:
  1. 'overallSummary': Un resumen ejecutivo de su desempeño.
  2. 'fillerWordAnalysis': Identifica muletillas específicas usadas (ehh, este, como, mmm, ya sabes, etc.). 
     IMPORTANTE: No te limites a listarlas. Para cada vicio detectado, proporciona:
     - El impacto negativo que tiene en la percepción del reclutador.
     - Un ejemplo concreto de cómo reemplazar esa muletilla por una "Pausa Estratégica" o una "Palabra Conectora Asertiva" (ej: en lugar de 'bueno...', usar 'específicamente...' o simplemente silencio).
     Usa un tono de mentoría profesional.
  3. 'mistakes': Una lista de máximo 5 puntos donde el candidato "la cagó".
  4. 'overallScore': Puntaje de 0 a 100.
  
  Devuelve JSON riguroso.`;

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
