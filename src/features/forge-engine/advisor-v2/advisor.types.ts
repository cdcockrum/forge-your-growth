// src/features/forge-engine/advisor-v2/advisor.types.ts

import type {
  Vision,
} from "@/features/vision";

import type {
  BeliefResult,
} from "../beliefs";

import type {
  HistoryResult,
} from "../history";

import type {
  IdentityEngineResult,
} from "../identity";

import type {
  MemoryResult,
} from "../memory";

import type {
  MomentumResult,
} from "../momentum";

import type {
  PatternSummary,
} from "../patterns";

import type {
  PredictionResult,
} from "../prediction";

import type {
  ProgressSummary,
} from "../progress";

import type {
  PracticeTrendAnalysis,
} from "../trends";

import type {
  AdvisorBrief,
} from "./advisor-brief/advisorBrief.types";

import type {
  ConfidenceResult,
} from "./confidence/confidence.types";

import type {
  ExecutiveJudgment,
} from "./executive-judgment";

import type {
  ReasoningResult,
} from "./reasoning";

import type {
  Reflection,
} from "./reflection";

import type {
  Simulation,
} from "./simulation";

import type {
  Wisdom,
} from "./wisdom";

export type AdvisorResult = {
  evidence: AdvisorEvidence[];

  reasoning: ReasoningResult;

  judgment: ExecutiveJudgment;

  reflection: Reflection;

  simulation: Simulation;

  wisdom: Wisdom;

  confidence: ConfidenceResult;

  brief: AdvisorBrief;
};

export type AdvisorEvidenceCategory =
  | "progress"
  | "momentum"
  | "identity"
  | "memory"
  | "pattern"
  | "belief"
  | "prediction"
  | "vision"
  | "history"
  | "trend";

export type AdvisorPriority =
  | "low"
  | "medium"
  | "high";

export interface AdvisorEvidence {
  /**
   * Stable identifier for the evidence item.
   */
  id: string;

  /**
   * Which cognitive engine produced it.
   */
  category: AdvisorEvidenceCategory;

  /**
   * Specific metric or source within that engine.
   *
   * Examples:
   * - completionRate
   * - momentumScore
   * - identityConfidence
   * - overallDirection
   */
  source: string;

  /**
   * Human-readable description.
   */
  statement: string;

  /**
   * Confidence from 0–1.
   */
  confidence: number;

  /**
   * Relative importance from 0–1.
   */
  impact: number;

  /**
   * Whether the evidence supports,
   * opposes, or is neutral toward
   * current progress.
   */
  polarity:
    | "positive"
    | "negative"
    | "neutral";

  /**
   * Searchable labels used by
   * higher-level reasoning.
   */
  tags: string[];
}

export interface AdvisorInsight {
  title: string;

  summary: string;

  confidence: number;
}

export interface AdvisorRisk {
  title: string;

  description: string;

  confidence: number;
}

export interface AdvisorOpportunity {
  title: string;

  description: string;

  confidence: number;
}

export interface AdvisorRecommendation {
  title: string;

  description: string;

  priority: AdvisorPriority;

  confidence: number;
}

export interface AdvisorAnalysis {
  generatedAt: string;

  primaryInsight: AdvisorInsight;

  primaryRisk:
    AdvisorRisk | null;

  primaryOpportunity:
    AdvisorOpportunity | null;

  recommendation:
    AdvisorRecommendation;

  evidence:
    AdvisorEvidence[];

  confidence: number;

  reasoning: string;
}

export interface BuildAdvisorAnalysisInput {
  progress:
    ProgressSummary;

  momentum:
    MomentumResult;

  identity:
    IdentityEngineResult;

  memory:
    MemoryResult;

  history:
    HistoryResult;

  patterns:
    PatternSummary;

  beliefs:
    BeliefResult;

  predictions:
    PredictionResult;

  trendAnalysis:
    PracticeTrendAnalysis | null;

  vision:
    Vision | null;
}