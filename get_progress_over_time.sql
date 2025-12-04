CREATE OR REPLACE FUNCTION get_progress_over_time(
  p_days INTEGER DEFAULT 30,
  p_user_ids UUID[] DEFAULT NULL,
  p_exclude_user_ids UUID[] DEFAULT '{}',
  p_offset_minutes INTEGER DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  progress_date DATE,
  pages_read BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    -- Generate date range for the requested period (in user's local timezone)
    SELECT generate_series(
      (CURRENT_TIMESTAMP - (p_offset_minutes * interval '1 minute'))::date - (p_days - 1),
      (CURRENT_TIMESTAMP - (p_offset_minutes * interval '1 minute'))::date,
      '1 day'::interval
    )::date AS report_date
  ),
  progress_records AS (
    -- Get all progress records within the date range, excluding ignored records
    SELECT
      dp.deadline_id,
      d.user_id,
      ((dp.created_at - (p_offset_minutes * interval '1 minute'))::date) AS progress_date,
      dp.current_progress,
      dp.created_at
    FROM deadline_progress dp
    INNER JOIN deadlines d ON d.id = dp.deadline_id
    WHERE d.format IN ('physical', 'eBook')
      AND dp.ignore_in_calcs = false
      AND (dp.created_at - (p_offset_minutes * interval '1 minute'))::date >=
          (CURRENT_TIMESTAMP - (p_offset_minutes * interval '1 minute'))::date - (p_days - 1)
      AND NOT (d.user_id = ANY(p_exclude_user_ids))
      AND (p_user_ids IS NULL OR d.user_id = ANY(p_user_ids))
  ),
  max_progress_by_date AS (
    -- Get max progress per deadline per day
    SELECT
      pr.deadline_id,
      pr.user_id,
      pr.progress_date,
      MAX(pr.current_progress) AS max_progress
    FROM progress_records pr
    GROUP BY pr.deadline_id, pr.user_id, pr.progress_date
  ),
  progress_with_previous AS (
    -- Use LAG to get the previous day's progress for each deadline
    SELECT
      mpd.deadline_id,
      mpd.user_id,
      mpd.progress_date,
      mpd.max_progress,
      COALESCE(
        LAG(mpd.max_progress) OVER (
          PARTITION BY mpd.deadline_id
          ORDER BY mpd.progress_date
        ),
        0
      ) AS previous_progress
    FROM max_progress_by_date mpd
  ),
  pages_per_user_date AS (
    -- Calculate pages read per user per date
    SELECT
      pwp.user_id,
      pwp.progress_date,
      SUM(GREATEST(pwp.max_progress - pwp.previous_progress, 0)) AS pages_read
    FROM progress_with_previous pwp
    GROUP BY pwp.user_id, pwp.progress_date
  )
  SELECT
    p.id AS user_id,
    p.email::TEXT,
    p.username::TEXT,
    p.first_name::TEXT,
    p.last_name::TEXT,
    ppud.progress_date,
    ppud.pages_read
  FROM pages_per_user_date ppud
  INNER JOIN profiles p ON p.id = ppud.user_id
  ORDER BY ppud.user_id, ppud.progress_date;
END;
$$ LANGUAGE plpgsql;
