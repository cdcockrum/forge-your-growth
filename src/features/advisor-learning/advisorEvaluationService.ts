import type {
  Json,
  Database,
} from "@/integrations/supabase/types";

import {
  supabase,
} from "@/integrations/supabase/client";

import {
  buildAdaptiveLearning,
  buildAdaptiveLearningPipeline,
} from "@/features/forge-engine/advisor-v2/adaptive-learning";

import type {
  AdvisorAdaptiveLearning,
  AdvisorLearningAdjustment,
  AdvisorLearningSignal,
  AdvisorOutcomeStatus,
  AdvisorRecommendationOutcome,
  AdvisorRecommendationResponse,
} from "@/features/forge-engine/advisor-v2/adaptive-learning";

type AdvisorRecommendationRow =
  Database["public"]["Tables"]["advisor_recommendations"]["Row"];

type AdvisorOutcomeRow =
  Database["public"]["Tables"]["advisor_recommendation_outcomes"]["Row"];

type AdvisorAdjustmentRow =
  Database["public"]["Tables"]["advisor_learning_adjustments"]["Row"];

type ForgeSnapshotRow =
  Database["public"]["Tables"]["forge_snapshots"]["Row"];

type EvaluatableForgeSnapshot =
  ForgeSnapshotRow & {
    momentum_score: number;

    completion_rate: number;
  };

export type CurrentAdvisorBelief = {
  key: string;

  statement: string;

  confidence: number;
};

export type EvaluateDueAdvisorRecommendationsInput = {
  currentBeliefs:
    CurrentAdvisorBelief[];

  evaluatedAt?: string;
};

export type EvaluateDueAdvisorRecommendationsResult = {
  dueCount: number;

  evaluatedCount: number;

  skippedCount: number;
};

export async function getPersistedAdvisorAdaptiveLearning(): Promise<
  AdvisorAdaptiveLearning
> {
  const userId =
    await requireUserId();

  const [
    outcomes,
    adjustments,
  ] = await Promise.all([
    getPreviousOutcomes(
      userId,
    ),

    getPreviousAdjustments(
      userId,
    ),
  ]);

  return buildAdaptiveLearning({
    outcomes,
    adjustments,
    generatedAt:
      new Date()
        .toISOString(),
  });
}

export async function evaluateDueAdvisorRecommendations({
  currentBeliefs,
  evaluatedAt =
    new Date().toISOString(),
}: EvaluateDueAdvisorRecommendationsInput): Promise<
  EvaluateDueAdvisorRecommendationsResult
> {
  const userId =
    await requireUserId();

  const dueRecommendations =
    await getDueRecommendations(
      userId,
      evaluatedAt,
    );

  if (
    dueRecommendations.length === 0
  ) {
    return {
      dueCount: 0,
      evaluatedCount: 0,
      skippedCount: 0,
    };
  }

  const [
    previousOutcomes,
    previousAdjustments,
  ] = await Promise.all([
    getPreviousOutcomes(userId),
    getPreviousAdjustments(userId),
  ]);

  let evaluatedCount = 0;
  let skippedCount = 0;

  for (
    const recommendation
    of dueRecommendations
  ) {
    const evaluated =
      await evaluateRecommendationInstance({
        userId,
        recommendation,
        currentBeliefs,
        previousOutcomes,
        previousAdjustments,
        evaluatedAt,
      });

    if (evaluated) {
      evaluatedCount += 1;
    } else {
      skippedCount += 1;
    }
  }

  return {
    dueCount:
      dueRecommendations.length,

    evaluatedCount,

    skippedCount,
  };
}

