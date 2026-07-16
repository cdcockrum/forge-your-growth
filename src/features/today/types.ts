import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

export type TodayPractice = {
  session: PracticeSession;
  skill?: Skill;
  area?: LifeArea;
};

export type TodayProgress = {
  completed: number;
  total: number;
  percentage: number;
};