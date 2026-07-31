import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  EvaluationResult,
} from "./evaluation";

import type {
  ReasoningTrace,
} from "./trace";


import type {
  RecommendationProvenance,
} from "../provenance";



export type ReasoningNode = {
  /**
   * Internal graph node identifier.
   */
  id: string;

  /**
   * Original evidence represented by
   * this node.
   */
  evidence: AdvisorEvidence;

  /**
   * Current calculated importance of
   * this evidence.
   */
  weight: number;

  /**
   * How strongly this evidence can
   * contribute to an interpretation.
   */
  support: number;
};

export type ReasoningEdgeType =
  | "related"
  | "supports"
  | "conflicts"
  | "predicts"
  | "reinforces";

export type ReasoningEdge = {
  /**
   * Stable edge identifier.
   */
  id: string;

  /**
   * AdvisorEvidence ID of the source.
   */
  from: string;

  /**
   * AdvisorEvidence ID of the target.
   */
  to: string;

  type: ReasoningEdgeType;

  /**
   * Relationship strength from 0 to 1.
   */
  strength: number;

  reasons: string[];
};

export type EvidenceGraph = {
  nodes: ReasoningNode[];

  edges: ReasoningEdge[];
};

export type EvidenceWeight = {
  evidenceId: string;

  baseScore: number;

  adjustedScore: number;

  reasons: string[];
};

export type EvidenceConflict = {
  id: string;

  evidenceIds: string[];

  explanation: string;

  severity: number;

  tags: string[];
};

export type Hypothesis = {
  id: string;

  title: string;

  description: string;

  supportingEvidence: string[];

  conflictingEvidence: string[];

  confidence: number;

  rationale: string[];
};

export type Interpretation = {
  summary: string;

  hypotheses: Hypothesis[];

  strongest: Hypothesis | null;

  confidence: number;

  supportingEvidence: string[];

  conflictingEvidence: string[];
};

export type RecommendationPriority =
  | "low"
  | "medium"
  | "high";

export type Recommendation = {
  id: string;

  title: string;

  description: string;

  rationale: string[];

  supportingEvidence: string[];

  confidence: number;

  priority: RecommendationPriority;

  provenance: RecommendationProvenance;
};

export type EvidenceAgreement = {
  id: string;

  evidenceIds: string[];

  explanation: string;

  strength: number;

  categories: string[];

  sharedTags: string[];
};

export type EvidenceTension = {
  id: string;

  evidenceIds: string[];

  explanation: string;

  severity: number;

  categories: string[];

  sharedTags: string[];
};

export type EvidenceContradiction = {
  id: string;

  evidenceIds: string[];

  explanation: string;

  severity: number;

  categories: string[];

  sharedTags: string[];
};

export type EvidenceGap = {
  id: string;

  category: string;

  explanation: string;

  importance: number;
};

export type ReasoningAnalysis = {
  agreements: EvidenceAgreement[];

  tensions: EvidenceTension[];

  contradictions: EvidenceContradiction[];

  gaps: EvidenceGap[];
};


export type ReasoningResult = {
  graph: EvidenceGraph;

  weights: EvidenceWeight[];

  analysis: ReasoningAnalysis;

  conflicts: EvidenceConflict[];

  hypotheses: Hypothesis[];

  evaluation: EvaluationResult;

  interpretation: Interpretation;

  recommendations: Recommendation[];

  trace: ReasoningTrace;
};