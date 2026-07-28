import type {
  AdvisorBriefing,
} from "../advisor";

import type {
  BeliefResult,
} from "../beliefs";

import type {
  ContradictionResult,
} from "../contradictions";

import type {
  PatternSummary,
} from "../patterns";

import type {
  PredictionResult,
} from "../prediction";

export type ExecutiveNarrativeInput = {
  advisor: AdvisorBriefing;

  beliefs: BeliefResult;

  contradictions: ContradictionResult;

  patterns: PatternSummary;

  predictions: PredictionResult;
};

export type ExecutiveNarrative = {
  title: string;

  summary: string;

  confidence: number;
};