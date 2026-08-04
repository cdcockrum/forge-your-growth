import type {
  AdvisorLearningAdjustment,
  AdvisorRecommendationOutcome,
} from "./adaptiveLearning.types";

export type RecommendationEvaluatorOptions = {
  recommendationId: string;

  confidenceBefore: number;

  outcomes:
    AdvisorRecommendationOutcome[];

  evaluatedAt: string;

  minimumEvidenceCount?: number;

  maximumAdjustment?: number;
};

export function evaluateRecommendation(
  options: RecommendationEvaluatorOptions,
): AdvisorLearningAdjustment {
  const matchingOutcomes =
    options.outcomes.filter(
      (outcome) =>
        outcome.recommendationId ===
        options.recommendationId,
    );

  const minimumEvidenceCount =
    Math.max(
      1,
      options.minimumEvidenceCount ??
        1,
    );

  const maximumAdjustment =
    clamp(
      options.maximumAdjustment ??
        0.15,
      0,
      0.5,
    );

  const confidenceBefore =
    normalizeScore(
      options.confidenceBefore,
    );

  if (
    matchingOutcomes.length <
    minimumEvidenceCount
  ) {
    return {
      id:
        createAdjustmentId(
          options.recommendationId,
          options.evaluatedAt,
        ),

      recommendationId:
        options.recommendationId,

      confidenceBefore,

      confidenceAfter:
        confidenceBefore,

      adjustment:
        0,

      explanation:
        buildInsufficientEvidenceExplanation(
          matchingOutcomes.length,
          minimumEvidenceCount,
        ),

      createdAt:
        options.evaluatedAt,
    };
  }

  const weightedScore =
    calculateWeightedOutcomeScore(
      matchingOutcomes,
    );

  const evidenceStrength =
    calculateEvidenceStrength(
      matchingOutcomes,
    );

  const rawAdjustment =
    calculateRawAdjustment(
      weightedScore,
    );

  const scaledAdjustment =
    clamp(
      rawAdjustment *
        evidenceStrength,
      -maximumAdjustment,
      maximumAdjustment,
    );

  const confidenceAfter =
    clamp(
      confidenceBefore +
        scaledAdjustment,
      0,
      1,
    );

  return {
    id:
      createAdjustmentId(
        options.recommendationId,
        options.evaluatedAt,
      ),

    recommendationId:
      options.recommendationId,

    confidenceBefore,

    confidenceAfter,

    adjustment:
      confidenceAfter -
      confidenceBefore,

    explanation:
      buildAdjustmentExplanation({
        outcomeCount:
          matchingOutcomes.length,

        weightedScore,

        evidenceStrength,

        confidenceBefore,

        confidenceAfter,
      }),

    createdAt:
      options.evaluatedAt,
  };
}

function calculateWeightedOutcomeScore(
  outcomes:
    AdvisorRecommendationOutcome[],
): number {
  const weightedTotal =
    outcomes.reduce(
      (total, outcome) => {
        const confidence =
          normalizeScore(
            outcome.recommendationConfidence,
          );

        const signalConfidence =
          averageSignalConfidence(
            outcome,
          );

        const weight =
          Math.max(
            0.1,
            confidence *
              signalConfidence,
          );

        return (
          total +
          normalizeScore(
            outcome.outcomeScore,
          ) *
            weight
        );
      },
      0,
    );

  const totalWeight =
    outcomes.reduce(
      (total, outcome) => {
        const confidence =
          normalizeScore(
            outcome.recommendationConfidence,
          );

        const signalConfidence =
          averageSignalConfidence(
            outcome,
          );

        return (
          total +
          Math.max(
            0.1,
            confidence *
              signalConfidence,
          )
        );
      },
      0,
    );

  if (totalWeight === 0) {
    return 0.5;
  }

  return clamp(
    weightedTotal /
      totalWeight,
    0,
    1,
  );
}

function calculateEvidenceStrength(
  outcomes:
    AdvisorRecommendationOutcome[],
): number {
  const countStrength =
    clamp(
      outcomes.length / 5,
      0,
      1,
    );

  const averageSignalStrength =
    outcomes.reduce(
      (total, outcome) =>
        total +
        averageSignalConfidence(
          outcome,
        ),
      0,
    ) / outcomes.length;

  return clamp(
    countStrength * 0.45 +
      averageSignalStrength *
        0.55,
    0,
    1,
  );
}

function calculateRawAdjustment(
  weightedScore: number,
): number {
  if (
    weightedScore >= 0.8
  ) {
    return 0.15;
  }

  if (
    weightedScore >= 0.65
  ) {
    return 0.08;
  }

  if (
    weightedScore >= 0.45
  ) {
    return 0;
  }

  if (
    weightedScore >= 0.3
  ) {
    return -0.08;
  }

  return -0.15;
}

function averageSignalConfidence(
  outcome:
    AdvisorRecommendationOutcome,
): number {
  if (
    outcome.signals.length ===
    0
  ) {
    return 0.5;
  }

  return clamp(
    outcome.signals.reduce(
      (total, signal) =>
        total +
        normalizeScore(
          signal.confidence,
        ),
      0,
    ) /
      outcome.signals.length,
    0,
    1,
  );
}

function buildAdjustmentExplanation({
  outcomeCount,
  weightedScore,
  evidenceStrength,
  confidenceBefore,
  confidenceAfter,
}: {
  outcomeCount: number;

  weightedScore: number;

  evidenceStrength: number;

  confidenceBefore: number;

  confidenceAfter: number;
}): string {
  const direction =
    confidenceAfter >
    confidenceBefore
      ? "increased"
      : confidenceAfter <
          confidenceBefore
        ? "decreased"
        : "remained unchanged";

  return [
    `${outcomeCount} recommendation outcome${outcomeCount === 1 ? "" : "s"} were evaluated.`,

    `The weighted outcome score was ${formatPercentage(
      weightedScore,
    )}.`,

    `Evidence strength was ${formatPercentage(
      evidenceStrength,
    )}.`,

    `Recommendation confidence ${direction} from ${formatPercentage(
      confidenceBefore,
    )} to ${formatPercentage(
      confidenceAfter,
    )}.`,
  ].join(" ");
}

function buildInsufficientEvidenceExplanation(
  outcomeCount: number,
  minimumEvidenceCount: number,
): string {
  return [
    `Only ${outcomeCount} qualifying outcome${outcomeCount === 1 ? "" : "s"} were available.`,

    `${minimumEvidenceCount} are required before Forge changes recommendation confidence.`,

    "Confidence was left unchanged.",
  ].join(" ");
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return clamp(
    normalized,
    0,
    1,
  );
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.max(
    minimum,
    Math.min(
      value,
      maximum,
    ),
  );
}

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    clamp(
      value,
      0,
      1,
    ) * 100,
  )}%`;
}

function createAdjustmentId(
  recommendationId: string,
  evaluatedAt: string,
): string {
  return [
    "advisor-adjustment",
    recommendationId,
    evaluatedAt,
  ].join(":");
}