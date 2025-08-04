// src/models/review.model.js

const { supabase } = require('../config/supabase.config');
const logger = require('../utils/logger');

class ReviewModel {
  // =================================================================
  //  FETCHING DUE ITEMS
  // =================================================================

  async findListsWithDueWords(userId, from, to) {
    return await supabase.rpc('get_lists_with_due_words', {
      p_user_id: userId,
      p_limit: to - from + 1,
      p_offset: from,
    });
  }

  async findDueWordsGroupedByList(userId) {
    const { data, error } = await supabase
      .from('user_word_progress')
      .select('vocabulary (id, term, list_id, vocab_lists (title, tags (name)))')
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString());

    if (error) throw error;
    return data;
  }

  async findDueWordsByListId(userId, listId, limit = 20) {
    try {
      // Step 1: Get all words from the list
      const { data: allWords, error: wordsError } = await supabase
        .from('vocabulary')
        .select(`
          id,
          term,
          definition,
          phonetics,
          image_url
        `)
        .eq('list_id', listId);

      if (wordsError) throw wordsError;
      if (!allWords || allWords.length === 0) {
        return [];
      }

      const wordIds = allWords.map(word => word.id);

      // Step 2: Get existing progress records for these words
      const { data: existingProgress, error: progressError } = await supabase
        .from('user_word_progress')
        .select('word_id, next_review_date')
        .eq('user_id', userId)
        .in('word_id', wordIds);

      if (progressError) throw progressError;

      // Step 3: Create progress records for words that don't have any
      const existingWordIds = new Set((existingProgress || []).map(p => p.word_id));
      const wordsNeedingProgress = allWords.filter(word => !existingWordIds.has(word.id));

      if (wordsNeedingProgress.length > 0) {
        const newProgressRecords = wordsNeedingProgress.map(word => ({
          user_id: userId,
          word_id: word.id,
          next_review_date: new Date().toISOString(), // Due immediately for new words
          interval_days: 1,
          ease_factor: 2.5,
          repetitions: 0
        }));

        const { error: insertError } = await supabase
          .from('user_word_progress')
          .upsert(newProgressRecords, { 
            onConflict: 'user_id,word_id',
            ignoreDuplicates: true 
          });

        if (insertError) {
          logger.warn(`Failed to create progress records: ${insertError.message}`);
        }
      }

      // Step 4: Get words that are due for review
      const now = new Date().toISOString();
      const allProgress = [
        ...(existingProgress || []),
        ...wordsNeedingProgress.map(word => ({
          word_id: word.id,
          next_review_date: now
        }))
      ];

      const dueWordIds = allProgress
        .filter(p => p.next_review_date <= now)
        .map(p => p.word_id)
        .slice(0, limit);

      // Step 5: Return the due words with all their details
      const dueWords = allWords.filter(word => dueWordIds.includes(word.id));

      // Step 6: Get examples for the due words
      const { data: examples, error: examplesError } = await supabase
        .from('vocabulary_examples')
        .select('vocabulary_id, example_sentence')
        .in('vocabulary_id', dueWordIds);

      if (examplesError) {
        logger.warn(`Failed to fetch examples: ${examplesError.message}`);
      }

      // Step 7: Get synonyms for the due words  
      const { data: synonyms, error: synonymsError } = await supabase
        .from('word_synonyms')
        .select('word_id, synonym')
        .in('word_id', dueWordIds);

      if (synonymsError) {
        logger.warn(`Failed to fetch synonyms: ${synonymsError.message}`);
      }

      // Step 8: Combine everything
      const examplesByWordId = new Map();
      (examples || []).forEach(ex => {
        if (!examplesByWordId.has(ex.vocabulary_id)) {
          examplesByWordId.set(ex.vocabulary_id, []);
        }
        examplesByWordId.get(ex.vocabulary_id).push({ example_sentence: ex.example_sentence });
      });

      const synonymsByWordId = new Map();
      (synonyms || []).forEach(s => {
        if (!synonymsByWordId.has(s.word_id)) {
          synonymsByWordId.set(s.word_id, []);
        }
        synonymsByWordId.get(s.word_id).push(s.synonym);
      });

      const enrichedWords = dueWords.map(word => ({
        ...word,
        examples: examplesByWordId.get(word.id) || [],
        synonyms: synonymsByWordId.get(word.id) || []
      }));

      return enrichedWords;

    } catch (error) {
      logger.error(
        `Error in findDueWordsByListId for user ${userId} and list ${listId}:`,
        error
      );
      throw error;
    }
  }

  async findAllWordsByListId(listId, limit = 20) {
    try {
      // Get all words from the list for practice mode
      const { data: allWords, error: wordsError } = await supabase
        .from('vocabulary')
        .select(`
          id,
          term,
          definition,
          phonetics,
          image_url
        `)
        .eq('list_id', listId)
        .limit(limit);

      if (wordsError) throw wordsError;
      if (!allWords || allWords.length === 0) {
        return [];
      }

      const wordIds = allWords.map(word => word.id);

      // Get examples for the words
      const { data: examples, error: examplesError } = await supabase
        .from('vocabulary_examples')
        .select('vocabulary_id, example_sentence')
        .in('vocabulary_id', wordIds);

      if (examplesError) {
        logger.warn(`Failed to fetch examples: ${examplesError.message}`);
      }

      // Get synonyms for the words  
      const { data: synonyms, error: synonymsError } = await supabase
        .from('word_synonyms')
        .select('word_id, synonym')
        .in('word_id', wordIds);

      if (synonymsError) {
        logger.warn(`Failed to fetch synonyms: ${synonymsError.message}`);
      }

      // Combine everything
      const examplesByWordId = new Map();
      (examples || []).forEach(ex => {
        if (!examplesByWordId.has(ex.vocabulary_id)) {
          examplesByWordId.set(ex.vocabulary_id, []);
        }
        examplesByWordId.get(ex.vocabulary_id).push({ example_sentence: ex.example_sentence });
      });

      const synonymsByWordId = new Map();
      (synonyms || []).forEach(s => {
        if (!synonymsByWordId.has(s.word_id)) {
          synonymsByWordId.set(s.word_id, []);
        }
        synonymsByWordId.get(s.word_id).push(s.synonym);
      });

      const enrichedWords = allWords.map(word => ({
        ...word,
        examples: examplesByWordId.get(word.id) || [],
        synonyms: synonymsByWordId.get(word.id) || []
      }));

      return enrichedWords;

    } catch (error) {
      logger.error(
        `Error in findAllWordsByListId for list ${listId}:`,
        error
      );
      throw error;
    }
  }

  // =================================================================
  //  SESSION MANAGEMENT
  // =================================================================

  async findActiveSession(userId) {
    const { data, error } = await supabase
      .from('revision_sessions')
      .select('id, session_type, total_words, vocab_list_id, word_ids, started_at')
      .eq('user_id', userId)
      .in('status', ['in_progress', 'interrupted'])
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data;
  }

  async createSession(userId, listId, sessionType, wordIds) {
    return await supabase
      .from('revision_sessions')
      .insert({
        user_id: userId,
        vocab_list_id: listId,
        session_type: sessionType,
        status: 'in_progress',
        total_words: wordIds.length,
        word_ids: wordIds,
      })
      .select('id')
      .single();
  }

  async getSessionByIdAndUser(sessionId, userId) {
    const { data, error } = await supabase
      .from('revision_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateSessionStatus(sessionId, status, completedAt = null) {
    const updateData = { status };
    if (completedAt) {
      updateData.completed_at = completedAt;
    }
    const { error } = await supabase
      .from('revision_sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (error) throw error;
  }

  // =================================================================
  //  SESSION RESULTS & SRS
  // =================================================================

  async recordSessionResult(sessionId, wordId, result, responseTimeMs) {
    const { error } = await supabase.from('session_word_results').insert({
      session_id: sessionId,
      word_id: wordId,
      result: result,
      response_time_ms: responseTimeMs,
    });

    if (error) throw error;
  }

  async getWordProgress(userId, wordId) {
    const { data, error } = await supabase
      .from('user_word_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async upsertWordProgress(userId, wordId, newProgressData) {
    const { error } = await supabase.from('user_word_progress').upsert(
      {
        user_id: userId,
        word_id: wordId,
        ...newProgressData,
      },
      { onConflict: 'user_id, word_id' }
    );

    if (error) throw error;
  }

  async getSessionSummaryStats(sessionId) {
    return await supabase
      .from('session_word_results')
      .select('result, word_id')
      .eq('session_id', sessionId);
  }

  async findProgressByWordId(userId, wordId) {
    const { data, error } = await supabase
      .from('user_word_progress')
      .select(
        `
        next_review_date,
        interval_days,
        ease_factor,
        repetitions,
        correct_count,
        incorrect_count,
        last_reviewed_at
      `
      )
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // =================================================================
  //  USER WORD PROGRESS (NEW METHOD)
  // =================================================================

  async createDefaultWordProgress(userId, wordId) {
    const { error } = await supabase.from('user_word_progress').insert({
      user_id: userId,
      word_id: wordId,
      next_review_date: new Date().toISOString(),
      interval_days: 0,
      ease_factor: 2.5,
      repetitions: 0,
    });

    if (error) {
      if (error.code === '23505') {
        // PostgreSQL duplicate key error code
        logger.warn(
          `Default progress for word ${wordId} already exists for user ${userId}. Ignoring.`
        );
        return;
      }
      throw error;
    }
  }

  async createDefaultWordProgressBulk(progressRecords) {
    const { error } = await supabase
      .from('user_word_progress')
      .insert(progressRecords, { onConflict: 'user_id, word_id', ignore: true });
    if (error) throw error;
  }
}

module.exports = new ReviewModel();
