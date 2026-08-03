
import type {
  ConfidenceCalibration,
  ConfidenceMetrics,
  PredictionRecord,
} from "./calibration.types";

export function buildConfidenceMetrics(
  predictions: PredictionRecord[],
): ConfidenceMetrics {
  const resolved =
    predictions.filter(
      (prediction) =>
        prediction.outcome !==
        "unknown",
    );

  if (resolved.length === 0) {
    return {
      averageConfidence: 0,

      averageAccuracy: 0,

      calibration:
        "well-calibrated",

      overconfidenceBias: 0,

      underconfidenceBias: 0,
    };
  }

  const averageConfidence =
    resolved.reduce(
      (sum, prediction) =>
        sum +
        prediction.confidence,
      0,
    ) /
    resolved.length;

  const averageAccuracy =
    resolved.filter(
      (prediction) =>
        prediction.outcome ===
        "correct",
    ).length /
    resolved.length;

  const bias =
    averageConfidence -
    averageAccuracy;

  return {
    averageConfidence,

    averageAccuracy,

    calibration:
      determineCalibration(
        bias,
      ),

    overconfidenceBias:
      Math.max(
        bias,
        0,
      ),

    underconfidenceBias:
      Math.max(
        -bias,
        0,
      ),
  };
}

function determineCalibration(
  bias: number,
): ConfidenceCalibration {
  if (bias > 0.1) {
    return "overconfident";
  }

  if (bias < -0.1) {
    return "underconfident";
  }

  return "well-calibrated";
}