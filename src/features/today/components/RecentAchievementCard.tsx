import { Award, Trophy } from "lucide-react";

import type { EarnedAchievement } from "@/features/forge/types";

type RecentAchievementCardProps = {
  achievement: EarnedAchievement | null;
};

export function RecentAchievementCard({
  achievement,
}: RecentAchievementCardProps) {
  if (!achievement) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-surface/40 p-6">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-muted-foreground" />

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Recent achievement
          </p>
        </div>

        <h2 className="mt-4 text-lg font-extrabold tracking-tight">
          Your first milestone is ahead.
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Complete a deliberate practice to begin earning achievements.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-accent/25 bg-accent/5 p-6">
      <div className="flex items-center gap-2">
        <Award className="size-4 text-accent" />

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Recent achievement
        </p>
      </div>

      <h2 className="mt-4 text-xl font-extrabold tracking-tight">
        {achievement.title}
      </h2>

      {achievement.description && (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {achievement.description}
        </p>
      )}

      <p className="mt-4 text-xs font-semibold text-muted-foreground">
        Earned{" "}
        {new Date(
          achievement.earned_at,
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </section>
  );
}