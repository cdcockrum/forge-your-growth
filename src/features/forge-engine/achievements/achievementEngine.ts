import type { ProgressSummary } from "../progress/progress.types";
import {
  ACHIEVEMENTS,
  type AchievementProgress,
} from "./achievement.types";

export function evaluateAchievements(
  progress: ProgressSummary,
): AchievementProgress[] {
  const hours = progress.totalMinutes / 60;

  return ACHIEVEMENTS.map((achievement) => {
    let unlocked = false;

    switch (achievement.key) {
      case "first_practice":
        unlocked = progress.completedSessions >= 1;
        break;

      case "seven_day_streak":
        unlocked = progress.longestStreak >= 7;
        break;

      case "thirty_day_streak":
        unlocked = progress.longestStreak >= 30;
        break;

      case "hundred_sessions":
        unlocked = progress.completedSessions >= 100;
        break;

      case "hundred_hours":
        unlocked = hours >= 100;
        break;
    }

    return {
      definition: achievement,
      unlocked,
    };
  });
}