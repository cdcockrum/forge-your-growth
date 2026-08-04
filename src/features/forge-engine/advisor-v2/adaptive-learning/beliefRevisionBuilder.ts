import type {
  AdvisorLearningAdjustment,
  AdvisorRecommendationOutcome,
} from "./adaptiveLearning.types";

import type {
  CognitiveMemoryStatus,
  CognitiveRevision,
} from "../cognitive-memory";

export type BeliefRevisionBuilderOptions = {
  recommendationId: string;

  previousBelief: string;

  currentBelief: string;

  confidenceBefore: number;

  outcomes:
    AdvisorRecommendationOutcome[];

  adjustment:
    AdvisorLearningAdjustment | null;

  recordedAt: string;
};

export type AdvisorBeliefRevisionResult = {
  status: CognitiveMemoryStatus;

  confidenceAfter: number;

  revision: CognitiveRevision | null;

  explanation: string;
};

export function buildBeliefRevision(
  options: BeliefRevisionBuilderOptions,
): AdvisorBeliefRevisionResult {
  const matchingOutcomes =
    options.outcomes.filter(
      (outcome) =>
        outcome.recommendationId ===
        options.recommendationId,
    );

  const confidenceBefore =
    normalizeScore(
      options.confidenceBefore,
    );

  const confidenceAfter =
    options.adjustment
      ? normalizeScore(
          options.adjustment
            .confidenceAfter,
        )
      : confidenceBefore;

  const status =
    determineMemoryStatus({
      confidenceBefore,
      confidenceAfter,
      matchingOutcomes,
      beliefChanged:
        normalizeText(
          options.previousBelief,
        ) !==
        normalizeText(
          options.currentBelief,
        ),
    });

  const explanation =
    buildRevisionExplanation({
      status,
      confidenceBefore,
      confidenceAfter,
      outcomeCount:
        matchingOutcomes.length,
      beliefChanged:
        normalizeText(
          options.previousBelief,
        ) !==
        normalizeText(
          options.currentBelief,
        ),
    });

  const revision =
    shouldCreateRevision(
      status,
      options.previousBelief,
      options.currentBelief,
    )
      ? {
          id:
            createRevisionId(
              options.recommendationId,
              options.recordedAt,
            ),

          previousBelief:
            options.previousBelief,

          currentBelief:
            options.currentBelief,

          explanation,

          confidenceBefore,

          confidenceAfter,

          recordedAt:
            options.recordedAt,
        }
      : null;

  return {
    status,
    confidenceAfter,
    revision,
    explanation,
  };
}

function determineMemoryStatus({
  confidenceBefore,
  confidenceAfter,
  matchingOutcomes,
  beliefChanged,
}: {
  confidenceBefore: number;

  confidenceAfter: number;

  matchingOutcomes:
    AdvisorRecommendationOutcome[];

  beliefChanged: boolean;
}): CognitiveMemoryStatus {
  if (beliefChanged) {
    return "revised";
  }

  if (
    matchingOutcomes.length === 0
  ) {
    return "active";
  }

  const averageOutcomeScore =
    matchingOutcomes.reduce(
      (total, outcome) =>
        total +
        normalizeScore(
          outcome.outcomeScore,
        ),
      0,
    ) /
    matchingOutcomes.length;

  if (
    confidenceAfter <= 0.15 &&
    averageOutcomeScore < 0.25
  ) {
    return "rejected";
  }

  if (
    confidenceAfter >
    confidenceBefore + 0.01
  ) {
    return "strengthened";
  }

  if (
    confidenceAfter <
    confidenceBefore - 0.01
  ) {
    return "weakened";
  }

  return "active";
}

function shouldCreateRevision(
  status: CognitiveMemoryStatus,
  previousBelief: string,
  currentBelief: string,
): boolean {
  if (
    normalizeText(previousBelief) !==
    normalizeText(currentBelief)
  ) {
    return true;
  }

  return (
    status === "strengthened" ||
    status === "weakened" ||
    status === "rejected"
  );
}

function buildRevisionExplanation({
  status,
  confidenceBefore,
  confidenceAfter,
  outcomeCount,
  beliefChanged,
}: {
  status: CognitiveMemoryStatus;

  confidenceBefore: number;

  confidenceAfter: number;

  outcomeCount: number;

  beliefChanged: boolean;
}): string {
  const confidenceDirection =
    confidenceAfter >
    confidenceBefore
      ? "increased"
      : confidenceAfter <
          confidenceBefore
        ? "decreased"
        : "remained unchanged";

  return [
    beliefChanged
      ? "The belief statement changed after evaluating new evidence."
      : `The belief was ${status}.`,

    `${outcomeCount} related outcome${outcomeCount === 1 ? "" : "s"} were evaluated.`,

    `Confidence ${confidenceDirection} from ${formatPercentage(
      confidenceBefore,
    )} to ${formatPercentage(
      confidenceAfter,
    )}.`,
  ].join(" ");
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

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    clampScore(value) * 100,
  )}%`;
}

function createRevisionId(
  recommendationId: string,
  recordedAt: string,
): string {
  return [
    "cognitive-revision",
    recommendationId,
    recordedAt,
  ].join(":");
}