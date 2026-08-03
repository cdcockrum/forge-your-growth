import type {
  AdvisorResult,
} from "../../advisor.types";

import type {
  SummaryViewModel,
} from "../cognitiveViewModel";

export function buildSummaryViewModel(
  advisor: AdvisorResult,
): SummaryViewModel {
  return {
    overallConfidence:
      normalizeConfidence(
        advisor.confidence.score,
      ),

    evidenceQuality:
      advisor.epistemology
        .evidenceQuality,

    calibration:
      advisor.calibration
        .confidence
        .calibration,

    strongestBelief:
      advisor.cognitiveMemory
        .current
        .strongestBelief
        .statement,
  };
}

function normalizeConfidence(
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