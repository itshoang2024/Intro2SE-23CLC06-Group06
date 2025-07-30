-- =================================================================
--  VocaBoost Seed Data for Local Development
-- =================================================================
-- This script populates the database with initial data for testing.
-- It is executed automatically after migrations when running `supabase start`.
-- =================================================================

-- Use a block to declare variables for IDs to make the script readable and maintainable.
DO $$
DECLARE
    -- User IDs
    user_learner_id UUID := '10000000-0000-0000-0000-000000000001';
    user_teacher_id UUID := '10000000-0000-0000-0000-000000000002';

    -- Tag IDs (placeholders, will be fetched after insertion)
    tag_ielts_id INT;
    tag_academic_id INT;
    tag_business_id INT;
    tag_finance_id INT;
    tag_reading_id INT;

    -- List IDs
    list_ielts_id UUID := '20000000-0000-0000-0000-000000000001';
    list_business_id UUID := '20000000-0000-0000-0000-000000000002';
    
    -- Word IDs
    word_eminent_id UUID := '30000000-0000-0000-0000-000000000001';
    word_imminent_id UUID := '30000000-0000-0000-0000-000000000002';
    word_leverage_id UUID := '30000000-0000-0000-0000-000000000003';
    word_synergy_id UUID := '30000000-0000-0000-0000-000000000004';
    word_analyze_id UUID := '30000000-0000-0000-0000-000000000005';

BEGIN

-- =====================================================
--  1. Seed Users
-- =====================================================
RAISE NOTICE 'Seeding users...';
INSERT INTO public.users (id, email, password_hash, display_name, role, email_verified)
VALUES
  (user_learner_id, 'learner@vocaboost.com', '$2a$10$abcdefghijklmnopqrstuv', 'Test Learner', 'learner', true),
  (user_teacher_id, 'teacher@vocaboost.com', '$2a$10$abcdefghijklmnopqrstuv', 'Test Teacher', 'teacher', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
--  2. Seed Tags
-- =====================================================
RAISE NOTICE 'Seeding tags...';
INSERT INTO public.tags (name) VALUES
  ('ielts'), ('academic'), ('business'), ('finance'), ('reading')
ON CONFLICT (name) DO NOTHING;

-- Fetch the generated IDs for the tags to use them later
SELECT id INTO tag_ielts_id FROM public.tags WHERE name = 'ielts';
SELECT id INTO tag_academic_id FROM public.tags WHERE name = 'academic';
SELECT id INTO tag_business_id FROM public.tags WHERE name = 'business';
SELECT id INTO tag_finance_id FROM public.tags WHERE name = 'finance';
SELECT id INTO tag_reading_id FROM public.tags WHERE name = 'reading';

-- =====================================================
--  3. Seed Vocabulary Lists
-- =====================================================
RAISE NOTICE 'Seeding vocabulary lists...';
INSERT INTO public.vocab_lists (id, creator_id, title, description, privacy_setting)
VALUES
  (list_ielts_id, user_teacher_id, 'IELTS Academic - Unit 1', 'Core IELTS vocabulary for academic topics found in the reading section.', 'public'),
  (list_business_id, user_teacher_id, 'Business English Essentials', 'Important terms for corporate communication and finance.', 'private');

-- =====================================================
--  4. Associate Tags with Lists
-- =====================================================
RAISE NOTICE 'Associating tags with lists...';
INSERT INTO public.list_tags (list_id, tag_id)
VALUES
  (list_ielts_id, tag_ielts_id),
  (list_ielts_id, tag_academic_id),
  (list_ielts_id, tag_reading_id),
  (list_business_id, tag_business_id),
  (list_business_id, tag_finance_id);

-- =====================================================
--  5. Seed Vocabulary Words
-- =====================================================
RAISE NOTICE 'Seeding vocabulary words...';
INSERT INTO public.vocabulary (id, list_id, created_by, term, definition, phonetics, image_url)
VALUES
  (word_eminent_id, list_ielts_id, user_teacher_id, 'Eminent', 'Famous and respected within a particular sphere or profession.', '/ˈɛmɪnənt/', NULL),
  (word_imminent_id, list_ielts_id, user_teacher_id, 'Imminent', 'About to happen; threatening.', '/ˈɪmɪnənt/', NULL),
  (word_analyze_id, list_ielts_id, user_teacher_id, 'Analyze', 'Examine something methodically and in detail, typically in order to explain and interpret it.', '/ˈænəlaɪz/', NULL),
  (word_leverage_id, list_business_id, user_teacher_id, 'Leverage', 'Use (something) to maximum advantage.', '/ˈlɛvərɪdʒ/', NULL),
  (word_synergy_id, list_business_id, user_teacher_id, 'Synergy', 'The interaction or cooperation of two or more organizations to produce a combined effect greater than the sum of their separate effects.', '/ˈsɪnərdʒi/', NULL);

-- =====================================================
--  6. Seed Example Sentences
-- =====================================================
RAISE NOTICE 'Seeding example sentences...';
INSERT INTO public.vocabulary_examples (vocabulary_id, example_sentence, translation)
VALUES
  (word_eminent_id, 'She is an eminent researcher in the field of quantum physics.', 'Bà ấy là một nhà nghiên cứu lỗi lạc trong lĩnh vực vật lý lượng tử.'),
  (word_imminent_id, 'With dark clouds gathering, a storm was imminent.', 'Với những đám mây đen kéo đến, một cơn bão sắp xảy ra.'),
  (word_leverage_id, 'We must leverage our brand recognition to expand into new markets.', 'Chúng ta phải tận dụng sự nhận diện thương hiệu để mở rộng sang các thị trường mới.'),
  (word_synergy_id, 'The synergy between the marketing and sales teams led to a record-breaking quarter.', 'Sự hợp lực giữa đội marketing và bán hàng đã dẫn đến một quý phá kỷ lục.');

-- =====================================================
--  7. Seed Synonyms
-- =====================================================
RAISE NOTICE 'Seeding synonyms...';
INSERT INTO public.word_synonyms (word_id, synonym)
VALUES
  (word_eminent_id, 'renowned'),
  (word_eminent_id, 'distinguished'),
  (word_leverage_id, 'exploit'),
  (word_leverage_id, 'utilize'),
  (word_synergy_id, 'collaboration'),
  (word_synergy_id, 'teamwork');

-- =====================================================
--  8. Update Word Counts on Lists (Important!)
-- =====================================================
RAISE NOTICE 'Updating list word counts...';
-- You can call the RPC function you already created, which is cleaner

RAISE NOTICE 'Seed data insertion complete.';

END $$;