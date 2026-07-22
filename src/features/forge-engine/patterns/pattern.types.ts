export type PatternConfidence =
  | "low"
  | "medium"
  | "high";

export type ForgePattern = {
  id: string;

  title: string;

  description: string;

  confidence: PatternConfidence;

  evidenceCount: number;

  recommendation?: string;
};

export type PatternSummary = {
  patterns: ForgePattern[];

  strongestPattern: ForgePattern | null;
};