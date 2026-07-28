export type ContradictionSeverity =
  | "low"
  | "medium"
  | "high";

export type Contradiction = {
  id: string;

  title: string;

  explanation: string;

  severity: ContradictionSeverity;

  evidence: string[];
};

export type ContradictionResult = {
  contradictions: Contradiction[];

  strongest?: Contradiction;
};