import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

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
import type { PracticeSession } from "@/features/forge/types";
import {
  CoachCard,
  ForgeScorePanel,
  IdentityCard,
  MomentumPanel,
  ProgressPanel,
  QuoteCard,
  RecentAchievementCard,
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
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
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

          <IdentityCard
            identity={forge.identity}
          />

          <RecentAchievementCard
            achievement={
              achievements[0] ?? null
            }
          />
        </aside>
      </div>
    </>
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