export type PredictionOutcome =
  | "correct"
  | "incorrect"
  | "unknown";

export type ConfidenceCalibration =
  | "underconfident"
  | "well-calibrated"
  | "overconfident";

export type EvidenceReliability =
  | "low"
  | "medium"
  | "high";

export type PredictionRecord = {
  id: string;

  prediction: string;

  confidence: number;

  outcome: PredictionOutcome;

  createdAt: string;

  resolvedAt: string | null;
};

export type ConfidenceMetrics = {
  averageConfidence: number;

  averageAccuracy: number;

  calibration:
    ConfidenceCalibration;

  overconfidenceBias: number;

  underconfidenceBias: number;
};

export type ReliabilityMetrics = {
  evidenceReliability:
    EvidenceReliability;

  contradictionRate: number;

  revisionRate: number;

  evidenceCoverage: number;
};

export type CalibrationResult = {
  predictions:
    PredictionRecord[];

  confidence:
    ConfidenceMetrics;

  reliability:
    ReliabilityMetrics;

  recommendation: string;
};