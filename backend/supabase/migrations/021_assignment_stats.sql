-- Migration: Assignment Statistic Feature
-- Author: VocaBoost Backend Team
-- Date: 2025-08-05

BEGIN;
-- Drop the function if it already exists to avoid errors on re-run
DROP FUNCTION IF EXISTS public.get_assignment_study_stats(uuid);

-- Create the function that calculates total study duration and the number of unique learners
CREATE OR REPLACE FUNCTION public.get_assignment_study_stats(assignment_id_param UUID)
RETURNS TABLE (total_duration_seconds BIGINT, total_studying_learners BIGINT)
LANGUAGE sql
STABLE -- Indicates the function cannot modify the database and is safe for read replicas
AS $$
  SELECT
    -- Calculate the total duration in seconds from all completed sessions for this assignment.
    -- COALESCE handles the case where there are no sessions, returning 0 instead of NULL.
    COALESCE(
      CAST(SUM(EXTRACT(EPOCH FROM (rs.completed_at - rs.started_at))) AS BIGINT), 
      0
    ) AS total_duration_seconds,

    -- Count the number of unique learners who have completed at least one session.
    COALESCE(COUNT(DISTINCT rs.user_id), 0) AS total_studying_learners
  FROM
    public.revision_sessions AS rs
  WHERE
    rs.assignment_id = assignment_id_param AND rs.completed_at IS NOT NULL;
$$;

-- Update the migration
INSERT INTO schema_migrations (version, description) 
VALUES ('021', 'Add get_assignment_stats function')
ON CONFLICT (version) DO NOTHING;

COMMIT;