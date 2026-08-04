import type {
  AdvisorLearningAdjustment,
  AdvisorLearningSummary,
  AdvisorRecommendationOutcome,
} from "./adaptiveLearning.types";

export type LearningSummaryBuilderOptions = {
  outcomes:
    AdvisorRecommendationOutcome[];

  adjustments:
    AdvisorLearningAdjustment[];
};

export function buildLearningSummary(
  options: LearningSummaryBuilderOptions,
): AdvisorLearningSummary {
  const evaluatedOutcomes =
    options.outcomes.filter(
      (outcome) =>
        outcome.evaluatedAt !== null &&
        outcome.status !== "pending",
    );

  const successfulCount =
    countOutcomesByStatus(
      evaluatedOutcomes,
      "successful",
    );

  const partiallySuccessfulCount =
    countOutcomesByStatus(
      evaluatedOutcomes,
      "partially-successful",
    );

  const unsuccessfulCount =
    countOutcomesByStatus(
      evaluatedOutcomes,
      "unsuccessful",
    );

  const inconclusiveCount =
    countOutcomesByStatus(
      evaluatedOutcomes,
      "inconclusive",
    );

  const acceptedCount =
    evaluatedOutcomes.filter(
      (outcome) =>
        outcome.response === "accepted" ||
        outcome.response === "partially-followed",
    ).length;

  return {
    recommendationCount:
      uniqueRecommendationCount(
        options.outcomes,
      ),

    evaluatedCount:
      evaluatedOutcomes.length,

    successfulCount,

    partiallySuccessfulCount,

    unsuccessfulCount,

    inconclusiveCount,

    acceptanceRate:
      calculateRate(
        acceptedCount,
        evaluatedOutcomes.length,
      ),

    successRate:
      calculateRate(
        successfulCount +
          partiallySuccessfulCount *
            0.5,
        evaluatedOutcomes.length,
      ),

    averageOutcomeScore:
      averageOutcomeScore(
        evaluatedOutcomes,
      ),

    averageConfidenceAdjustment:
      averageConfidenceAdjustment(
        options.adjustments,
      ),
  };
}

function countOutcomesByStatus(
  outcomes:
    AdvisorRecommendationOutcome[],
  status:
    AdvisorRecommendationOutcome["status"],
): number {
  return outcomes.filter(
    (outcome) =>
      outcome.status === status,
  ).length;
}

function uniqueRecommendationCount(
  outcomes:
    AdvisorRecommendationOutcome[],
): number {
  return new Set(
    outcomes.map(
      (outcome) =>
        outcome.recommendationId,
    ),
  ).size;
}

function calculateRate(
  numerator: number,
  denominator: number,
): number {
  if (denominator <= 0) {
    return 0;
  }

  return clampScore(
    numerator /
      denominator,
  );
}

function averageOutcomeScore(
  outcomes:
    AdvisorRecommendationOutcome[],
): number {
  if (outcomes.length === 0) {
    return 0;
  }

  return clampScore(
    outcomes.reduce(
      (total, outcome) =>
        total +
        normalizeScore(
          outcome.outcomeScore,
        ),
      0,
    ) /
      outcomes.length,
  );
}

function averageConfidenceAdjustment(
  adjustments:
    AdvisorLearningAdjustment[],
): number {
  if (adjustments.length === 0) {
    return 0;
  }

  return adjustments.reduce(
    (total, adjustment) =>
      total +
      adjustment.adjustment,
    0,
  ) /
    adjustments.length;
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return clampScore(
    normalized,
  );
}

function clampScore(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      value,
      1,
    ),
  );
}