-- Statistics Page Seed Data
-- This file creates comprehensive test data for the Learning Statistics page
-- Run this after database reset to populate realistic learning data

BEGIN;

-- =================================================================
-- 1. Create Sample Users for Testing
-- =================================================================

-- Demo user with good learning habits (active learner)
INSERT INTO public.users (id, email, password_hash, display_name, role, email_verified, created_at) 
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'learner@vocaboost.com',
  'Demo Learner',
  'learner',
  true,
  '2024-05-01 10:00:00+00'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  email_verified = EXCLUDED.email_verified;

-- User settings for demo user
INSERT INTO public.user_settings (user_id, daily_goal) 
VALUES (
  '11111111-1111-1111-1111-111111111111',
  50
) ON CONFLICT (user_id) DO UPDATE SET daily_goal = EXCLUDED.daily_goal;

-- =================================================================
-- 2. Create Vocabulary Lists and Words
-- =================================================================

-- IELTS Vocabulary List
INSERT INTO public.vocab_lists (id, creator_id, title, description, word_count, privacy_setting, created_at) 
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'IELTS Academic Vocabulary',
  'Essential vocabulary for IELTS Academic test preparation',
  25,
  'public',
  '2024-07-01 09:00:00+00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  word_count = EXCLUDED.word_count;

-- Business English List
INSERT INTO public.vocab_lists (id, creator_id, title, description, word_count, privacy_setting, created_at) 
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Business English Essentials',
  'Key vocabulary for professional communication',
  30,
  'public',
  '2024-08-15 14:30:00+00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  word_count = EXCLUDED.word_count;

