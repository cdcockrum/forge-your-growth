import type { PracticeSession, Skill } from "./types";

export type GeneratedPracticeSession = Pick<
  PracticeSession,
  | "user_id"
  | "skill_id"
  | "scheduled_date"
  | "scheduled_time"
  | "duration_minutes"
  | "title"
  | "notes"
  | "completed"
  | "completed_at"
  | "reflection"
  | "intensity"
  | "sort_order"
> & {
  planning_score?: number;
  planning_reasons?: string[];
};

export type GenerateWeeklySessionsOptions = {
  userId: string;
  skills: Skill[];
  weekStart: string;
  existingSessions?: PracticeSession[];
};

export type CandidateDay = {
  dayIndex: number;
  date: string;
  score: number;
  workload: number;
  sessionCount: number;
  preferred: boolean;
  reasons: string[];
};