async function evaluateRecommendationInstance({
  userId,
  recommendation,
  currentBeliefs,
  previousOutcomes,
  previousAdjustments,
  evaluatedAt,
}: {
  userId: string;

  recommendation:
    AdvisorRecommendationRow;

  currentBeliefs:
    CurrentAdvisorBelief[];

  previousOutcomes:
    AdvisorRecommendationOutcome[];

  previousAdjustments:
    AdvisorLearningAdjustment[];

  evaluatedAt: string;
}): Promise<boolean> {
  const baselineDate =
    recommendation
      .baseline_snapshot_date;

  if (!baselineDate) {
    return false;
  }

  const evaluationDate =
    isoDate(
      recommendation
        .evaluation_due_at ??
      evaluatedAt,
    );

  const [
    baselineSnapshot,
    latestSnapshot,
    practiceCounts,
    achievementUnlocked,
  ] = await Promise.all([
    getBaselineSnapshot(
      userId,
      baselineDate,
      evaluationDate,
    ),

    getLatestSnapshot(
      userId,
      baselineDate,
      evaluationDate,
    ),

    getPracticeCounts(
      userId,
      baselineDate,
      evaluationDate,
    ),

    getAchievementUnlocked(
      userId,
      recommendation
        .recommended_at,
      recommendation
        .evaluation_due_at ??
        evaluatedAt,
    ),
  ]);

  if (
  !baselineSnapshot ||
  !latestSnapshot ||
  !hasEvaluationScores(
    baselineSnapshot,
  ) ||
  !hasEvaluationScores(
    latestSnapshot,
  )
) {
  return false;
}

  const stableEvaluatedAt =
    recommendation
      .evaluation_due_at ??
    evaluatedAt;

  const previousBelief =
    recommendation
      .belief_statement
      ?.trim() ||
    "Forge did not capture a belief baseline for this recommendation.";

  const currentBelief =
    findCurrentBelief(
      recommendation
        .belief_key,
      currentBeliefs,
    )?.statement ??
    previousBelief;

  const beliefConfidence =
    recommendation
      .belief_confidence ??
    recommendation.confidence;

  const result =
    buildAdaptiveLearningPipeline({
      outcome: {
        recommendationId:
          recommendation
            .recommendation_key,

        recommendationTitle:
          recommendation.title,

        recommendationConfidence:
          recommendation
            .confidence,

        recommendationAccepted:
          recommendation.response ===
          "accepted",

        completedPracticeCount:
          practiceCounts.completed,

        plannedPracticeCount:
          practiceCounts.planned,

        momentumBefore:
          baselineSnapshot
            .momentum_score,

        momentumAfter:
          latestSnapshot
            .momentum_score,

        progressBefore:
          baselineSnapshot
            .completion_rate,

        progressAfter:
          latestSnapshot
            .completion_rate,

        reflectionQuality:
          calculateReflectionQuality(
            latestSnapshot,
          ),

        achievementUnlocked,

        recommendedAt:
          recommendation
            .recommended_at,

        evaluatedAt:
          stableEvaluatedAt,
      },

      previousOutcomes,

      previousAdjustments,

      recommendationEvaluation: {
        recommendationId:
          recommendation
            .recommendation_key,

        confidenceBefore:
          recommendation
            .confidence,

        evaluatedAt:
          stableEvaluatedAt,

        minimumEvidenceCount:
          1,

        maximumAdjustment:
          0.15,
      },

      beliefRevision: {
        recommendationId:
          recommendation
            .recommendation_key,

        previousBelief,

        currentBelief,

        confidenceBefore:
          beliefConfidence,

        recordedAt:
          stableEvaluatedAt,
      },

      generatedAt:
        stableEvaluatedAt,
    });

  await persistEvaluation({
    userId,
    recommendation,
    outcome:
      result.outcome,
    adjustment:
      result.adjustment,
    beliefRevision:
      result.beliefRevision,
  });

  return true;
}

async function getDueRecommendations(
  userId: string,
  evaluatedAt: string,
): Promise<
  AdvisorRecommendationRow[]
> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .eq(
      "lifecycle_status",
      "in-progress",
    )
    .not(
      "evaluation_due_at",
      "is",
      null,
    )
    .lte(
      "evaluation_due_at",
      evaluatedAt,
    )
    .order(
      "evaluation_due_at",
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      `Unable to load due Advisor recommendations: ${error.message}`,
    );
  }

  return data ?? [];
}

async function getBaselineSnapshot(
  userId: string,
  baselineDate: string,
  evaluationDate: string,
): Promise<
  ForgeSnapshotRow | null
> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "forge_snapshots",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .gte(
      "snapshot_date",
      baselineDate,
    )
    .lte(
      "snapshot_date",
      evaluationDate,
    )
    .order(
      "snapshot_date",
      {
        ascending: true,
      },
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load the recommendation baseline snapshot: ${error.message}`,
    );
  }

  return data;
}

async function getLatestSnapshot(
  userId: string,
  baselineDate: string,
  evaluationDate: string,
): Promise<
  ForgeSnapshotRow | null
> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "forge_snapshots",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .gte(
      "snapshot_date",
      baselineDate,
    )
    .lte(
      "snapshot_date",
      evaluationDate,
    )
    .order(
      "snapshot_date",
      {
        ascending: false,
      },
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load the latest evaluation snapshot: ${error.message}`,
    );
  }

  return data;
}

async function getPracticeCounts(
  userId: string,
  startDate: string,
  endDate: string,
): Promise<{
  planned: number;

  completed: number;
}> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "practice_sessions",
    )
    .select(
      "id, completed",
    )
    .eq(
      "user_id",
      userId,
    )
    .gte(
      "scheduled_date",
      startDate,
    )
    .lte(
      "scheduled_date",
      endDate,
    );

  if (error) {
    throw new Error(
      `Unable to load practices for recommendation evaluation: ${error.message}`,
    );
  }

  const sessions =
    data ?? [];

  return {
    planned:
      sessions.length,

    completed:
      sessions.filter(
        (session) =>
          session.completed,
      ).length,
  };
}

async function getAchievementUnlocked(
  userId: string,
  startAt: string,
  endAt: string,
): Promise<boolean> {
  const {
    count,
    error,
  } = await supabase
    .from(
      "achievements",
    )
    .select(
      "id",
      {
        count: "exact",
        head: true,
      },
    )
    .eq(
      "user_id",
      userId,
    )
    .gte(
      "earned_at",
      startAt,
    )
    .lte(
      "earned_at",
      endAt,
    );

  if (error) {
    throw new Error(
      `Unable to load achievements for recommendation evaluation: ${error.message}`,
    );
  }

  return (
    count ?? 0
  ) > 0;
}

async function getPreviousOutcomes(
  userId: string,
): Promise<
  AdvisorRecommendationOutcome[]
> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendation_outcomes",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .order(
      "evaluated_at",
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      `Unable to load previous Advisor outcomes: ${error.message}`,
    );
  }

  return (
    data ?? []
  ).map(
    mapOutcomeRow,
  );
}

async function getPreviousAdjustments(
  userId: string,
): Promise<
  AdvisorLearningAdjustment[]
> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_learning_adjustments",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .order(
      "created_at",
      {
        ascending: true,
      },
    );

  if (error) {
    throw new Error(
      `Unable to load previous Advisor adjustments: ${error.message}`,
    );
  }

  return (
    data ?? []
  ).map(
    mapAdjustmentRow,
  );
}

