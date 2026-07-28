export type EvidenceSource =
  | "progress"
  | "identity"
  | "memory"
  | "history"
  | "advisor"
  | "narrative"
  | "coach"
  | "insight";

export type EvidenceCategory =
  | "practice"
  | "identity"
  | "momentum"
  | "recommendation"
  | "reflection"
  | "achievement"
  | "memory"
  | "trend";

export type EvidencePolarity =
  | "supporting"
  | "contradicting"
  | "neutral";

export interface EvidenceNode {
  id: string;

  source: EvidenceSource;

  category: EvidenceCategory;

  subject: string;

  statement: string;

  confidence: number;

  /**
   * Relative significance of this evidence
   * within the current briefing.
   */
  weight: number;

  polarity: EvidencePolarity;

  timestamp?: string;

  relatedIds: string[];
}

export interface EvidenceGraph {
  nodes: EvidenceNode[];

  supporting: EvidenceNode[];

  contradicting: EvidenceNode[];

  strongest: EvidenceNode[];

  confidence: number;
}