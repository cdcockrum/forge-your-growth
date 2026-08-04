import type {
  AdvisorAdaptiveLearning,
  AdvisorLearningAdjustment,
  AdvisorRecommendationOutcome,
} from "./adaptiveLearning.types";

import {
  buildLearningSummary,
} from "./learningSummaryBuilder";

export type AdaptiveLearningBuilderOptions = {
  outcomes:
    AdvisorRecommendationOutcome[];

  adjustments:
    AdvisorLearningAdjustment[];

  generatedAt: string;
};

export function buildAdaptiveLearning(
  options: AdaptiveLearningBuilderOptions,
): AdvisorAdaptiveLearning {
  const outcomes =
    sortOutcomes(
      options.outcomes,
    );

  const adjustments =
    sortAdjustments(
      options.adjustments,
    );

  return {
    outcomes,

    adjustments,

    summary:
      buildLearningSummary({
        outcomes,
        adjustments,
      }),

    generatedAt:
      options.generatedAt,
  };
}

function sortOutcomes(
  outcomes:
    AdvisorRecommendationOutcome[],
): AdvisorRecommendationOutcome[] {
  return [...outcomes].sort(
    (left, right) =>
      outcomeTimestamp(
        right,
      ).localeCompare(
        outcomeTimestamp(
          left,
        ),
      ),
  );
}

function sortAdjustments(
  adjustments:
    AdvisorLearningAdjustment[],
): AdvisorLearningAdjustment[] {
  return [...adjustments].sort(
    (left, right) =>
      right.createdAt.localeCompare(
        left.createdAt,
      ),
  );
}

function outcomeTimestamp(
  outcome:
    AdvisorRecommendationOutcome,
): string {
  return (
    outcome.evaluatedAt ??
    outcome.recommendedAt
  );
}