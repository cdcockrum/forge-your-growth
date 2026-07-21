import type {
  ForgeCoachResult,
  IdentityEngineResult,
  MomentumResult,
  ProgressSummary,
} from "@/features/forge-engine";

import type {
  Vision,
} from "@/features/vision";

export type WeeklyReviewSnapshot = {
  wins: string | null;
  challenges: string | null;
  lessons: string | null;
  focus_next_week: string | null;
  energy: number | null;
};

export type NarrativeSignal = {
  key: string;
  category:
    | "identity"
    | "victory"
    | "obstacle"
    | "momentum"
    | "reflection"
    | "focus";

  strength: number;
  text: string;
};

export type WeeklyNarrative = {
  title: string;
  opening: string;

  identityGrowth: string[];
  victories: string[];
  obstacles: string[];

  coachReflection: string;
  nextWeekFocus: string;
  closing: string;

  signals: NarrativeSignal[];
};

export type NarrativeInput = {
  vision: Vision | null;
  identity: IdentityEngineResult;
  momentum: MomentumResult;
  progress: ProgressSummary;
  coach: ForgeCoachResult;
  achievements: AchievementSnapshot[];
  review: WeeklyReviewSnapshot | null;
};

export type AchievementSnapshot = {
  id: string;
  title: string;
  earned_at: string;
};