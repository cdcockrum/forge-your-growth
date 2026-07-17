import {
  Award,
  Check,
  Lock,
  Trophy,
} from "lucide-react";

import type {
  AchievementDefinition,
  AchievementProgress,
} from "@/features/forge-engine";
import type {
  EarnedAchievement,
} from "@/features/forge/types";

type AchievementsOverviewProps = {
  evaluated: AchievementProgress[];
  earned: EarnedAchievement[];
};

export function AchievementsOverview({
  evaluated,
  earned,
}: AchievementsOverviewProps) {
  const earnedByKey = new Map(
    earned.map((achievement) => [
      achievement.key,
      achievement,
    ]),
  );

  const unlocked = evaluated.filter(
    (achievement) =>
      earnedByKey.has(
        achievement.definition.key,
      ),
  );

  const locked = evaluated.filter(
    (achievement) =>
      !earnedByKey.has(
        achievement.definition.key,
      ),
  );

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <header className="max-w-2xl">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-accent" />

          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Achievements
          </p>
        </div>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
          Milestones earned through practice.
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Forge recognizes meaningful thresholds in consistency,
          time invested, and completed practice.
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <AchievementMetric
          label="Earned"
          value={String(unlocked.length)}
        />

        <AchievementMetric
          label="Remaining"
          value={String(locked.length)}
        />

        <AchievementMetric
          label="Total"
          value={String(evaluated.length)}
        />
      </div>

      {unlocked.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Earned milestones
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {unlocked.map((achievement) => {
              const earnedAchievement =
                earnedByKey.get(
                  achievement.definition.key,
                );

              return (
                <AchievementCard
                  key={achievement.definition.key}
                  definition={
                    achievement.definition
                  }
                  earnedAt={
                    earnedAchievement?.earned_at
                  }
                  unlocked
                />
              );
            })}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="mt-8 border-t border-border pt-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Still ahead
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {locked.map((achievement) => (
              <AchievementCard
                key={achievement.definition.key}
                definition={
                  achievement.definition
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AchievementMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-4">
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-extrabold tracking-tight">
        {value}
      </p>
    </div>
  );
}

type AchievementCardProps = {
  definition: AchievementDefinition;
  unlocked?: boolean;
  earnedAt?: string;
};

function AchievementCard({
  definition,
  unlocked = false,
  earnedAt,
}: AchievementCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        unlocked
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-background opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full p-2 ${
              unlocked
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {unlocked ? (
              <Award className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
          </div>

          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
              {formatTier(
                definition.tier,
              )}
            </p>

            <h3 className="mt-1 font-extrabold tracking-tight">
              {definition.title}
            </h3>
          </div>
        </div>

        {unlocked && (
          <Check className="size-4 text-accent" />
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {definition.description}
      </p>

      {earnedAt && (
        <p className="mt-4 text-xs font-semibold text-muted-foreground">
          Earned{" "}
          {new Date(
            earnedAt,
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}
    </article>
  );
}

function formatTier(
  tier: AchievementDefinition["tier"],
): string {
  return (
    tier.charAt(0).toUpperCase() +
    tier.slice(1)
  );
}