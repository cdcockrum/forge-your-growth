export type AssessmentTone =
  | "positive"
  | "attention"
  | "neutral";

export type PlanAssessmentItem = {
  id: string;
  title: string;
  description: string;
  tone: AssessmentTone;
};

export type DailyWorkload = {
  date: string;
  sessionCount: number;
  totalMinutes: number;
  highIntensitySessions: number;
};

export type WeeklyPlanAssessment = {
  score: number;
  label: "balanced" | "demanding" | "light" | "unplanned";
  totalSessions: number;
  totalMinutes: number;
  busiestDay: DailyWorkload | null;
  dailyWorkloads: DailyWorkload[];
  items: PlanAssessmentItem[];
};