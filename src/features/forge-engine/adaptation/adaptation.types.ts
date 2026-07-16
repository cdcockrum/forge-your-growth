export type DayPerformance = {
  day: string;
  scheduledSessions: number;
  completedSessions: number;
  skippedSessions: number;
  completionRate: number;
};

export type SkillAdaptation = {
  skillId: string;
  skillName: string;
  currentPreferredDays: string[];
  recommendedDays: string[];
  dayPerformance: DayPerformance[];
  confidence: "low" | "medium" | "high";
  reasons: string[];
};

export type AdaptivePlanningResult = {
  skills: SkillAdaptation[];
};