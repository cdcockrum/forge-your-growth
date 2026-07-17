import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/forge/app-shell";
import {
  achievementsQuery,
  lifeAreasQuery,
  profileQuery,
  sessionsForDateQuery,
  sessionsInRangeQuery,
  skillsQuery,
  todayIso,
  weekBounds,
} from "@/features/forge/queries";
import type {
  PracticeSession,
} from "@/features/forge/types";
import type {
  ScoreBreakdown,
} from "@/features/forge-engine";
import {
  CoachCard,
  IdentityCard,
  RecentAchievementCard,
  ProgressRing,
  QuoteCard,
  TodayHeader,
  TodayPracticeList,
  calculateTodayProgress,
  useTodayDashboard,
} from "@/features/today";

export const Route = createFileRoute(
  "/_authenticated/today",
)({
  loader: async ({ context }) => {
    const today = todayIso();
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(
        profileQuery(),
      ),
      context.queryClient.ensureQueryData(
        skillsQuery(),
      ),
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        sessionsForDateQuery(today),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
      context.queryClient.ensureQueryData(
        achievementsQuery(),
      ),
    ]);
  },
  component: TodayPage,
});

function TodayPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-10 md:pt-12">
      <Suspense fallback={<TodayLoadingState />}>
        <TodayContent />
      </Suspense>
    </main>
  );
}

function TodayLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      <div className="h-36 animate-pulse rounded-2xl bg-muted" />

      <div className="h-72 animate-pulse rounded-3xl bg-muted" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          {Array.from(
            { length: 3 },
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-muted"
              />
            ),
          )}
        </div>

        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

function TodayContent() {
  const dashboard = useTodayDashboard();

  const {
    profile,
    skills,
    areas,
    todaySessions,
    weekSessions,
    achievements,
    forge,
  } = dashboard;

  const todayProgress =
    calculateTodayProgress(todaySessions);

  const weekProgress =
    calculateWeekProgress(weekSessions);

  return (
    <>
      <TodayHeader profile={profile} />

      <QuoteCard />

      <CoachCard coach={forge.coach} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <TodayPracticeList
          sessions={todaySessions}
          skills={skills}
          areas={areas}
        />

        <aside className="space-y-4">
          <MomentumPanel
            score={forge.momentum.score}
            direction={forge.momentum.direction}
            consistency={
              forge.momentum.consistency
            }
            recovery={forge.momentum.recovery}
            adherence={forge.momentum.adherence}
            burnoutRisk={
              forge.momentum.burnoutRisk
            }
            message={forge.momentum.message}
          />

          <ForgeScorePanel
            score={forge.forgeScore.score}
            breakdown={
              forge.forgeScore.breakdown
            }
          />

          <ProgressPanel
            todayCompleted={
              todayProgress.completed
            }
            todayTotal={todayProgress.total}
            todayPercentage={
              todayProgress.percentage
            }
            weekCompleted={
              weekProgress.completed
            }
            weekTotal={weekProgress.total}
          />

          <IdentityCard identity={forge.identity} />

          <RecentAchievementCard
            achievement={achievements[0] ?? null}
          />
          
        </aside>
      </div>
    </>
  );
}

type MomentumPanelProps = {
  score: number;
  direction: "rising" | "stable" | "falling";
  consistency: number;
  recovery: number;
  adherence: number;
  burnoutRisk: "low" | "moderate" | "high";
  message: string;
};

function MomentumPanel({
  score,
  direction,
  consistency,
  recovery,
  adherence,
  burnoutRisk,
  message,
}: MomentumPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-foreground p-6 text-background">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/55">
            Momentum
          </p>

          <p className="mt-3 text-5xl font-extrabold tracking-tight">
            {score}
          </p>
        </div>

        <MomentumDirectionBadge
          direction={direction}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-background/70">
        {message}
      </p>

      <div className="my-5 h-px bg-background/10" />

      <div className="space-y-3">
        <MomentumMetric
          label="Consistency"
          value={consistency}
        />

        <MomentumMetric
          label="Recovery"
          value={recovery}
        />

        <MomentumMetric
          label="Adherence"
          value={adherence}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-background/5 px-3 py-2.5">
        <span className="text-xs text-background/60">
          Burnout risk
        </span>

        <span className="text-xs font-semibold capitalize">
          {burnoutRisk}
        </span>
      </div>
    </section>
  );
}

function MomentumDirectionBadge({
  direction,
}: {
  direction: MomentumPanelProps["direction"];
}) {
  const labels = {
    rising: "↑ Rising",
    stable: "→ Stable",
    falling: "↓ Falling",
  } as const;

  return (
    <span className="rounded-full border border-background/15 bg-background/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-background/75">
      {labels[direction]}
    </span>
  );
}

function MomentumMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const normalizedValue = Math.max(
    0,
    Math.min(100, value),
  );

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-background/60">
          {label}
        </span>

        <span className="font-semibold">
          {normalizedValue}%
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/10">
        <div
          className="h-full rounded-full bg-background transition-[width] duration-500"
          style={{
            width: `${normalizedValue}%`,
          }}
        />
      </div>
    </div>
  );
}

type ForgeScorePanelProps = {
  score: number;
  breakdown: ScoreBreakdown;
};

function ForgeScorePanel({
  score,
  breakdown,
}: ForgeScorePanelProps) {
  const items = [
    {
      label: "Consistency",
      value: breakdown.consistency,
    },
    {
      label: "Difficulty",
      value: breakdown.difficulty,
    },
    {
      label: "Duration",
      value: breakdown.duration,
    },
    {
      label: "Reflection",
      value: breakdown.reflection,
    },
    {
      label: "Weekly review",
      value: breakdown.review,
    },
  ].filter((item) => item.value !== 0);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Forge Score
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-5xl font-extrabold tracking-tight">
          {score}
        </p>

        <p className="pb-1 text-right text-xs leading-5 text-muted-foreground">
          This week
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Built through deliberate, consistent
        practice.
      </p>

      {items.length > 0 && (
        <>
          <div className="my-5 h-px bg-border" />

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">
                  {item.label}
                </span>

                <span className="font-semibold">
                  +{item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

type ProgressPanelProps = {
  todayCompleted: number;
  todayTotal: number;
  todayPercentage: number;
  weekCompleted: number;
  weekTotal: number;
};

function ProgressPanel({
  todayCompleted,
  todayTotal,
  todayPercentage,
  weekCompleted,
  weekTotal,
}: ProgressPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Today
      </p>

      <div className="mt-5">
        <ProgressRing
          value={todayPercentage}
        />
      </div>

      <p className="mt-5 text-sm font-semibold">
        {todayTotal === 0
          ? "No practices scheduled"
          : `${todayCompleted} of ${todayTotal} complete`}
      </p>

      <div className="my-5 h-px bg-border" />

      <div className="flex items-center justify-between gap-4 text-left">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            This week
          </p>

          <p className="mt-1 text-lg font-extrabold tracking-tight">
            {weekCompleted}/{weekTotal}
          </p>
        </div>

        <p className="text-right text-xs leading-5 text-muted-foreground">
          Intentional repetitions
          <br />
          completed this week
        </p>
      </div>
    </section>
  );
}


function calculateWeekProgress(
  sessions: PracticeSession[],
) {
  const includedSessions = sessions.filter(
    (session) =>
      session.status !== "skipped",
  );

  const completed = includedSessions.filter(
    (session) =>
      session.status === "completed" ||
      session.completed,
  ).length;

  return {
    completed,
    total: includedSessions.length,
  };
}

