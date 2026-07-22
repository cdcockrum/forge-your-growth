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

export interface EvidenceNode {
  id: string;

  source: EvidenceSource;

  category: EvidenceCategory;

  subject: string;

  statement: string;

  confidence: number;

  timestamp?: string;

  relatedIds: string[];
}

export interface EvidenceGraph {
  nodes: EvidenceNode[];
}