import type {
  ConfidenceBreakdown,
  ConfidenceLevel,
  ConfidenceReason,
  ConfidenceResult,
} from "./confidence.types";

import type {
  EvidenceGraph,
  EvidenceWeight,
  ReasoningAnalysis,
  ReasoningResult,
} from "../reasoning/reasoning.types";

const SCORE_MIN = 0;
const SCORE_MAX = 100;

const FACTOR_WEIGHTS = {
  evidenceStrength: 0.35,
  evidenceBreadth: 0.2,
  agreement: 0.2,
  contradictionResistance: 0.15,
  recency: 0.1,
} as const;

type UnknownRecord = Record<string, unknown>;

type RecencyCalculation = {
  score: number;
  datedEvidenceCount: number;
  totalEvidenceCount: number;
};

export function calculateConfidence(
  reasoning: ReasoningResult,
  now: Date = new Date(),
): ConfidenceResult {
  const evidenceStrength = calculateEvidenceStrength(
    reasoning.weights,
  );

  const evidenceBreadth = calculateEvidenceBreadth(
    reasoning.graph,
  );

  const agreement = calculateAgreement(
    reasoning.analysis,
    reasoning.graph,
  );

  const contradictionPenalty =
    calculateContradictionPenalty(
      reasoning.analysis,
      reasoning.graph,
    );

  const recencyResult = calculateRecency(
    reasoning.graph,
    now,
  );

  const breakdown: ConfidenceBreakdown = {
    evidenceStrength,
    evidenceBreadth,
    agreement,
    contradictionPenalty,
    recency: recencyResult.score,
  };

  const score = calculateOverallScore(
    breakdown,
  );

  return {
    score,
    level: getConfidenceLevel(score),
    reasons: buildConfidenceReasons(
      breakdown,
      recencyResult,
    ),
    breakdown,
  };
}

function calculateEvidenceStrength(
  weights: EvidenceWeight[],
): number {
  if (weights.length === 0) {
    return 0;
  }

  const total = weights.reduce(
    (sum, weight) =>
      sum + normalizeScore(weight.adjustedScore),
    0,
  );

  return roundScore(total / weights.length);
}

function calculateEvidenceBreadth(
  graph: EvidenceGraph,
): number {
  if (graph.nodes.length === 0) {
    return 0;
  }

  const dimensions = new Set<string>();

  for (const node of graph.nodes) {
    const evidence = toRecord(node.evidence);

    addStringDimension(
      dimensions,
      "category",
      evidence.category,
    );

    addStringDimension(
      dimensions,
      "source",
      evidence.source,
    );

    const metadata = toRecord(evidence.metadata);

    addStringDimension(
      dimensions,
      "metadata-category",
      metadata.category,
    );

    addStringDimension(
      dimensions,
      "metadata-source",
      metadata.source,
    );
  }

  /*
   * Five distinct evidence dimensions are enough
   * to receive the maximum breadth score in v1.
   */
  const diversityScore = Math.min(
    dimensions.size / 5,
    1,
  );

  /*
   * More evidence also improves breadth, but
   * volume alone cannot produce a perfect score.
   */
  const volumeScore = Math.min(
    graph.nodes.length / 8,
    1,
  );

  return roundScore(
    (
      diversityScore * 0.7 +
      volumeScore * 0.3
    ) * 100,
  );
}

function calculateAgreement(
  analysis: ReasoningAnalysis,
  graph: EvidenceGraph,
): number {
  if (
    graph.nodes.length === 0 ||
    analysis.agreements.length === 0
  ) {
    return 0;
  }

  const averageStrength =
    analysis.agreements.reduce(
      (sum, item) =>
        sum + normalizeRatio(item.strength),
      0,
    ) / analysis.agreements.length;

  const agreeingEvidenceIds = new Set(
    analysis.agreements.flatMap(
      (item) => item.evidenceIds,
    ),
  );

  const coverage = Math.min(
    agreeingEvidenceIds.size /
      graph.nodes.length,
    1,
  );

  return roundScore(
    (
      averageStrength * 0.65 +
      coverage * 0.35
    ) * 100,
  );
}

