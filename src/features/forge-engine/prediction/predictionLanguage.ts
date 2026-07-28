import type {
  ForgePrediction,
} from "./prediction.types";

export function buildPredictionSummary(
  prediction: ForgePrediction,
): string {
  return `${prediction.title} ${prediction.description}`;
}

export function buildPredictionEvidenceLabel(
  prediction: ForgePrediction,
): string {
  const count =
    prediction.evidence.length;

  return `${count} ${
    count === 1
      ? "supporting signal"
      : "supporting signals"
  }`;
}