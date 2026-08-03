import type {
  AdvisorResult,
} from "../../advisor.types";

import type {
  CalibrationViewModel,
} from "../cognitiveViewModel";

export function buildCalibrationViewModel(
  advisor: AdvisorResult,
): CalibrationViewModel {
  const {
    confidence,
    reliability,
    recommendation,
    predictions,
  } = advisor.calibration;

  const resolvedPredictions =
    predictions.filter(
      (prediction) =>
        prediction.outcome !==
        "unknown",
    );

  return {
    calibration:
      confidence.calibration,

    averageAccuracy:
      normalizeScore(
        confidence.averageAccuracy,
      ),

    averageConfidence:
      normalizeScore(
        confidence.averageConfidence,
      ),

    confidenceBias:
      calculateConfidenceBias(
        confidence.overconfidenceBias,
        confidence.underconfidenceBias,
      ),

    overconfidenceBias:
      normalizeScore(
        confidence.overconfidenceBias,
      ),

    underconfidenceBias:
      normalizeScore(
        confidence.underconfidenceBias,
      ),

    evidenceReliability:
      reliability.evidenceReliability,

    evidenceCoverage:
      normalizeScore(
        reliability.evidenceCoverage,
      ),

    contradictionRate:
      normalizeScore(
        reliability.contradictionRate,
      ),

    revisionRate:
      normalizeScore(
        reliability.revisionRate,
      ),

    predictionCount:
      predictions.length,

    resolvedPredictionCount:
      resolvedPredictions.length,

    recommendation,
  };
}

function calculateConfidenceBias(
  overconfidenceBias: number,
  underconfidenceBias: number,
): number {
  const overconfidence =
    normalizeScore(
      overconfidenceBias,
    );

  const underconfidence =
    normalizeScore(
      underconfidenceBias,
    );

  return clampDelta(
    overconfidence -
    underconfidence,
  );
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

function clampDelta(
  value: number,
): number {
  return Math.max(
    -1,
    Math.min(
      value,
      1,
    ),
  );
}