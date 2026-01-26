
import { supabase } from '../lib/supabase';
import { SessionRecord } from '../types';

export const saveSession = async (session: Omit<SessionRecord, 'id'>): Promise<SessionRecord | null> => {
  if (!supabase) return null;

  const payload = {
    user_id: session.userId,
    config: session.config,
    overall_score: session.overallScore,
    overall_summary: session.overallSummary,
    filler_word_analysis: session.fillerWordAnalysis,
    mistakes: session.mistakes,
    questions: session.questions
  };

  const { data, error } = await supabase
    .from('sessions')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error al guardar sesión:", error);
    return null;
  }

  // Mapear de vuelta para el estado de la app
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
  if (!supabase) return [];

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
    ...s,
    userId: s.user_id,
    overallScore: s.overall_score,
    overallSummary: s.overall_summary,
    fillerWordAnalysis: s.filler_word_analysis,
    timestamp: new Date(s.timestamp).getTime()
  }));
};
