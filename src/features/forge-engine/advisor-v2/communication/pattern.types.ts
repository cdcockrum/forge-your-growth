import type {
  ForgeCommunicationInput,
} from "./communication.types";

export type CommunicationEvidence =
  ForgeCommunicationInput["evidence"];

export type PatternId =
  | "momentum_slowing"
  | "momentum_strengthening"
  | "direction_stable"
  | "vision_alignment"
  | "practice_compounding"
  | "recovery_beginning"
  | "evidence_mixed"
  | "insufficient_evidence";

export type PatternDirection =
  | "positive"
  | "neutral"
  | "caution"
  | "mixed";

export interface DetectedPattern {
  id: PatternId;

  direction: PatternDirection;

  evidence: CommunicationEvidence;

  confidence: number;

  importance: number;

  context: Record<
    string,
    boolean | number | string
  >;
}

export interface PatternDefinition {
  id: PatternId;

  description: string;

  detect: (
    evidence: CommunicationEvidence,
  ) => DetectedPattern | null;
}