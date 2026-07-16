export type LifeArea = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  vision: string | null;
  priority: number;
  sort_order: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  user_id: string;
  life_area_id: string | null;
  name: string;
  description: string | null;
  target_frequency: number;
  preferred_days: string[];
  difficulty: number;
  session_minutes: number;
  current_level: number;
  notes: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type PracticeSession = {
  id: string;
  user_id: string;
  skill_id: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number;
  title: string;
  notes: string | null;
  completed: boolean;
  completed_at: string | null;
  reflection: string | null;
  intensity: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Reflection = {
  id: string;
  user_id: string;
  week_start: string;
  went_well: string | null;
  difficult: string | null;
  learned: string | null;
  feeling: number | null;
};

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

export const LIFE_AREA_ICONS = [
  "briefcase", "heart", "palette", "languages", "banknote", "users", "sparkles", "compass", "book", "dumbbell", "music", "leaf",
] as const;

export const LIFE_AREA_COLORS = [
  "#c2410c", "#0f766e", "#7c3aed", "#0369a1", "#166534", "#b91c1c", "#a16207", "#4338ca", "#be185d", "#0891b2",
] as const;
