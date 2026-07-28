export type ForgeBelief = {
  id: string;

  statement: string;

  confidence: number;

  supportingEvidence: string[];

  contradictingEvidence: string[];

  lastUpdated: string;
};

export type BeliefResult = {
  beliefs: ForgeBelief[];

  strongest: ForgeBelief[];

  confidence: number;
};