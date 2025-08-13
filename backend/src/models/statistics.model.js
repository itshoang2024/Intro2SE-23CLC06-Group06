// src/models/statistics.model.js

const { supabase } = require('../config/supabase.config');
const logger = require('../utils/logger');

class StatisticsModel {
  async getSummaryStats(userId) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        logger.error(`[getSummaryStats] Database error for user ${userId}:`, error);
        // Return default stats if user_stats doesn't exist
        return {
          data: {
            total_vocabulary: 0,
            total_reviews: 0,
            correct_reviews: 0,
            current_streak: 0,
            longest_streak: 0,
            total_study_time: 0,
            last_review_date: null
          },
          error: null
        };
      }

      return { data, error: null };
    } catch (error) {
      logger.error(`[getSummaryStats] Error for user ${userId}:`, error);
      return {
        data: {
          total_vocabulary: 0,
          total_reviews: 0,
          correct_reviews: 0,
          current_streak: 0,
          longest_streak: 0,
          total_study_time: 0,
          last_review_date: null
        },
        error: null
      };
    }
  }

  async getProgressOverTime(userId) {
    try {
      const { data, error } = await supabase
        .from('monthly_user_stats')
        .select('date:month_start_date, wordsMastered:cumulative_words_mastered')
        .eq('user_id', userId)
        .order('month_start_date', { ascending: true });

      if (error) {
        logger.error(`[getProgressOverTime] Database error for user ${userId}:`, error);
        return { data: [], error: null };
      }

      return { data: data || [], error: null };
    } catch (error) {
      logger.error(`[getProgressOverTime] Error for user ${userId}:`, error);
      return { data: [], error: null };
    }
  }

  async getCompletionRateByRecentList(userId, limit = 5) {
    try {
      // First get recent sessions to find which lists the user has been working on
      const { data: recentSessions, error: sessionError } = await supabase
        .from('revision_sessions')
        .select('vocab_list_id')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false, nullsFirst: false })
        .limit(limit * 2);

      if (sessionError) throw sessionError;
      if (!recentSessions || recentSessions.length === 0) {
        return { data: [], error: null };
      }

      const uniqueListIds = [
        ...new Set(recentSessions.map((s) => s.vocab_list_id)),
      ].slice(0, limit);

      // Try to use the stored function first, if it fails, fallback to manual calculation
      try {
        const { data, error } = await supabase.rpc('get_completion_rates_for_lists', {
          p_user_id: userId,
          p_list_ids: uniqueListIds,
        });

        if (error) throw error;
        
        // Transform the data to ensure consistent field names
        const transformedData = data?.map(item => ({
          list_id: item.list_id || item.listId,
          list_name: item.list_name || item.listTitle,
          completion_rate: item.completion_rate || (item.completionRate / 100) || 0
        })) || [];

        return { data: transformedData, error: null };
      } catch (rpcError) {
        logger.warn(`[getCompletionRateByRecentList] RPC function failed, using fallback for user ${userId}:`, rpcError);
        
        // Fallback: Manual calculation
        const completionRates = [];
        for (const listId of uniqueListIds) {
          const { data: listData, error: listError } = await supabase
            .from('vocab_lists')
            .select('id, title, word_count')
            .eq('id', listId)
            .single();

          if (listError || !listData) continue;

          // Get all word IDs for this list first
          const { data: wordIds, error: wordError } = await supabase
            .from('vocabulary')
            .select('id')
            .eq('list_id', listId);

          if (wordError || !wordIds?.length) continue;

          const wordIdList = wordIds.map(w => w.id);

          const { data: progressData, error: progressError } = await supabase
            .from('user_word_progress')
            .select('word_id')
            .eq('user_id', userId)
            .gte('interval_days', 21)
            .in('word_id', wordIdList);

          if (progressError) continue;

          const completionRate = listData.word_count > 0 ? 
            (progressData?.length || 0) / listData.word_count : 0;

          completionRates.push({
            list_id: listData.id,
            list_name: listData.title,
            completion_rate: completionRate
          });
        }

        return { data: completionRates, error: null };
      }
    } catch (error) {
      logger.error(
        `[getCompletionRateByRecentList] Error for user ${userId}:`,
        error
      );
      return { data: [], error: null }; // Return empty array instead of null
    }
  }

  async getStudyConsistency(userId, daysAgo = 90) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data, error } = await supabase
        .from('revision_sessions')
        .select('study_date:completed_at::date')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: false });

      if (error) {
        logger.error(`[getStudyConsistency] Database error for user ${userId}:`, error);
        return { data: [], error: null };
      }

      return { data: data || [], error: null };
    } catch (error) {
      logger.error(`[getStudyConsistency] Error for user ${userId}:`, error);
      return { data: [], error: null };
    }
  }
}

module.exports = new StatisticsModel();