function calculateContradictionPenalty(
  analysis: ReasoningAnalysis,
  graph: EvidenceGraph,
): number {
  if (
    graph.nodes.length === 0 ||
    analysis.contradictions.length === 0
  ) {
    return 0;
  }

  const averageSeverity =
    analysis.contradictions.reduce(
      (sum, item) =>
        sum + normalizeRatio(item.severity),
      0,
    ) / analysis.contradictions.length;

  const contradictedEvidenceIds = new Set(
    analysis.contradictions.flatMap(
      (item) => item.evidenceIds,
    ),
  );

  const coverage = Math.min(
    contradictedEvidenceIds.size /
      graph.nodes.length,
    1,
  );

  return roundScore(
    (
      averageSeverity * 0.7 +
      coverage * 0.3
    ) * 100,
  );
}

function calculateRecency(
  graph: EvidenceGraph,
  now: Date,
): RecencyCalculation {
  if (graph.nodes.length === 0) {
    return {
      score: 0,
      datedEvidenceCount: 0,
      totalEvidenceCount: 0,
    };
  }

  const recencyScores: number[] = [];

  for (const node of graph.nodes) {
    const timestamp = extractTimestamp(
      node.evidence,
    );

    if (!timestamp) {
      continue;
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const ageInDays = Math.max(
      0,
      (
        now.getTime() -
        date.getTime()
      ) /
        86_400_000,
    );

    recencyScores.push(
      scoreAgeInDays(ageInDays),
    );
  }

  /*
   * Missing timestamps should create uncertainty,
   * but should not make all otherwise-valid
   * reasoning worthless. A neutral score is used
   * when no dates can be found.
   */
  if (recencyScores.length === 0) {
    return {
      score: 50,
      datedEvidenceCount: 0,
      totalEvidenceCount: graph.nodes.length,
    };
  }

  const average =
    recencyScores.reduce(
      (sum, score) => sum + score,
      0,
    ) / recencyScores.length;

  const timestampCoverage =
    recencyScores.length /
    graph.nodes.length;

  const score =
    average * 0.8 +
    timestampCoverage * 100 * 0.2;

  return {
    score: roundScore(score),
    datedEvidenceCount:
      recencyScores.length,
    totalEvidenceCount:
      graph.nodes.length,
  };
}

function calculateOverallScore(
  breakdown: ConfidenceBreakdown,
): number {
  const contradictionResistance =
    100 -
    breakdown.contradictionPenalty;

  const score =
    breakdown.evidenceStrength *
      FACTOR_WEIGHTS.evidenceStrength +
    breakdown.evidenceBreadth *
      FACTOR_WEIGHTS.evidenceBreadth +
    breakdown.agreement *
      FACTOR_WEIGHTS.agreement +
    contradictionResistance *
      FACTOR_WEIGHTS.contradictionResistance +
    breakdown.recency *
      FACTOR_WEIGHTS.recency;

  return roundScore(score);
}

function getConfidenceLevel(
  score: number,
): ConfidenceLevel {
  if (score >= 90) {
    return "very-high";
  }

  if (score >= 75) {
    return "high";
  }

  if (score >= 60) {
    return "moderate";
  }

  if (score >= 40) {
    return "low";
  }

  return "very-low";
}

function buildConfidenceReasons(
  breakdown: ConfidenceBreakdown,
  recency: RecencyCalculation,
): ConfidenceReason[] {
  const contradictionImpact = roundImpact(
    -breakdown.contradictionPenalty *
      FACTOR_WEIGHTS.contradictionResistance,
  );

  return [
    {
      factor: "evidence-strength",
      impact: roundImpact(
        breakdown.evidenceStrength *
          FACTOR_WEIGHTS.evidenceStrength,
      ),
      message: getStrengthMessage(
        breakdown.evidenceStrength,
      ),
    },
    {
      factor: "evidence-breadth",
      impact: roundImpact(
        breakdown.evidenceBreadth *
          FACTOR_WEIGHTS.evidenceBreadth,
      ),
      message: getBreadthMessage(
        breakdown.evidenceBreadth,
      ),
    },
    {
      factor: "agreement",
      impact: roundImpact(
        breakdown.agreement *
          FACTOR_WEIGHTS.agreement,
      ),
      message: getAgreementMessage(
        breakdown.agreement,
      ),
    },
    {
      factor: "contradictions",
      impact: contradictionImpact,
      message: getContradictionMessage(
        breakdown.contradictionPenalty,
      ),
    },
    {
      factor: "recency",
      impact: roundImpact(
        breakdown.recency *
          FACTOR_WEIGHTS.recency,
      ),
      message: getRecencyMessage(recency),
    },
  ];
}

function getStrengthMessage(
  score: number,
): string {
  if (score >= 75) {
    return "The supporting evidence is strong.";
  }

  if (score >= 50) {
    return "The supporting evidence has moderate strength.";
  }

  return "The supporting evidence is currently limited or weak.";
}

function getBreadthMessage(
  score: number,
): string {
  if (score >= 75) {
    return "The conclusion draws from a broad range of evidence.";
  }

  if (score >= 50) {
    return "The conclusion draws from several evidence signals.";
  }

  return "The conclusion relies on a narrow evidence base.";
}

function getAgreementMessage(
  score: number,
): string {
  if (score >= 75) {
    return "Multiple pieces of evidence strongly reinforce one another.";
  }

  if (score >= 50) {
    return "Some evidence signals reinforce one another.";
  }

  return "There is little corroborating evidence for this conclusion.";
}

function getContradictionMessage(
  penalty: number,
): string {
  if (penalty >= 60) {
    return "Significant contradictions reduce confidence in this conclusion.";
  }

  if (penalty >= 30) {
    return "Some contradictory evidence reduces certainty.";
  }

  return "Few or no meaningful contradictions were detected.";
}

function getRecencyMessage(
  result: RecencyCalculation,
): string {
  if (result.datedEvidenceCount === 0) {
    return "Evidence dates were unavailable, so recency remains uncertain.";
  }

  if (result.score >= 75) {
    return "The available evidence is recent.";
  }

  if (result.score >= 50) {
    return "The evidence includes both recent and older observations.";
  }

  return "Much of the available evidence is older.";
}

function extractTimestamp(
  value: unknown,
): string | null {
  const record = toRecord(value);
  const metadata = toRecord(record.metadata);

  const candidates = [
    record.occurredAt,
    record.occurred_at,
    record.createdAt,
    record.created_at,
    record.updatedAt,
    record.updated_at,
    record.timestamp,
    record.date,
    metadata.occurredAt,
    metadata.occurred_at,
    metadata.createdAt,
    metadata.created_at,
    metadata.timestamp,
    metadata.date,
  ];

  for (const candidate of candidates) {
    if (
      typeof candidate === "string" &&
      candidate.trim().length > 0
    ) {
      return candidate;
    }
  }

  return null;
}

function scoreAgeInDays(
  ageInDays: number,
): number {
  if (ageInDays <= 7) {
    return 100;
  }

  if (ageInDays <= 30) {
    return 85;
  }

  if (ageInDays <= 90) {
    return 70;
  }

  if (ageInDays <= 180) {
    return 55;
  }

  if (ageInDays <= 365) {
    return 40;
  }

  return 20;
}

function addStringDimension(
  dimensions: Set<string>,
  prefix: string,
  value: unknown,
): void {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return;
  }

  dimensions.add(
    `${prefix}:${value.trim().toLowerCase()}`,
  );
}

function normalizeScore(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  /*
   * Supports either a 0–1 or 0–100 scoring
   * convention while the architecture settles.
   */
  if (value >= 0 && value <= 1) {
    return value * 100;
  }

  return clamp(value, SCORE_MIN, SCORE_MAX);
}

function normalizeRatio(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value >= 0 && value <= 1) {
    return value;
  }

  return clamp(
    value / 100,
    0,
    1,
  );
}

function toRecord(
  value: unknown,
): UnknownRecord {
  if (
    typeof value === "object" &&
    value !== null
  ) {
    return value as UnknownRecord;
  }

  return {};
}

function roundScore(
  value: number,
): number {
  return Math.round(
    clamp(value, SCORE_MIN, SCORE_MAX),
  );
}

function roundImpact(
  value: number,
): number {
  return Math.round(value * 10) / 10;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}