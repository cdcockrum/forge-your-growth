import type {
  ForgePrediction,
  PredictionResult,
} from "../../prediction";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function normalizeConfidence(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return value > 1
    ? Math.min(
        1,
        Math.max(
          0,
          value / 100,
        ),
      )
    : Math.min(
        1,
        Math.max(
          0,
          value,
        ),
      );
}

function calculateImpact(
  prediction: ForgePrediction,
  strongest: boolean,
): number {
  const base = Math.min(
    1,
    Math.max(
      0.5,
      prediction.evidence.length / 10,
    ),
  );

  return strongest
    ? Math.max(base, 0.9)
    : base;
}

function buildPredictionStatement(
  prediction: ForgePrediction,
): string {
  const recommendation =
    prediction.recommendation.trim();

  if (recommendation.length === 0) {
    return prediction.description;
  }

  return `${prediction.description} Recommendation: ${recommendation}`;
}

function buildPredictionTags(
  prediction: ForgePrediction,
  strongest: boolean,
): string[] {
  const tags = [
    "prediction",
    prediction.category,
    prediction.timeframe,
  ];

  if (strongest) {
    tags.push("strongest");
  }

  return tags;
}

export function buildPredictionEvidence(
  predictions: PredictionResult,
): AdvisorEvidence[] {
  const strongestId =
    predictions.strongest?.id ?? null;

  return predictions.predictions.map(
  (prediction: ForgePrediction): AdvisorEvidence => ({
      id: `prediction-${prediction.id}`,
      category: "prediction",
      source: prediction.title,
      statement:
        buildPredictionStatement(
          prediction,
        ),
      confidence:
        normalizeConfidence(
          prediction.confidence,
        ),
      impact:
        calculateImpact(
          prediction,
          prediction.id === strongestId,
        ),
      polarity: "neutral",
      tags:
        buildPredictionTags(
          prediction,
          prediction.id === strongestId,
        ),
    }),
  );
}