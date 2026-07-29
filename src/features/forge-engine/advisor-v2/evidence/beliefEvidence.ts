import type {
  BeliefResult,
  ForgeBelief,
} from "../../beliefs";

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
  belief: ForgeBelief,
): number {
  const evidenceCount =
    belief.supportingEvidence.length +
    belief.contradictingEvidence.length;

  return Math.min(
    1,
    Math.max(
      0.5,
      evidenceCount / 10,
    ),
  );
}

function determinePolarity(
  belief: ForgeBelief,
): AdvisorEvidence["polarity"] {
  if (
    belief.supportingEvidence.length >
    belief.contradictingEvidence.length
  ) {
    return "positive";
  }

  if (
    belief.contradictingEvidence.length >
    belief.supportingEvidence.length
  ) {
    return "negative";
  }

  return "neutral";
}

function buildBeliefEvidenceItem(
  belief: ForgeBelief,
): AdvisorEvidence {
  return {
    id: `belief-${belief.id}`,
    category: "belief",
    source: "belief-engine",
    statement: belief.statement,
    confidence: normalizeConfidence(
      belief.confidence,
    ),
    impact: calculateImpact(
      belief,
    ),
    polarity: determinePolarity(
      belief,
    ),
    tags: [
      "belief",
    ],
  };
}

export function buildBeliefEvidence(
  beliefs: BeliefResult,
): AdvisorEvidence[] {
  return beliefs.beliefs.map(
    buildBeliefEvidenceItem,
  );
}