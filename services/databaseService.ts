
import { supabase } from '../lib/supabase';
import { SessionRecord } from '../types';

export const saveSession = async (session: Omit<SessionRecord, 'id'>): Promise<SessionRecord | null> => {
  if (!supabase) {
    console.error("Cliente de Supabase no inicializado.");
    return null;
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert([{
      user_id: session.userId,
      config: session.config,
      overall_score: session.overallScore,
      overall_summary: session.overallSummary,
      filler_word_analysis: session.fillerWordAnalysis,
      mistakes: session.mistakes,
      questions: session.questions
    }])
    .select()
    .single();

  if (error) {
    console.error("Error al guardar la sesión en Supabase:", error);
    return null;
  }

  return {
    ...data,
    userId: data.user_id,
    overallScore: data.overall_score,
    overallSummary: data.overall_summary,
    fillerWordAnalysis: data.filler_word_analysis,
    timestamp: new Date(data.timestamp).getTime()
  };
};

export const getUserSessions = async (userId: string): Promise<SessionRecord[]> => {
  if (!supabase) {
    console.error("Cliente de Supabase no inicializado.");
    return [];
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error("Error al obtener sesiones:", error);
    return [];
  }

  return data.map((s: any) => ({
    id: s.id,
    userId: s.user_id,
    timestamp: new Date(s.timestamp).getTime(),
    config: s.config,
    overallScore: s.overall_score,
    overall_summary: s.overall_summary,
    filler_word_analysis: s.filler_word_analysis,
    mistakes: s.mistakes,
    questions: s.questions,
    // Adaptación de nombres de propiedades de BD a TS
    overallSummary: s.overall_summary,
    fillerWordAnalysis: s.filler_word_analysis
  }));
};
