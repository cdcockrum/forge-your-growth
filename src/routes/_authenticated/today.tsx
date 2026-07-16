import { Suspense, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Check,
  CirclePlay,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/forge/app-shell";
import {
  lifeAreasQuery,
  profileQuery,
  sessionsForDateQuery,
  sessionsInRangeQuery,
  skillsQuery,
  todayIso,
  weekBounds,
} from "@/features/forge/queries";
import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";
import {
  DailyQuote,
  ProgressRing,
  calculateTodayProgress,
  getDailyQuote,
  getGreeting,
} from "@/features/today";
import {
  completeSession,
  restoreSession,
  skipSession,
  startSession,
} from "@/services/sessionService";
import {
  calculateForgeScore,
  type ScoreBreakdown,
} from "@/features/forge-engine";

export const Route = createFileRoute("/_authenticated/today")({
  loader: async ({ context }) => {
    const today = todayIso();
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(profileQuery()),
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(lifeAreasQuery()),
      context.queryClient.ensureQueryData(
        sessionsForDateQuery(today),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
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

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>

        <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function TodayContent() {
  const today = todayIso();
  const { start, end } = weekBounds();

  const { data: profile } = useSuspenseQuery(profileQuery());
  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());
  const { data: todaySessions } = useSuspenseQuery(
    sessionsForDateQuery(today),
  );
  const { data: weekSessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const todayProgress = calculateTodayProgress(todaySessions);
  const weekProgress = calculateWeekProgress(weekSessions);

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] || "there";

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const forgeScore = calculateForgeScore({
    sessions: weekSessions,
    skills,
  });

  return (
    <>
      <PageHeader
        eyebrow={formattedDate}
        title={
          <>
            {getGreeting(now)},{" "}
            <span className="text-accent">{firstName}</span>.
          </>
        }
      />

      <div className="mb-8">
        <DailyQuote quote={getDailyQuote(now)} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Today’s practices
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                What you are forging today.
              </h2>
            </div>

            {todayProgress.total > 0 && (
              <p className="text-sm font-semibold text-muted-foreground">
                {todayProgress.completed}/{todayProgress.total} complete
              </p>
            )}
          </div>

          {todaySessions.length === 0 ? (
            <EmptyTodayState />
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => {
                const skill = skills.find(
                  (item) => item.id === session.skill_id,
                );

                const area = skill
                  ? areas.find(
                      (item) => item.id === skill.life_area_id,
                    )
                  : undefined;

                return (
                  <TodayPracticeCard
                    key={session.id}
                    session={session}
                    skill={skill}
                    area={area}
                  />
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-4">

          <ForgeScorePanel
            score={forgeScore.score}
            breakdown={forgeScore.breakdown}
          />

          <ProgressPanel
            todayCompleted={todayProgress.completed}
            todayTotal={todayProgress.total}
            todayPercentage={todayProgress.percentage}
            weekCompleted={weekProgress.completed}
            weekTotal={weekProgress.total}
          />

          <IdentityPanel
            completedMinutes={calculateCompletedMinutes(
              weekSessions,
            )}
          />
        </aside>
      </div>
    </>
  );
}

function EmptyTodayState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        The anvil is clear
      </p>

      <h3 className="mt-3 text-xl font-extrabold tracking-tight">
        Nothing is scheduled for today.
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Use the weekly plan to add a practice today or enjoy the
        recovery time you intentionally created.
      </p>
    </div>
  );
}

type TodayPracticeCardProps = {
  session: PracticeSession;
  skill?: Skill;
  area?: LifeArea;
};

function TodayPracticeCard({
  session,
  skill,
  area,
}: TodayPracticeCardProps) {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  const status =
    session.status ??
    (session.completed ? "completed" : "scheduled");

  async function refreshSessions() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["sessions", "date"],
      }),
    ]);
  }

  async function runAction(
    action: () => Promise<void>,
    successMessage: string,
  ) {
    try {
      setUpdating(true);

      await action();
      await refreshSessions();

      toast.success(successMessage);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Practice could not be updated.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article
      className={`rounded-2xl border p-5 transition-all ${
        status === "completed"
          ? "border-border bg-muted/60"
          : status === "skipped"
            ? "border-dashed border-border bg-muted/30"
            : status === "in_progress"
              ? "border-accent/40 bg-accent/5 shadow-sm"
              : "border-border bg-surface"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {area && (
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: area.color }}
              />
            )}

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {area?.name ?? "Practice"}
            </p>
          </div>

          <h3
            className={`mt-2 text-xl font-extrabold tracking-tight ${
              status === "completed"
                ? "text-muted-foreground line-through"
                : ""
            }`}
          >
            {session.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>{session.duration_minutes} minutes</span>

            {skill && (
              <span>
                Difficulty {skill.difficulty}/5
              </span>
            )}

            {status === "in_progress" && (
              <span className="font-semibold text-accent">
                In progress
              </span>
            )}

            {status === "completed" && (
              <span className="font-semibold text-foreground">
                Completed
              </span>
            )}

            {status === "skipped" && (
              <span className="font-semibold">
                Skipped
              </span>
            )}
          </div>

          {session.notes && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {session.notes}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {status === "scheduled" && (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  runAction(
                    () => startSession(session.id),
                    `${session.title} started.`,
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold transition hover:bg-muted disabled:cursor-wait disabled:opacity-50"
              >
                <CirclePlay className="size-4" />
                Start
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  runAction(
                    () =>
                      completeSession(session.id, {
                        durationMinutes:
                          session.duration_minutes,
                      }),
                    `${session.title} completed.`,
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-wait disabled:opacity-50"
              >
                <Check className="size-4" />
                Complete
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  runAction(
                    () => skipSession(session.id),
                    `${session.title} skipped.`,
                  )
                }
                className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-wait disabled:opacity-50"
                aria-label={`Skip ${session.title}`}
                title="Skip"
              >
                <SkipForward className="size-4" />
              </button>
            </>
          )}

          {status === "in_progress" && (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  runAction(
                    () =>
                      completeSession(session.id, {
                        durationMinutes:
                          session.duration_minutes,
                      }),
                    `${session.title} completed.`,
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-wait disabled:opacity-50"
              >
                <Check className="size-4" />
                Finish
              </button>

              <button
                type="button"
                disabled={updating}
                onClick={() =>
                  runAction(
                    () => restoreSession(session.id),
                    `${session.title} reset.`,
                  )
                }
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-wait disabled:opacity-50"
                aria-label={`Reset ${session.title}`}
                title="Reset"
              >
                <RotateCcw className="size-4" />
              </button>
            </>
          )}

          {(status === "completed" ||
            status === "skipped") && (
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                runAction(
                  () => restoreSession(session.id),
                  `${session.title} restored.`,
                )
              }
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold transition hover:bg-muted disabled:cursor-wait disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
              Restore
            </button>
          )}
        </div>
      </div>
    </article>
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
        Built through deliberate, consistent practice.
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
        <ProgressRing value={todayPercentage} />
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

type IdentityPanelProps = {
  completedMinutes: number;
};

function IdentityPanel({
  completedMinutes,
}: IdentityPanelProps) {
  const hours = completedMinutes / 60;

  return (
    <section className="rounded-2xl border border-border bg-foreground p-6 text-background">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/60">
        Time invested
      </p>

      <p className="mt-3 text-3xl font-extrabold tracking-tight">
        {hours < 1
          ? `${completedMinutes}m`
          : `${hours.toFixed(1)}h`}
      </p>

      <p className="mt-3 text-sm leading-6 text-background/70">
        Every completed practice is evidence of the person you are
        becoming.
      </p>
    </section>
  );
}

function calculateWeekProgress(
  sessions: PracticeSession[],
) {
  const includedSessions = sessions.filter(
    (session) => session.status !== "skipped",
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

function calculateCompletedMinutes(
  sessions: PracticeSession[],
): number {
  return sessions
    .filter(
      (session) =>
        session.status === "completed" ||
        session.completed,
    )
    .reduce(
      (total, session) =>
        total + (session.duration_minutes ?? 0),
      0,
    );
}