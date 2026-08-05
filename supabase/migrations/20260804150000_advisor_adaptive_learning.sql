-- Advisor recommendation instances
CREATE TABLE public.advisor_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  recommendation_key TEXT NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,

  confidence DOUBLE PRECISION NOT NULL
    CHECK (
      confidence >= 0
      AND confidence <= 1
    ),

  priority TEXT NOT NULL
    CHECK (
      priority IN (
        'low',
        'medium',
        'high'
      )
    ),

  response TEXT NOT NULL DEFAULT 'unknown'
    CHECK (
      response IN (
        'accepted',
        'partially-followed',
        'ignored',
        'rejected',
        'unknown'
      )
    ),

  lifecycle_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (
      lifecycle_status IN (
        'pending',
        'in-progress',
        'evaluated',
        'dismissed',
        'expired'
      )
    ),

  recommended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  evaluation_due_at TIMESTAMPTZ,
  evaluated_at TIMESTAMPTZ,

  baseline_snapshot_date DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.advisor_recommendations
  TO authenticated;

GRANT ALL
  ON public.advisor_recommendations
  TO service_role;

ALTER TABLE public.advisor_recommendations
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own advisor recommendations"
  ON public.advisor_recommendations
  FOR ALL
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE INDEX advisor_recommendations_user_idx
  ON public.advisor_recommendations(user_id);

CREATE INDEX advisor_recommendations_due_idx
  ON public.advisor_recommendations(
    user_id,
    lifecycle_status,
    evaluation_due_at
  );

CREATE INDEX advisor_recommendations_key_idx
  ON public.advisor_recommendations(
    user_id,
    recommendation_key
  );

-- Prevent the same engine recommendation from
-- creating multiple active lifecycle records.
CREATE UNIQUE INDEX advisor_recommendations_active_idx
  ON public.advisor_recommendations(
    user_id,
    recommendation_key
  )
  WHERE lifecycle_status IN (
    'pending',
    'in-progress'
  );

CREATE TRIGGER set_updated_at_advisor_recommendations
  BEFORE UPDATE
  ON public.advisor_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_set_updated_at();


-- Evaluated recommendation outcomes
CREATE TABLE public.advisor_recommendation_outcomes (
  id TEXT PRIMARY KEY,

  recommendation_instance_id UUID NOT NULL UNIQUE
    REFERENCES public.advisor_recommendations(id)
    ON DELETE CASCADE,

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  recommendation_key TEXT NOT NULL,
  recommendation_title TEXT NOT NULL,

  recommendation_confidence DOUBLE PRECISION NOT NULL
    CHECK (
      recommendation_confidence >= 0
      AND recommendation_confidence <= 1
    ),

  response TEXT NOT NULL
    CHECK (
      response IN (
        'accepted',
        'partially-followed',
        'ignored',
        'rejected',
        'unknown'
      )
    ),

  outcome_status TEXT NOT NULL
    CHECK (
      outcome_status IN (
        'pending',
        'successful',
        'partially-successful',
        'unsuccessful',
        'inconclusive'
      )
    ),

  signals JSONB NOT NULL DEFAULT '[]'::jsonb,

  outcome_score DOUBLE PRECISION NOT NULL
    CHECK (
      outcome_score >= 0
      AND outcome_score <= 1
    ),

  explanation TEXT NOT NULL,

  belief_revision JSONB,

  recommended_at TIMESTAMPTZ NOT NULL,
  evaluated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.advisor_recommendation_outcomes
  TO authenticated;

GRANT ALL
  ON public.advisor_recommendation_outcomes
  TO service_role;

ALTER TABLE public.advisor_recommendation_outcomes
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own advisor outcomes"
  ON public.advisor_recommendation_outcomes
  FOR ALL
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE INDEX advisor_outcomes_user_idx
  ON public.advisor_recommendation_outcomes(user_id);

CREATE INDEX advisor_outcomes_recommendation_idx
  ON public.advisor_recommendation_outcomes(
    user_id,
    recommendation_key
  );

CREATE INDEX advisor_outcomes_evaluated_idx
  ON public.advisor_recommendation_outcomes(
    user_id,
    evaluated_at
  );


-- Confidence adjustments learned from outcomes
CREATE TABLE public.advisor_learning_adjustments (
  id TEXT PRIMARY KEY,

  recommendation_instance_id UUID NOT NULL UNIQUE
    REFERENCES public.advisor_recommendations(id)
    ON DELETE CASCADE,

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  recommendation_key TEXT NOT NULL,

  confidence_before DOUBLE PRECISION NOT NULL
    CHECK (
      confidence_before >= 0
      AND confidence_before <= 1
    ),

  confidence_after DOUBLE PRECISION NOT NULL
    CHECK (
      confidence_after >= 0
      AND confidence_after <= 1
    ),

  adjustment DOUBLE PRECISION NOT NULL
    CHECK (
      adjustment >= -0.5
      AND adjustment <= 0.5
    ),

  explanation TEXT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.advisor_learning_adjustments
  TO authenticated;

GRANT ALL
  ON public.advisor_learning_adjustments
  TO service_role;

ALTER TABLE public.advisor_learning_adjustments
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own advisor adjustments"
  ON public.advisor_learning_adjustments
  FOR ALL
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE INDEX advisor_adjustments_user_idx
  ON public.advisor_learning_adjustments(user_id);

CREATE INDEX advisor_adjustments_recommendation_idx
  ON public.advisor_learning_adjustments(
    user_id,
    recommendation_key
  );