import { supabase } from "@/integrations/supabase/client";

import type { ProgressSummary } from "../progress/progress.types";
import { evaluateAchievements } from "./achievementEngine";

export type SyncAchievementsResult = {
  earnedKeys: string[];
  newlyEarnedKeys: string[];
};

export async function syncAchievements(
  progress: ProgressSummary,
): Promise<SyncAchievementsResult> {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!userData.user) {
    throw new Error("User not authenticated.");
  }

  const userId = userData.user.id;

  const evaluated = evaluateAchievements(progress);
  const unlocked = evaluated.filter(
    (achievement) => achievement.unlocked,
  );

  const { data: existingData, error: existingError } =
    await supabase
      .from("achievements")
      .select("key")
      .eq("user_id", userId);

  if (existingError) {
    throw existingError;
  }

  const existingKeys = new Set(
    (existingData ?? []).map(
      (achievement) => achievement.key,
    ),
  );

  const newlyUnlocked = unlocked.filter(
    (achievement) =>
      !existingKeys.has(achievement.definition.key),
  );

  if (newlyUnlocked.length > 0) {
    const { error: insertError } = await supabase
      .from("achievements")
      .insert(
        newlyUnlocked.map((achievement) => ({
          user_id: userId,
          key: achievement.definition.key,
          title: achievement.definition.title,
          description:
            achievement.definition.description,
        })),
      );

    if (insertError) {
      throw insertError;
    }
  }

  return {
    earnedKeys: unlocked.map(
      (achievement) => achievement.definition.key,
    ),
    newlyEarnedKeys: newlyUnlocked.map(
      (achievement) => achievement.definition.key,
    ),
  };
}