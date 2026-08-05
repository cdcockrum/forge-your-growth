ALTER TABLE public.advisor_recommendations
  ADD COLUMN belief_key TEXT,
  ADD COLUMN belief_statement TEXT,
  ADD COLUMN belief_confidence DOUBLE PRECISION
    CHECK (
      belief_confidence IS NULL
      OR (
        belief_confidence >= 0
        AND belief_confidence <= 1
      )
    );

CREATE INDEX advisor_recommendations_belief_idx
  ON public.advisor_recommendations(
    user_id,
    belief_key
  )
  WHERE belief_key IS NOT NULL;