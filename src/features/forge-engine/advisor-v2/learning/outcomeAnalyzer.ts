import type {
  RecommendationHistory,
  RecommendationOutcome,
} from "./learning.types";

export type OutcomeMetrics = {
  followed: boolean;

  momentumBefore: number;
  momentumAfter: number;

  progressBefore: number;
  progressAfter: number;

  confidenceBefore: number;
  confidenceAfter: number;

  identityBefore: number;
  identityAfter: number;
};

export function analyzeRecommendationOutcome(
  recommendationId: string,
  createdAt: string,
  metrics: OutcomeMetrics,
  completedAt?: string,
): RecommendationHistory {
  const momentumChange =
    calculateChange(
      metrics.momentumBefore,
      metrics.momentumAfter,
    );

  const progressChange =
    calculateChange(
      metrics.progressBefore,
      metrics.progressAfter,
    );

  const confidenceChange =
    calculateChange(
      metrics.confidenceBefore,
      metrics.confidenceAfter,
    );

  const identityChange =
    calculateChange(
      metrics.identityBefore,
      metrics.identityAfter,
    );

  const outcome =
    determineOutcome({
      followed:
        metrics.followed,

      momentumChange,
      progressChange,
      confidenceChange,
      identityChange,
    });

  return {
    recommendationId,

    createdAt,

    completedAt,

    followed:
      metrics.followed,

    outcome,

    momentumChange,

    progressChange,

    confidenceChange,

    identityChange,
  };
}

function determineOutcome({
  followed,
  momentumChange,
  progressChange,
  confidenceChange,
  identityChange,
}: {
  followed: boolean;

  momentumChange: number;
  progressChange: number;
  confidenceChange: number;
  identityChange: number;
}): RecommendationOutcome {
  if (!followed) {
    return "neutral";
  }

  const averageChange =
    (
      momentumChange +
      progressChange +
      confidenceChange +
      identityChange
    ) / 4;

  if (averageChange >= 0.05) {
    return "successful";
  }

  if (averageChange <= -0.05) {
    return "unsuccessful";
  }

  return "neutral";
}

function calculateChange(
  before: number,
  after: number,
): number {
  const normalizedBefore =
    normalizeScore(
      before,
    );

  const normalizedAfter =
    normalizeScore(
      after,
    );

  return clampChange(
    normalizedAfter -
      normalizedBefore,
  );
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}

function clampChange(
  value: number,
): number {
  return Math.max(
    -1,
    Math.min(
      value,
      1,
    ),
  );
}