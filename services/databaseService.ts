
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
        questions: session.questions,
        communication_metrics: session.communicationMetrics,
        improvement_plan: session.improvementPlan
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      timestamp: new Date(data.timestamp).getTime(),
      config: data.config,
      overallScore: data.overall_score,
      overallSummary: data.overall_summary,
      fillerWordAnalysis: data.filler_word_analysis,
      mistakes: data.mistakes,
      questions: data.questions,
      communicationMetrics: data.communication_metrics,
      improvementPlan: data.improvement_plan
    };
  } catch (err) {
    console.error("Error al guardar sesión:", err);
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
      questions: s.questions,
      communicationMetrics: s.communication_metrics,
      improvementPlan: s.improvement_plan
    }));
  } catch (err) {
    console.error("Error al obtener sesiones:", err);
    return [];
  }
};
