import type {
  AdvisorEvidence,
  AdvisorPriority,
} from "../advisor.types";

import type {
  AdvisorBrief,
} from "../advisor-brief/advisorBrief.types";

import type {
  ConfidenceResult,
} from "../confidence/confidence.types";

import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  Wisdom,
} from "../wisdom";

export type ForgeCommunicationTone =
  | "encouraging"
  | "steady"
  | "cautious"
  | "direct";

export type ForgeCommunicationInput = {
  wisdom: Wisdom;

  confidence: ConfidenceResult;

  brief: AdvisorBrief;
};

export type ForgeCommunicationResult = {
  summary: string;

  assessment: string;

  recommendation: {
    title: string;
    explanation: string;
    priority: AdvisorPriority;
  };

  reasoning: string[];

  actions: string[];

  evidence: string[];

  opportunities: string[];

  risks: string[];

  tone: ForgeCommunicationTone;
};