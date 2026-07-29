export type ConfidenceLevel =
  | "very-high"
  | "high"
  | "moderate"
  | "low"
  | "very-low";

export type ConfidenceBreakdown = {
  evidenceStrength: number;
  evidenceBreadth: number;
  agreement: number;
  contradictionPenalty: number;
  recency: number;
};

export type ConfidenceFactor =
  | "evidence-strength"
  | "evidence-breadth"
  | "agreement"
  | "contradictions"
  | "recency";

export type ConfidenceReason = {
  factor: ConfidenceFactor;
  impact: number;
  message: string;
};

export type ConfidenceResult = {
  score: number;
  level: ConfidenceLevel;
  reasons: ConfidenceReason[];
  breakdown: ConfidenceBreakdown;
};

