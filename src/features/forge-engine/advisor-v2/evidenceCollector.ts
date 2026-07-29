import type {
  ProgressSummary,
} from "../progress";

import type {
  MomentumResult,
} from "../momentum";

import type {
  IdentityEngineResult,
} from "../identity";

import type {
  MemoryResult,
} from "../memory";

import type {
  HistoryResult,
} from "../history";

import type {
  PatternSummary,
} from "../patterns";

import type {
  BeliefResult,
} from "../beliefs";

import type {
  PredictionResult,
} from "../prediction";

import type {
  PracticeTrendAnalysis,
} from "../trends";

import type {
  Vision,
} from "@/features/vision";

import type {
  AdvisorEvidence,
} from "./advisor.types";

export interface CollectEvidenceInput {
  progress: ProgressSummary;

  momentum: MomentumResult;

  identity: IdentityEngineResult;

  memory: MemoryResult;

  history: HistoryResult;

  patterns: PatternSummary;

  beliefs: BeliefResult;

  predictions: PredictionResult;

  trendAnalysis: PracticeTrendAnalysis | null;

  vision: Vision | null;
}

export function collectEvidence(
  input: CollectEvidenceInput,
): AdvisorEvidence[] {
  const evidence: AdvisorEvidence[] = [];

  if (input.trendAnalysis) {
    evidence.push({
      id: "trend-direction",

      category: "trend",

      source: "overallDirection",

      statement:
        `Overall trend is ${input.trendAnalysis.overallDirection}.`,

      confidence:
        input.trendAnalysis.confidence / 100,

      impact: 0.9,
    });
  }

  if (input.vision) {
    evidence.push({
      id: "vision-present",

      category: "vision",

      source: "vision",

      statement:
        "A long-term vision is defined.",

      confidence: 1,

      impact: 0.7,
    });
  }

  return evidence;
}