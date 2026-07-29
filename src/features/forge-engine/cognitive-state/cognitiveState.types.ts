import type { AdvisorBriefing } from "../advisor";
import type { EvidenceGraph } from "../evidence";
import type { HistoryResult } from "../history";
import type { IdentityEngineResult } from "../identity";
import type { IntelligenceConclusion } from "../intelligence";
import type { MemoryResult } from "../memory";
import type { MomentumResult } from "../momentum";
import type { WeeklyNarrative } from "../narrative";
import type { ProgressSummary } from "../progress";
import type { Vision } from "@/features/vision";
import type {
  ContradictionResult,
} from "../contradictions";

import type {
  PredictionResult,
} from "../prediction";

import type {
  PracticeTrendAnalysis,
} from "../trends";

export type CognitiveStateStatus =
  | "initializing"
  | "active"
  | "limited"
  | "insufficient-data";

export type CognitiveDomain =
  | "progress"
  | "momentum"
  | "identity"
  | "narrative"
  | "memory"
  | "history"
  | "evidence"
  | "predictions"
  | "intelligence"
  | "contradictions"
  | "advisor"
  | "vision"
  | "trendAnalysis";

export interface CognitiveStateMeta {
  generatedAt: string;
  status: CognitiveStateStatus;
  availableDomains: CognitiveDomain[];
  missingDomains: CognitiveDomain[];
  confidence: number;
}

export interface ForgeCognitiveState {
  progress: ProgressSummary | null;
  momentum: MomentumResult | null;
  identity: IdentityEngineResult | null;
  narrative: WeeklyNarrative | null;
  memory: MemoryResult | null;
  history: HistoryResult | null;
  evidence: EvidenceGraph | null;
  predictions: PredictionResult | null;
  intelligence: IntelligenceConclusion | null;
  advisor: AdvisorBriefing | null;
  vision: Vision | null;
  trendAnalysis: PracticeTrendAnalysis | null;

  contradictions: ContradictionResult | null;
  meta: CognitiveStateMeta;
}