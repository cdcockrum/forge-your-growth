export type AdvisorOutcomeStatus =
  | "pending"
  | "successful"
  | "partially-successful"
  | "unsuccessful"
  | "inconclusive";

export type AdvisorRecommendationResponse =
  | "accepted"
  | "partially-followed"
  | "ignored"
  | "rejected"
  | "unknown";

export type AdvisorLearningSignalType =
  | "completion"
  | "consistency"
  | "momentum"
  | "reflection"
  | "identity"
  | "progress"
  | "user-response";

export type AdvisorLearningDirection =
  | "positive"
  | "negative"
  | "neutral";

export type AdvisorLearningSignal = {
  id: string;

  type:
    AdvisorLearningSignalType;

  direction:
    AdvisorLearningDirection;

  strength: number;

  confidence: number;

  description: string;

  observedAt: string;

  sourceId:
    string | null;
};

export type AdvisorRecommendationOutcome = {
  id: string;

  recommendationId: string;

  recommendationTitle: string;

  recommendationConfidence: number;

  response:
    AdvisorRecommendationResponse;

  status:
    AdvisorOutcomeStatus;

  signals:
    AdvisorLearningSignal[];

  outcomeScore: number;

  explanation: string;

  recommendedAt: string;

  evaluatedAt:
    string | null;
};

export type AdvisorLearningAdjustment = {
  id: string;

  recommendationId: string;

  confidenceBefore: number;

  confidenceAfter: number;

  adjustment: number;

  explanation: string;

  createdAt: string;
};

export type AdvisorLearningSummary = {
  recommendationCount: number;

  evaluatedCount: number;

  successfulCount: number;

  partiallySuccessfulCount: number;

  unsuccessfulCount: number;

  inconclusiveCount: number;

  acceptanceRate: number;

  successRate: number;

  averageOutcomeScore: number;

  averageConfidenceAdjustment: number;
};

export type AdvisorAdaptiveLearning = {
  outcomes:
    AdvisorRecommendationOutcome[];

  adjustments:
    AdvisorLearningAdjustment[];

  summary:
    AdvisorLearningSummary;

  generatedAt: string;
};