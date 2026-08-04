import type {
  ForgeState,
} from "@/features/forge-engine";

import type {
  AdvisorResult,
} from "@/features/forge-engine/advisor-v2/advisor.types";

import type {
  AdvisorAdaptiveLearning,
} from "@/features/forge-engine/advisor-v2/adaptive-learning";

import type {
  AdvisorVoiceResult,
} from "@/features/forge-engine/advisor-v2/communication";

export type ForgeCognitionInput = {
  forge: ForgeState;

  adaptiveLearning:
    AdvisorAdaptiveLearning | null;

  generatedAt: string;
};

export type ForgeCognitionState = {
  forge: ForgeState;

  advisor:
    AdvisorResult;

  adaptiveLearning:
    AdvisorAdaptiveLearning | null;

  voice:
    AdvisorVoiceResult;

  generatedAt: string;
};

export type ForgeCognitionSummary = {
  confidence: number;

  headline: string;

  explanation: string;

  isLearning: boolean;

  evidenceCount: number;

  generatedAt: string;
};

export type ForgeCognitionResult = {
  state:
    ForgeCognitionState;

  summary:
    ForgeCognitionSummary;
};