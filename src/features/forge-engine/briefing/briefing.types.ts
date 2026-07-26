import type { ForgeCognitiveState } from "../cognitive-state";

export type BriefingPriorityKind =
  | "protect-momentum"
  | "rebuild-consistency"
  | "recover"
  | "reflect"
  | "review-vision"
  | "continue-growth"
  | "general";

export type BriefingSeverity =
  | "low"
  | "moderate"
  | "high";

export interface BriefingEvidence {
  source:
    | "progress"
    | "momentum"
    | "identity"
    | "narrative"
    | "memory"
    | "history"
    | "intelligence"
    | "advisor"
    | "vision";

  description: string;
}

export interface BriefingPriority {
  id: string;
  kind: BriefingPriorityKind;
  title: string;
  reason: string;
  urgency: number;
  confidence: number;
  evidence: BriefingEvidence[];
}

export interface BriefingStrength {
  id: string;
  title: string;
  description: string;
  confidence: number;
  evidence: BriefingEvidence[];
}

export interface BriefingWatchItem {
  id: string;
  title: string;
  description: string;
  severity: BriefingSeverity;
  confidence: number;
  evidence: BriefingEvidence[];
}

export interface BriefingOpportunity {
  id: string;
  title: string;
  description: string;
  confidence: number;
  evidence: BriefingEvidence[];
}

export interface BriefingAction {
  id: string;
  title: string;
  description: string;
  confidence: number;
  relatedPriorityId?: string;
}

export interface DailyBriefing {
  generatedAt: string;

  greeting: string;
  headline: string;
  summary: string;

  priorities: BriefingPriority[];
  strengths: BriefingStrength[];
  watchItems: BriefingWatchItem[];
  opportunities: BriefingOpportunity[];

  recommendedAction: BriefingAction | null;

  confidence: number;
  evidence: BriefingEvidence[];
}

export interface BuildDailyBriefingInput {
  cognitiveState: ForgeCognitiveState;
  now?: Date;
  userName?: string;
}