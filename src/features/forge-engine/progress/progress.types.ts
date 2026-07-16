import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

export type SkillProgress = {
  skillId: string;
  name: string;
  completedSessions: number;
  completedMinutes: number;
  completionRate: number;
  lastPracticedDate: string | null;
  daysSincePracticed: number | null;
};

export type LifeAreaProgress = {
  areaId: string;
  name: string;
  color: string;
  completedSessions: number;
  completedMinutes: number;
  percentageOfPractice: number;
};

export type ProgressSummary = {
  totalSessions: number;
  completedSessions: number;
  skippedSessions: number;
  scheduledSessions: number;
  completionRate: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  strongestSkill: SkillProgress | null;
  neglectedSkill: SkillProgress | null;
  skills: SkillProgress[];
  lifeAreas: LifeAreaProgress[];
};

export type CalculateProgressOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
  lifeAreas: LifeArea[];
  today?: Date;
};