-- Unit 1 Vocabulary
INSERT INTO public.vocab_lists (id, creator_id, title, description, word_count, privacy_setting, created_at) 
VALUES (
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'Unit 1 - Introduction',
  'Basic vocabulary for beginners',
  20,
  'public',
  '2024-09-01 11:15:00+00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  word_count = EXCLUDED.word_count;

-- Advanced Vocabulary List
INSERT INTO public.vocab_lists (id, creator_id, title, description, word_count, privacy_setting, created_at) 
VALUES (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'Advanced Academic Terms',
  'Complex vocabulary for advanced learners',
  40,
  'public',
  '2024-10-10 16:45:00+00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  word_count = EXCLUDED.word_count;

-- Conversational English
INSERT INTO public.vocab_lists (id, creator_id, title, description, word_count, privacy_setting, created_at) 
VALUES (
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'Vocabulary for Daily Conversation',
  'Common words used in everyday English conversations',
  35,
  'public',
  '2024-11-05 13:20:00+00'
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  word_count = EXCLUDED.word_count;

-- =================================================================
-- 3. Create Sample Vocabulary Words
-- =================================================================

-- IELTS Vocabulary Words (25 words)
INSERT INTO public.vocabulary (list_id, created_by, term, definition, created_at) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'analyze', 'to examine something in detail', '2024-07-01 09:15:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'significant', 'important or notable', '2024-07-01 09:16:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'demonstrate', 'to show clearly', '2024-07-01 09:17:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'establish', 'to create or set up', '2024-07-01 09:18:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'hypothesis', 'a proposed explanation', '2024-07-01 09:19:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'consistent', 'staying the same', '2024-07-01 09:20:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'substantial', 'large in amount or degree', '2024-07-01 09:21:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'criteria', 'standards for judgment', '2024-07-01 09:22:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'fundamental', 'basic or essential', '2024-07-01 09:23:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'contemporary', 'belonging to the present time', '2024-07-01 09:24:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'inevitable', 'certain to happen', '2024-07-01 09:25:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'perspective', 'a particular way of viewing things', '2024-07-01 09:26:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'emphasis', 'special importance given to something', '2024-07-01 09:27:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'comprehensive', 'complete and including everything', '2024-07-01 09:28:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'subsequent', 'coming after something', '2024-07-01 09:29:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'acknowledge', 'to accept or admit the existence of', '2024-07-01 09:30:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'facilitate', 'to make easier', '2024-07-01 09:31:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'preliminary', 'coming before the main part', '2024-07-01 09:32:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ambiguous', 'having more than one meaning', '2024-07-01 09:33:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'coherent', 'logical and well-organized', '2024-07-01 09:34:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'explicit', 'clearly stated', '2024-07-01 09:35:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'fluctuate', 'to change irregularly', '2024-07-01 09:36:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'integrity', 'honesty and moral uprightness', '2024-07-01 09:37:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'modify', 'to change partially', '2024-07-01 09:38:00+00'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'paradigm', 'a typical example or pattern', '2024-07-01 09:39:00+00')
ON CONFLICT DO NOTHING;

-- Business English Words (30 words)
INSERT INTO public.vocabulary (list_id, created_by, term, definition, created_at) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'revenue', 'income from business operations', '2024-08-15 14:35:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'stakeholder', 'person with interest in business success', '2024-08-15 14:36:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'leverage', 'to use something to maximum advantage', '2024-08-15 14:37:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'synergy', 'combined effect greater than individual parts', '2024-08-15 14:38:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'benchmark', 'standard point of reference', '2024-08-15 14:39:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'liability', 'legal responsibility or debt', '2024-08-15 14:40:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'portfolio', 'collection of investments or work', '2024-08-15 14:41:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'feasible', 'possible and practical to achieve', '2024-08-15 14:42:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'subsidiary', 'company controlled by another company', '2024-08-15 14:43:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'acquisition', 'act of buying or obtaining something', '2024-08-15 14:44:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'margin', 'difference between cost and selling price', '2024-08-15 14:45:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'audit', 'official inspection of accounts', '2024-08-15 14:46:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'compliance', 'conformity with rules or standards', '2024-08-15 14:47:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'dividend', 'payment made to company shareholders', '2024-08-15 14:48:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'equity', 'ownership interest in a company', '2024-08-15 14:49:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'forecast', 'prediction of future events or trends', '2024-08-15 14:50:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'invoice', 'bill for goods or services provided', '2024-08-15 14:51:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'logistics', 'organization of moving and storing goods', '2024-08-15 14:52:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'negotiate', 'to discuss terms to reach agreement', '2024-08-15 14:53:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'overhead', 'ongoing business expenses', '2024-08-15 14:54:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'procurement', 'process of obtaining goods or services', '2024-08-15 14:55:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'quota', 'fixed number or amount', '2024-08-15 14:56:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'retention', 'continuing to keep something', '2024-08-15 14:57:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'scalable', 'able to be changed in size or scale', '2024-08-15 14:58:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'turnover', 'rate at which employees leave', '2024-08-15 14:59:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'venture', 'risky business undertaking', '2024-08-15 15:00:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'workflow', 'sequence of processes', '2024-08-15 15:01:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'yield', 'produce or generate a result', '2024-08-15 15:02:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'asset', 'valuable item owned by business', '2024-08-15 15:03:00+00'),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'budget', 'plan for income and expenditure', '2024-08-15 15:04:00+00')
ON CONFLICT DO NOTHING;

-- =================================================================
-- 4. Create User Statistics Data
-- =================================================================

