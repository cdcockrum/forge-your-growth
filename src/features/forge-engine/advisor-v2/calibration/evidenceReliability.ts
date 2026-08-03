
import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  ReliabilityMetrics,
} from "./calibration.types";

export function buildReliabilityMetrics(
  evidence: AdvisorEvidence[],
  revisionRate: number,
): ReliabilityMetrics {
  const evidenceCoverage =
    calculateCoverage(
      evidence,
    );

  const contradictionRate =
    calculateContradictionRate(
      evidence,
    );

  return {
    evidenceReliability:
      determineReliability(
        evidenceCoverage,
        contradictionRate,
        revisionRate,
      ),

    contradictionRate,

    revisionRate,

    evidenceCoverage,
  };
}

function calculateCoverage(
  evidence: AdvisorEvidence[],
): number {
  if (evidence.length === 0) {
    return 0;
  }

  const supported =
    evidence.filter(
      (item) =>
        item.confidence >= 0.6,
    ).length;

  return supported / evidence.length;
}

function calculateContradictionRate(
  evidence: AdvisorEvidence[],
): number {
  if (evidence.length === 0) {
    return 0;
  }

  const contradictory =
    evidence.filter(
        (item) =>
        item.polarity ===
        "negative",
    ).length;

  return contradictory / evidence.length;
}

function determineReliability(
  coverage: number,
  contradictionRate: number,
  revisionRate: number,
): ReliabilityMetrics["evidenceReliability"] {
  const score =
    coverage * 0.5 +
    (1 - contradictionRate) * 0.3 +
    (1 - revisionRate) * 0.2;

  if (score >= 0.8) {
    return "high";
  }

  if (score >= 0.5) {
    return "medium";
  }

  return "low";
}