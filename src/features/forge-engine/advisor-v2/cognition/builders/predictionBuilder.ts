import type {
  AdvisorResult,
} from "../../advisor.types";

import type {
  PredictionViewModel,
} from "../cognitiveViewModel";

export function buildPredictionViewModel(
  advisor: AdvisorResult,
): PredictionViewModel {
  const predictions =
    advisor.calibration.predictions;

  const resolved =
    predictions.filter(
      (prediction) =>
        prediction.outcome !==
        "unknown",
    );

  const correct =
    resolved.filter(
      (prediction) =>
        prediction.outcome ===
        "correct",
    );

  const incorrect =
    resolved.filter(
      (prediction) =>
        prediction.outcome ===
        "incorrect",
    );

  return {
    predictionCount:
      predictions.length,

    resolvedCount:
      resolved.length,

    unresolvedCount:
      predictions.length -
      resolved.length,

    correctCount:
      correct.length,

    incorrectCount:
      incorrect.length,

    averageConfidence:
      normalizeScore(
        advisor.calibration
          .confidence
          .averageConfidence,
      ),

    averageAccuracy:
      normalizeScore(
        advisor.calibration
          .confidence
          .averageAccuracy,
      ),

    latestPrediction:
      predictions.at(-1) ?? null,
  };
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