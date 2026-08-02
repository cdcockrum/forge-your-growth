export type SituationAssessment =
  | "building"
  | "accelerating"
  | "plateauing"
  | "recovering"
  | "uncertain";

export type ExecutiveJudgment = {
  headline: string;

  summary: string;

  situation: SituationAssessment;

  urgency:
    | "low"
    | "medium"
    | "high";

  confidence: number;

  rationale: string[];
};