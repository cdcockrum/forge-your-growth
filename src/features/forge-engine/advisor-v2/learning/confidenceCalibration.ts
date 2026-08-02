import type {
  ConfidenceCalibration,
} from "./learning.types";

export function calibrateConfidence(
  predicted: number,
  observed: number,
): ConfidenceCalibration {
  const predictedConfidence =
    normalize(predicted);

  const observedConfidence =
    normalize(observed);

  const calibrationError =
    Math.abs(
      predictedConfidence -
      observedConfidence,
    );

  return {
    predictedConfidence,

    observedConfidence,

    calibrationError,
  };
}

export function calibrationScore(
  history: ConfidenceCalibration[],
): number {
  if (history.length === 0) {
    return 1;
  }

  const averageError =
    history.reduce(
      (total, item) =>
        total +
        item.calibrationError,
      0,
    ) / history.length;

  return clamp01(
    1 - averageError,
  );
}

function normalize(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return clamp01(
    normalized,
  );
}

function clamp01(
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