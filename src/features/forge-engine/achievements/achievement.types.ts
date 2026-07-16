export type AchievementTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum";

export type AchievementDefinition = {
  key: string;
  title: string;
  description: string;
  tier: AchievementTier;
};

export type AchievementProgress = {
  definition: AchievementDefinition;
  unlocked: boolean;
  unlockedAt?: string;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    key: "first_practice",
    title: "First Practice",
    description: "Complete your first deliberate practice session.",
    tier: "bronze",
  },
  {
    key: "seven_day_streak",
    title: "7-Day Streak",
    description: "Practice seven consecutive days.",
    tier: "silver",
  },
  {
    key: "thirty_day_streak",
    title: "30-Day Streak",
    description: "Practice thirty consecutive days.",
    tier: "gold",
  },
  {
    key: "hundred_sessions",
    title: "100 Sessions",
    description: "Complete one hundred practice sessions.",
    tier: "gold",
  },
  {
    key: "hundred_hours",
    title: "100 Hours",
    description: "Invest one hundred hours into deliberate practice.",
    tier: "platinum",
  },
];