async function persistEvaluation({
  userId,
  recommendation,
  outcome,
  adjustment,
  beliefRevision,
}: {
  userId: string;

  recommendation:
    AdvisorRecommendationRow;

  outcome:
    AdvisorRecommendationOutcome;

  adjustment:
    AdvisorLearningAdjustment;

  beliefRevision: unknown;
}): Promise<void> {
  const {
    error: outcomeError,
  } = await supabase
    .from(
      "advisor_recommendation_outcomes",
    )
    .upsert(
      {
        id:
          outcome.id,

        recommendation_instance_id:
          recommendation.id,

        user_id:
          userId,

        recommendation_key:
          outcome
            .recommendationId,

        recommendation_title:
          outcome
            .recommendationTitle,

        recommendation_confidence:
          outcome
            .recommendationConfidence,

        response:
          outcome.response,

        outcome_status:
          outcome.status,

        signals:
          toJson(
            outcome.signals,
          ),

        outcome_score:
          outcome.outcomeScore,

        explanation:
          outcome.explanation,

        belief_revision:
          toJson(
            beliefRevision,
          ),

        recommended_at:
          outcome.recommendedAt,

        evaluated_at:
          outcome.evaluatedAt,
      },
      {
        onConflict:
          "recommendation_instance_id",
      },
    );

  if (outcomeError) {
    throw new Error(
      `Unable to save the Advisor outcome: ${outcomeError.message}`,
    );
  }

  const {
    error: adjustmentError,
  } = await supabase
    .from(
      "advisor_learning_adjustments",
    )
    .upsert(
      {
        id:
          adjustment.id,

        recommendation_instance_id:
          recommendation.id,

        user_id:
          userId,

        recommendation_key:
          adjustment
            .recommendationId,

        confidence_before:
          adjustment
            .confidenceBefore,

        confidence_after:
          adjustment
            .confidenceAfter,

        adjustment:
          adjustment.adjustment,

        explanation:
          adjustment.explanation,

        created_at:
          adjustment.createdAt,
      },
      {
        onConflict:
          "recommendation_instance_id",
      },
    );

  if (adjustmentError) {
    throw new Error(
      `Unable to save the Advisor confidence adjustment: ${adjustmentError.message}`,
    );
  }

  const {
    error: recommendationError,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .update({
      lifecycle_status:
        "evaluated",

      response:
        outcome.response,

      evaluated_at:
        outcome.evaluatedAt,
    })
    .eq(
      "id",
      recommendation.id,
    )
    .eq(
      "user_id",
      userId,
    );

  if (recommendationError) {
    throw new Error(
      `Unable to finish the Advisor evaluation: ${recommendationError.message}`,
    );
  }
}

function mapOutcomeRow(
  row: AdvisorOutcomeRow,
): AdvisorRecommendationOutcome {
  return {
    id:
      row.id,

    recommendationId:
      row.recommendation_key,

    recommendationTitle:
      row.recommendation_title,

    recommendationConfidence:
      row.recommendation_confidence,

    response:
      row.response as
        AdvisorRecommendationResponse,

    status:
      row.outcome_status as
        AdvisorOutcomeStatus,

    signals:
      parseSignals(
        row.signals,
      ),

    outcomeScore:
      row.outcome_score,

    explanation:
      row.explanation,

    recommendedAt:
      row.recommended_at,

    evaluatedAt:
      row.evaluated_at,
  };
}

function mapAdjustmentRow(
  row: AdvisorAdjustmentRow,
): AdvisorLearningAdjustment {
  return {
    id:
      row.id,

    recommendationId:
      row.recommendation_key,

    confidenceBefore:
      row.confidence_before,

    confidenceAfter:
      row.confidence_after,

    adjustment:
      row.adjustment,

    explanation:
      row.explanation,

    createdAt:
      row.created_at,
  };
}

function parseSignals(
  value: Json,
): AdvisorLearningSignal[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value as unknown as
    AdvisorLearningSignal[];
}

function calculateReflectionQuality(
  snapshot:
    ForgeSnapshotRow,
): number {
  const values = [
    snapshot.energy,
    snapshot.focus,
    snapshot.stress,
  ];

  const availableCount =
    values.filter(
      (value) =>
        value !== null,
    ).length;

  return (
    availableCount /
    values.length
  );
}

function findCurrentBelief(
  beliefKey: string | null,
  beliefs:
    CurrentAdvisorBelief[],
): CurrentAdvisorBelief | null {
  if (!beliefKey) {
    return null;
  }

  return (
    beliefs.find(
      (belief) =>
        belief.key ===
        beliefKey,
    ) ??
    null
  );
}

function isoDate(
  value: string,
): string {
  return value.slice(
    0,
    10,
  );
}

function toJson(
  value: unknown,
): Json {
  return JSON.parse(
    JSON.stringify(value),
  ) as Json;
}

async function requireUserId(): Promise<
  string
> {
  const {
    data,
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `Unable to verify the current user: ${error.message}`,
    );
  }

  if (!data.user) {
    throw new Error(
      "You must be signed in to evaluate Advisor recommendations.",
    );
  }

  return data.user.id;
}

function hasEvaluationScores(
  snapshot:
    ForgeSnapshotRow,
): snapshot is
  EvaluatableForgeSnapshot {
  return (
    typeof snapshot
      .momentum_score ===
      "number" &&
    Number.isFinite(
      snapshot
        .momentum_score,
    ) &&
    typeof snapshot
      .completion_rate ===
      "number" &&
    Number.isFinite(
      snapshot
        .completion_rate,
    )
  );
}