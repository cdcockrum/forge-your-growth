import type {
  PredictionRecord,
} from "./calibration.types";

export type PredictionInput = {
  id: string;

  title: string;

  description: string;

  confidence: number;
};

export function buildPredictionRecords(
  predictions: PredictionInput[],
  createdAt = new Date().toISOString(),
): PredictionRecord[] {
  return predictions.map(
    (prediction) => ({
      id:
        prediction.id,

      prediction:
        prediction.description,
      title:
        prediction.title,
      confidence:
        normalizeConfidence(
          prediction.confidence,
        ),

      outcome:
        "unknown",

      createdAt,

      resolvedAt:
        null,
    }),
  );
}

export function resolvePrediction(
  prediction: PredictionRecord,
  correct: boolean,
  resolvedAt = new Date().toISOString(),
): PredictionRecord {
  return {
    ...prediction,

    outcome:
      correct
        ? "correct"
        : "incorrect",

    resolvedAt,
  };
}

export function predictionAccuracy(
  predictions: PredictionRecord[],
): number {
  const resolved =
    predictions.filter(
      (prediction) =>
        prediction.outcome !==
        "unknown",
    );

  if (
    resolved.length === 0
  ) {
    return 0;
  }

  const correct =
    resolved.filter(
      (prediction) =>
        prediction.outcome ===
        "correct",
    ).length;

  return (
    correct /
    resolved.length
  );
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}