
import { supabase } from '../lib/supabase.ts';
import { SessionRecord } from '../types.ts';

export const saveSession = async (session: Omit<SessionRecord, 'id'>): Promise<SessionRecord | null> => {
  if (!supabase) {
    console.error("Database Error: Supabase client is not initialized.");
    return null;
  }

  try {
    const isoTimestamp = session.timestamp ? new Date(session.timestamp).toISOString() : new Date().toISOString();

    const insertData = {
      user_id: session.userId,
      timestamp: isoTimestamp,
      config: session.config,
      overall_score: session.overallScore,
      overall_summary: session.overallSummary,
      filler_word_analysis: session.fillerWordAnalysis,
      mistakes: session.mistakes,
      questions: session.questions,
      communication_metrics: session.communicationMetrics,
      improvement_plan: session.improvementPlan
    };

    const { data, error } = await (supabase as any)
      .from('sessions')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    if (!data) {
      console.error("Supabase error: No data returned after insert.");
      return null;
    }

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
    console.error("Critical error saving session:", err);
    return null;
  }
};

export const getUserSessions = async (userId: string): Promise<SessionRecord[]> => {
  if (!supabase) return [];

  try {
    const { data, error } = await (supabase as any)
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }

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
    console.error("Error in getUserSessions:", err);
    return [];
  }
};
