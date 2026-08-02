export type RecommendationOutcome =
  | "successful"
  | "neutral"
  | "unsuccessful";

export interface RecommendationHistory {
  recommendationId: string;

  createdAt: string;

  completedAt?: string;

  followed: boolean;

  outcome: RecommendationOutcome;

  momentumChange: number;

  progressChange: number;

  confidenceChange: number;

  identityChange: number;
}

export interface RecommendationEffectiveness {
  recommendationId: string;

  totalRecommendations: number;

  followedCount: number;

  successRate: number;

  averageMomentumGain: number;

  averageProgressGain: number;

  averageConfidenceGain: number;

  averageIdentityGain: number;

  effectivenessScore: number;
}

export interface ConfidenceCalibration {
  predictedConfidence: number;

  observedConfidence: number;

  calibrationError: number;
}

export interface LearningResult {
  effectiveness:
    RecommendationEffectiveness[];

  calibration:
    ConfidenceCalibration[];

  learnedBeliefs: string[];

  updatedConfidence: number;
}