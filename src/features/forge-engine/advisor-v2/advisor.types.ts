// src/features/forge-engine/advisor-v2/advisor.types.ts

import type { Vision } from "@/features/vision";

import type { BeliefResult } from "../beliefs";
import type { HistoryResult } from "../history";
import type { IdentityEngineResult } from "../identity";
import type { MemoryResult } from "../memory";
import type { MomentumResult } from "../momentum";
import type { PatternSummary } from "../patterns";
import type { PredictionResult } from "../prediction";
import type { ProgressSummary } from "../progress";
import type { PracticeTrendAnalysis } from "../trends";

export type AdvisorEvidenceCategory =
  | "progress"
  | "momentum"
  | "identity"
  | "memory"
  | "history"
  | "trend"
  | "belief"
  | "pattern"
  | "prediction"
  | "vision"
  | "intelligence"
  | "advisor";

export type AdvisorPriority =
  | "low"
  | "medium"
  | "high";

export interface AdvisorEvidence {
  id: string;

  category: AdvisorEvidenceCategory;

  source: string;

  statement: string;

  confidence: number;

  impact: number;
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

  primaryRisk: AdvisorRisk | null;

  primaryOpportunity: AdvisorOpportunity | null;

  recommendation: AdvisorRecommendation;

  evidence: AdvisorEvidence[];

  confidence: number;

  reasoning: string;
}

export interface BuildAdvisorAnalysisInput {
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