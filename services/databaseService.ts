
import { supabase } from '../lib/supabase.ts';
import { SessionRecord } from '../types.ts';

export const saveSession = async (session: Omit<SessionRecord, 'id'>): Promise<SessionRecord | null> => {
  if (!supabase) return null;

  try {
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

    if (error) throw error;

    return {
      ...data,
      id: data.id,
      userId: data.user_id,
      overallScore: data.overall_score,
      overallSummary: data.overall_summary,
      fillerWordAnalysis: data.filler_word_analysis,
      timestamp: new Date(data.timestamp).getTime()
    };
  } catch (err) {
    console.error("Error al guardar sesión:", err);
    // Si falla por red en cliente real, guardamos un fallback
    return null;
  }
};

export const getUserSessions = async (userId: string): Promise<SessionRecord[]> => {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return (data || []).map((s: any) => ({
      id: s.id,
      userId: s.user_id,
      timestamp: new Date(s.timestamp).getTime(),
      config: s.config,
      overallScore: s.overall_score,
      overallSummary: s.overall_summary,
      fillerWordAnalysis: s.filler_word_analysis,
      mistakes: s.mistakes,
      questions: s.questions
    }));
  } catch (err) {
    console.error("Error al obtener sesiones:", err);
    return [];
  }
};