INSERT INTO public.user_stats (
  user_id,
  total_vocabulary,
  total_reviews,
  correct_reviews,
  current_streak,
  longest_streak,
  last_review_date,
  total_study_time,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  520,
  1250,
  1100,
  7,
  12,
  CURRENT_DATE,
  1875, -- minutes (31.25 hours)
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  total_vocabulary = EXCLUDED.total_vocabulary,
  total_reviews = EXCLUDED.total_reviews,
  correct_reviews = EXCLUDED.correct_reviews,
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  last_review_date = EXCLUDED.last_review_date,
  total_study_time = EXCLUDED.total_study_time,
  updated_at = EXCLUDED.updated_at;

-- =================================================================
-- 5. Create Monthly Progress Data
-- =================================================================

INSERT INTO public.monthly_user_stats (user_id, month_start_date, cumulative_words_mastered, created_at) VALUES
('11111111-1111-1111-1111-111111111111', '2024-05-01', 200, '2024-05-31 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-06-01', 250, '2024-06-30 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-07-01', 280, '2024-07-31 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-08-01', 350, '2024-08-31 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-09-01', 420, '2024-09-30 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-10-01', 480, '2024-10-31 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-11-01', 500, '2024-11-30 23:59:59+00'),
('11111111-1111-1111-1111-111111111111', '2024-12-01', 520, '2024-12-31 23:59:59+00')
ON CONFLICT (user_id, month_start_date) DO UPDATE SET
  cumulative_words_mastered = EXCLUDED.cumulative_words_mastered,
  updated_at = NOW();

-- =================================================================
-- 6. Create User Word Progress (for completion rates)
-- =================================================================

-- Create realistic word progress data by selecting actual vocabulary IDs
-- This approach creates progress for vocabulary words that actually exist

DO $$
DECLARE
  vocab_record RECORD;
  total_ielts_words INTEGER := 0;
  total_business_words INTEGER := 0;
  ielts_mastered INTEGER := 0;
  business_mastered INTEGER := 0;
BEGIN
  -- Create progress for IELTS vocabulary (target: 85% completion = ~21/25 mastered)
  FOR vocab_record IN (
    SELECT id FROM public.vocabulary 
    WHERE list_id = '22222222-2222-2222-2222-222222222222'
    ORDER BY created_at
    LIMIT 25
  ) LOOP
    total_ielts_words := total_ielts_words + 1;
    
    -- 85% mastered (interval >= 21), 15% still learning
    IF total_ielts_words <= 21 THEN 
      -- Mastered words (21+ day intervals)
      INSERT INTO public.user_word_progress (user_id, word_id, interval_days, ease_factor, repetitions, correct_count, last_reviewed_at) VALUES (
        '11111111-1111-1111-1111-111111111111',
        vocab_record.id,
        21 + floor(random() * 20), -- 21-40 days
        2.5 + (random() * 0.6), -- 2.5-3.1 ease factor
        5 + floor(random() * 6), -- 5-10 repetitions  
        4 + floor(random() * 6), -- 4-9 correct
        CURRENT_DATE - (floor(random() * 10) || ' days')::interval -- Last 10 days
      ) ON CONFLICT (user_id, word_id) DO NOTHING;
      ielts_mastered := ielts_mastered + 1;
    ELSE
      -- Still learning words (< 21 day intervals)
      INSERT INTO public.user_word_progress (user_id, word_id, interval_days, ease_factor, repetitions, correct_count, last_reviewed_at) VALUES (
        '11111111-1111-1111-1111-111111111111',
        vocab_record.id,
        1 + floor(random() * 20), -- 1-20 days
        2.0 + (random() * 0.5), -- 2.0-2.5 ease factor
        1 + floor(random() * 4), -- 1-4 repetitions
        1 + floor(random() * 3), -- 1-3 correct  
        CURRENT_DATE - (floor(random() * 5) || ' days')::interval -- Last 5 days
      ) ON CONFLICT (user_id, word_id) DO NOTHING;
    END IF;
  END LOOP;
  
  -- Create progress for Business English vocabulary (target: 73% completion = ~22/30 mastered)
  FOR vocab_record IN (
    SELECT id FROM public.vocabulary 
    WHERE list_id = '33333333-3333-3333-3333-333333333333'
    ORDER BY created_at
    LIMIT 30
  ) LOOP
    total_business_words := total_business_words + 1;
    
    -- 73% mastered (interval >= 21), 27% still learning  
    IF total_business_words <= 22 THEN
      -- Mastered words
      INSERT INTO public.user_word_progress (user_id, word_id, interval_days, ease_factor, repetitions, correct_count, last_reviewed_at) VALUES (
        '11111111-1111-1111-1111-111111111111',
        vocab_record.id,
        21 + floor(random() * 25), -- 21-45 days
        2.6 + (random() * 0.6), -- 2.6-3.2 ease factor
        6 + floor(random() * 6), -- 6-11 repetitions
        5 + floor(random() * 6), -- 5-10 correct
        CURRENT_DATE - (floor(random() * 8) || ' days')::interval -- Last 8 days
      ) ON CONFLICT (user_id, word_id) DO NOTHING;
      business_mastered := business_mastered + 1;
    ELSE
      -- Still learning words  
      INSERT INTO public.user_word_progress (user_id, word_id, interval_days, ease_factor, repetitions, correct_count, last_reviewed_at) VALUES (
        '11111111-1111-1111-1111-111111111111',
        vocab_record.id,
        1 + floor(random() * 20), -- 1-20 days
        2.0 + (random() * 0.6), -- 2.0-2.6 ease factor
        1 + floor(random() * 5), -- 1-5 repetitions
        1 + floor(random() * 4), -- 1-4 correct
        CURRENT_DATE - (floor(random() * 3) || ' days')::interval -- Last 3 days
      ) ON CONFLICT (user_id, word_id) DO NOTHING;
    END IF;
  END LOOP;

  RAISE NOTICE 'Created word progress: IELTS % mastered out of %, Business English % mastered out of %', 
    ielts_mastered, total_ielts_words, business_mastered, total_business_words;
END $$;

-- =================================================================
-- 7. Create Revision Sessions (for study consistency)
-- =================================================================

-- Create study sessions over the last 90 days with realistic patterns
-- More frequent recent sessions, some gaps for realistic data

DO $$
DECLARE
  session_date DATE;
  session_count INTEGER := 0;
  list_ids UUID[] := ARRAY[
    '22222222-2222-2222-2222-222222222222'::UUID,
    '33333333-3333-3333-3333-333333333333'::UUID,
    '44444444-4444-4444-4444-444444444444'::UUID,
    '55555555-5555-5555-5555-555555555555'::UUID
  ];
  selected_list_id UUID;
BEGIN
  -- Generate sessions for the last 90 days
  FOR i IN 0..89 LOOP
    session_date := CURRENT_DATE - i;
    
    -- Skip some days to create realistic gaps (weekends, busy days)
    -- Skip about 30% of days for realistic study pattern
    IF (
      EXTRACT(DOW FROM session_date) NOT IN (0, 6) -- Not weekend
      AND random() > 0.3 -- 70% chance of studying
    ) OR (
      i <= 15 AND random() > 0.1 -- Recent 15 days, study 90% of time
    ) THEN
      -- Select random list
      selected_list_id := list_ids[1 + floor(random() * array_length(list_ids, 1))];
      
      session_count := session_count + 1;
      
      INSERT INTO public.revision_sessions (
        id,
        user_id,
        vocab_list_id,
        session_type,
        status,
        started_at,
        completed_at,
        score,
        total_words,
        correct_answers
      ) VALUES (
        gen_random_uuid(),
        '11111111-1111-1111-1111-111111111111',
        selected_list_id,
        CASE 
          WHEN random() < 0.4 THEN 'flashcard'
          WHEN random() < 0.7 THEN 'fill_blank'
          ELSE 'word_association'
        END,
        'completed',
        session_date + (interval '8 hours') + (random() * interval '8 hours'),
        session_date + (interval '8 hours') + (random() * interval '8 hours') + (interval '15 minutes') + (random() * interval '30 minutes'),
        75 + floor(random() * 25), -- Score between 75-100
        15 + floor(random() * 10), -- 15-25 words per session
        12 + floor(random() * 8)   -- Correct answers
      ) ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Created % revision sessions for study consistency', session_count;
END $$;

-- =================================================================
-- 8. Summary and Verification
-- =================================================================

-- Update word counts to match actual vocabulary inserted
UPDATE public.vocab_lists SET word_count = (
  SELECT COUNT(*) FROM public.vocabulary WHERE list_id = vocab_lists.id
);

COMMIT;

-- Verification queries (uncomment to run manually)
/*
SELECT 'Users created:' as info, COUNT(*) as count FROM public.users WHERE email LIKE '%vocaboost.com';
SELECT 'Vocab lists created:' as info, COUNT(*) as count FROM public.vocab_lists WHERE creator_id = '11111111-1111-1111-1111-111111111111';
SELECT 'Words created:' as info, COUNT(*) as count FROM public.vocabulary WHERE list_id IN (
  SELECT id FROM public.vocab_lists WHERE creator_id = '11111111-1111-1111-1111-111111111111'
);
SELECT 'User stats:' as info, * FROM public.user_stats WHERE user_id = '11111111-1111-1111-1111-111111111111';
SELECT 'Monthly progress:' as info, COUNT(*) as months FROM public.monthly_user_stats WHERE user_id = '11111111-1111-1111-1111-111111111111';
SELECT 'Word progress:' as info, COUNT(*) as mastered_words FROM public.user_word_progress WHERE user_id = '11111111-1111-1111-1111-111111111111' AND interval_days >= 21;
SELECT 'Study sessions:' as info, COUNT(*) as sessions FROM public.revision_sessions WHERE user_id = '11111111-1111-1111-1111-111111111111';
*/