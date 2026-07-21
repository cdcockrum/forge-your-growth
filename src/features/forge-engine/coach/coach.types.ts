export type CoachIntensity =
  | "low"
  | "moderate"
  | "high";

export type CoachActionType =
  | "practice"
  | "adjust_plan"
  | "recover"
  | "reflect"
  | "maintain";

export type CoachRecommendation = {
  id: string;
  title: string;
  message: string;
  actionType: CoachActionType;
  actionLabel?: string;
};

export type ForgeCoachResult = {
  headline: string;
  message: string;
  intensity: CoachIntensity;
  recommendations: CoachRecommendation[];
};