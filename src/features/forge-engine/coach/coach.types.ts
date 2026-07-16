export type CoachPriority =
  | "high"
  | "medium"
  | "low";

export type CoachActionType =
  | "practice"
  | "adjust_plan"
  | "recover"
  | "reflect"
  | "maintain";

export type CoachRecommendation = {
  id: string;
  title: string;
  description: string;
  priority: CoachPriority;
  actionType: CoachActionType;
  skillId?: string;
  skillName?: string;
};

export type ForgeCoachResult = {
  headline: string;
  summary: string;
  recommendations: CoachRecommendation[];
};