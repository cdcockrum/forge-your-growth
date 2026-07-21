export type AdaptationReason =
  | "too_hard"
  | "too_easy"
  | "too_long"
  | "too_short"
  | "bad_time"
  | "low_energy"
  | "not_meaningful"
  | "schedule_conflict";

export type AdaptationConfidence =
  | "low"
  | "medium"
  | "high";

export type DayPerformance = {
  day: string;
  scheduledSessions: number;
  completedSessions: number;
  completionRate: number;
};

export type SkillAdaptation = {
  skillId: string;
  skillName: string;

  currentPreferredDays: string[];
  recommendedDays: string[];

  confidence: AdaptationConfidence;
  reasons: string[];
  dayPerformance: DayPerformance[];
};

export type AdaptationSuggestion = {
  skillId: string;
  skillName: string;

  title: string;
  explanation: string;

  confidence: number;

  changes: {
    frequency?: number;
    duration?: number;
    preferredDays?: string[];
    difficulty?: number;
  };
};

export type AdaptivePlan = {
  generatedAt: string;

  /**
   * Rich day-based recommendations used by the Skills page.
   */
  skills: SkillAdaptation[];

  /**
   * General workload recommendations used by future planning surfaces.
   */
  suggestions: AdaptationSuggestion[];
};