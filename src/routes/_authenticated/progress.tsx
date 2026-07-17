import {
  Suspense,
  useEffect,
  useMemo,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Flame,
  Target,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/forge/app-shell";

import {
  achievementsQuery,
  iso,
  lifeAreasQuery,
  sessionsInRangeQuery,
  skillsQuery,
} from "@/features/forge/queries";

import type { PracticeSession } from "@/features/forge/types";

import { ForgeNotices } from "@/features/progress";

import { IdentityOverview } from "@/features/identity";

import {
  calculateIdentityProgress,
  calculateProgress,
  evaluateAchievements,
  generateProgressInsights,
  syncAchievements,
  type LifeAreaProgress,
  type SkillProgress,
} from "@/features/forge-engine";

import {
  AchievementsOverview,
} from "@/features/achievements";


export const Route = createFileRoute(
  "/_authenticated/progress",
)({
  loader: async ({ context }) => {
    const { start, end } = getProgressRange();

    await Promise.all([
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
      context.queryClient.ensureQueryData(
        skillsQuery(),
      ),
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        achievementsQuery(),
      ),
    ]);
  },
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-10 md:pt-12">
      <Suspense fallback={<ProgressLoadingState />}>
        <ProgressContent />
      </Suspense>
    </main>
  );
}

function ProgressLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>

      <div className="h-72 animate-pulse rounded-2xl bg-muted" />
      <div className="h-96 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function ProgressContent() {
  const queryClient = useQueryClient();

  const {
    start,
    end,
    startDate,
    endDate,
  } = getProgressRange();

  const { data: earnedAchievements } =
  useSuspenseQuery(
    achievementsQuery(),
  );

  const { data: sessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const { data: skills } = useSuspenseQuery(
    skillsQuery(),
  );

  const { data: lifeAreas } = useSuspenseQuery(
    lifeAreasQuery(),
  );



  const progress = useMemo(
    () =>
      calculateProgress({
        sessions,
        skills,
        lifeAreas,
      }),
    [sessions, skills, lifeAreas],
  );

  const achievementProgress = useMemo(
  () => evaluateAchievements(progress),
  [progress],
);

  const identity = useMemo(
    () =>
      calculateIdentityProgress({
        sessions,
        skills,
      }),
    [sessions, skills],
  );


  const insights = useMemo(
    () =>
      generateProgressInsights({
        progress,
      }),
    [progress],
  );

  const weeklyData = useMemo(
    () =>
      createWeeklyData(
        sessions,
        startDate,
        endDate,
      ),
    [sessions, startDate, endDate],
  );

  useEffect(() => {
    let cancelled = false;

    async function synchronizeAchievements() {
      try {
        const result =
          await syncAchievements(progress);

        if (
          !cancelled &&
          result.newlyEarnedKeys.length > 0
        ) {
          await queryClient.invalidateQueries({
            queryKey: ["achievements"],
          });
        }
      } catch (error) {
        console.error(
          "Achievement synchronization failed:",
          error,
        );
      }
    }

    void synchronizeAchievements();

    return () => {
      cancelled = true;
    };
  }, [progress, queryClient]);

  const dateRange = `${startDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  )} — ${endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;

  return (
    <>
      <PageHeader
        eyebrow={`Your journey · ${dateRange}`}
        title={
          <>
            The{" "}
            <span className="text-accent">
              record
            </span>
            .
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Time invested"
          value={formatMinutes(
            progress.totalMinutes,
          )}
          note={`${progress.completedSessions} completed practices`}
          icon={Clock3}
        />

        <MetricCard
          label="Consistency"
          value={`${progress.completionRate}%`}
          note={`${progress.scheduledSessions} still scheduled`}
          icon={Target}
        />

        <MetricCard
          label="Current streak"
          value={`${progress.currentStreak}d`}
          note={`Longest: ${progress.longestStreak} days`}
          icon={Flame}
          dark
        />

        <MetricCard
          label="Completed"
          value={String(
            progress.completedSessions,
          )}
          note={`${progress.skippedSessions} skipped`}
          icon={Trophy}
        />
      </section>

      <ForgeNotices insights={insights} />

      <div className="mt-6">
        <IdentityOverview
          result={identity}
          skills={skills}
        />
      </div>

      <div className="mt-6">
        <AchievementsOverview
          evaluated={achievementProgress}
          earned={earnedAchievements}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <WeeklyPracticeChart data={weeklyData} />

        <PracticeSignals
          strongestSkill={
            progress.strongestSkill
          }
          neglectedSkill={
            progress.neglectedSkill
          }
        />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <SectionHeading
          eyebrow="Life-area balance"
          title="Where your attention has gone."
          description="The share of completed practice time invested in each part of your life."
        />

        {progress.lifeAreas.some(
          (area) =>
            area.completedMinutes > 0,
        ) ? (
          <LifeAreaBalance
            areas={progress.lifeAreas}
          />
        ) : (
          <EmptyPanel message="Complete a practice to begin building your life-area record." />
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <SectionHeading
          eyebrow="Skill record"
          title="The practices shaping you."
          description="Completion, time invested, and recency across your active skills."
        />

        {progress.skills.length > 0 ? (
          <SkillRecord
            skills={progress.skills}
          />
        ) : (
          <EmptyPanel message="Add a skill to begin tracking meaningful progress." />
        )}
      </section>
    </>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  icon: typeof Clock3;
  dark?: boolean;
};

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  dark = false,
}: MetricCardProps) {
  return (
    <article
      className={`rounded-2xl p-5 ${
        dark
          ? "bg-foreground text-background"
          : "border border-border bg-surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`font-mono text-[9px] uppercase tracking-[0.22em] ${
            dark
              ? "text-background/60"
              : "text-muted-foreground"
          }`}
        >
          {label}
        </p>

        <Icon
          className={`size-4 ${
            dark
              ? "text-background/70"
              : "text-muted-foreground"
          }`}
        />
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight">
        {value}
      </p>

      <p
        className={`mt-2 text-xs leading-5 ${
          dark
            ? "text-background/65"
            : "text-muted-foreground"
        }`}
      >
        {note}
      </p>
    </article>
  );
}



type WeeklyData = {
  week: string;
  hours: number;
  sessions: number;
};

function WeeklyPracticeChart({
  data,
}: {
  data: WeeklyData[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <SectionHeading
        eyebrow="Practice rhythm"
        title="Four weeks of deliberate work."
        description="Completed hours grouped by week."
      />

      <div className="mt-8 h-64">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
              }}
            />

            <Tooltip
              cursor={{
                fill: "var(--muted)",
              }}
              contentStyle={{
                background:
                  "var(--surface)",
                border:
                  "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value, name) => {
                if (name === "hours") {
                  return [
                    `${Number(value).toFixed(
                      1,
                    )}h`,
                    "Hours",
                  ];
                }

                return [value, name];
              }}
            />

            <Bar
              dataKey="hours"
              fill="var(--accent)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

type PracticeSignalsProps = {
  strongestSkill: SkillProgress | null;
  neglectedSkill: SkillProgress | null;
};

function PracticeSignals({
  strongestSkill,
  neglectedSkill,
}: PracticeSignalsProps) {
  return (
    <section className="space-y-3">
      <SignalCard
        eyebrow="Strongest practice"
        skill={strongestSkill}
        icon={ArrowUpRight}
        emptyMessage="Complete practices to reveal your strongest skill."
      />

      <SignalCard
        eyebrow="Needs attention"
        skill={neglectedSkill}
        icon={ArrowDownRight}
        emptyMessage="Forge needs more history before identifying a neglected skill."
        neglected
      />
    </section>
  );
}

type SignalCardProps = {
  eyebrow: string;
  skill: SkillProgress | null;
  icon: typeof ArrowUpRight;
  emptyMessage: string;
  neglected?: boolean;
};

function SignalCard({
  eyebrow,
  skill,
  icon: Icon,
  emptyMessage,
  neglected = false,
}: SignalCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>

        <Icon className="size-4 text-muted-foreground" />
      </div>

      {skill ? (
        <>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight">
            {skill.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {neglected
              ? formatNeglectedSkill(
                  skill,
                )
              : `${skill.completedSessions} completed sessions · ${formatMinutes(
                  skill.completedMinutes,
                )} invested`}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </article>
  );
}

function LifeAreaBalance({
  areas,
}: {
  areas: LifeAreaProgress[];
}) {
  const activeAreas = areas.filter(
    (area) =>
      area.completedMinutes > 0,
  );

  return (
    <div className="mt-7 space-y-5">
      {activeAreas.map((area) => (
        <div key={area.areaId}>
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="size-3 rounded-full"
                style={{
                  backgroundColor:
                    area.color,
                }}
              />

              <div>
                <p className="text-sm font-semibold">
                  {area.name}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {area.completedSessions}{" "}
                  completed ·{" "}
                  {formatMinutes(
                    area.completedMinutes,
                  )}
                </p>
              </div>
            </div>

            <p className="text-sm font-extrabold">
              {area.percentageOfPractice}%
            </p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${area.percentageOfPractice}%`,
                backgroundColor:
                  area.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillRecord({
  skills,
}: {
  skills: SkillProgress[];
}) {
  const sortedSkills = [...skills].sort(
    (first, second) =>
      second.completedMinutes -
        first.completedMinutes ||
      second.completedSessions -
        first.completedSessions ||
      first.name.localeCompare(
        second.name,
      ),
  );

  return (
    <div className="mt-7 divide-y divide-border">
      {sortedSkills.map((skill) => (
        <article
          key={skill.skillId}
          className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_100px_120px_150px] sm:items-center"
        >
          <div>
            <h3 className="font-extrabold tracking-tight">
              {skill.name}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {formatLastPracticed(
                skill,
              )}
            </p>
          </div>

          <RecordValue
            label="Sessions"
            value={String(
              skill.completedSessions,
            )}
          />

          <RecordValue
            label="Time"
            value={formatMinutes(
              skill.completedMinutes,
            )}
          />

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Completion
              </span>

              <span className="font-semibold">
                {skill.completionRate}%
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{
                  width: `${skill.completionRate}%`,
                }}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function RecordValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-extrabold tracking-tight">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

function EmptyPanel({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border bg-background px-5 py-10 text-center">
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

function getProgressRange() {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(
    endDate.getDate() - 27,
  );

  return {
    start: iso(startDate),
    end: iso(endDate),
    startDate,
    endDate,
  };
}

function createWeeklyData(
  sessions: PracticeSession[],
  rangeStart: Date,
  rangeEnd: Date,
): WeeklyData[] {
  return Array.from(
    { length: 4 },
    (_, index) => {
      const weekStart =
        new Date(rangeStart);

      weekStart.setDate(
        rangeStart.getDate() +
          index * 7,
      );

      const weekEnd =
        new Date(weekStart);

      weekEnd.setDate(
        weekStart.getDate() + 6,
      );

      if (weekEnd > rangeEnd) {
        weekEnd.setTime(
          rangeEnd.getTime(),
        );
      }

      const completedSessions =
        sessions.filter(
          (session) =>
            isCompleted(session) &&
            session.scheduled_date >=
              iso(weekStart) &&
            session.scheduled_date <=
              iso(weekEnd),
        );

      const minutes =
        completedSessions.reduce(
          (sum, session) =>
            sum +
            (session.duration_minutes ??
              0),
          0,
        );

      return {
        week:
          weekStart.toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            },
          ),
        hours:
          Math.round(
            (minutes / 60) * 10,
          ) / 10,
        sessions:
          completedSessions.length,
      };
    },
  );
}

function isCompleted(
  session: PracticeSession,
): boolean {
  return (
    session.status === "completed" ||
    session.completed === true
  );
}

function formatMinutes(
  minutes: number,
): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = minutes / 60;

  return Number.isInteger(hours)
    ? `${hours}h`
    : `${hours.toFixed(1)}h`;
}

function formatNeglectedSkill(
  skill: SkillProgress,
): string {
  if (
    skill.daysSincePracticed === null
  ) {
    return "No completed practice recorded yet.";
  }

  if (
    skill.daysSincePracticed === 0
  ) {
    return "Practiced today.";
  }

  if (
    skill.daysSincePracticed === 1
  ) {
    return "Last practiced yesterday.";
  }

  return `${skill.daysSincePracticed} days since last practice.`;
}

function formatLastPracticed(
  skill: SkillProgress,
): string {
  if (!skill.lastPracticedDate) {
    return "No completed sessions yet";
  }

  if (
    skill.daysSincePracticed === 0
  ) {
    return "Practiced today";
  }

  if (
    skill.daysSincePracticed === 1
  ) {
    return "Practiced yesterday";
  }

  return `${skill.daysSincePracticed} days since last practice`;
}