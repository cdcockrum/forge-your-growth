import { Suspense } from "react";

import {
  Link,
  createFileRoute,
} from "@tanstack/react-router";

import {
  ArrowRight,
} from "lucide-react";

import {
  ForgePage,
  ForgeSidebarLayout,
} from "@/components/forge";

import { PageHeader } from "@/components/forge/app-shell";
import { SessionCard } from "@/components/forge/session-card";

import {
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  weekBounds,
} from "@/features/forge/queries";

import {
  EmptyToday,
  WeeklyStrip,
  useDashboard,
} from "@/features/dashboard";



import {
  DashboardCurrentState,
  DailyBriefingPanel,
} from "@/features/dashboard/components";


export const Route = createFileRoute(
  "/_authenticated/dashboard",
)({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        skillsQuery(),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
      context.queryClient.ensureQueryData(
        profileQuery(),
      ),
    ]);
  },
  component: Dashboard,
});

function Dashboard() {
  return (
    <ForgePage>
      <Suspense fallback={<DashboardLoadingState />}>
        <DashboardContent />
      </Suspense>
    </ForgePage>
  );
}

function DashboardLoadingState() {
  return (
    <div className="space-y-8">
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-16 animate-pulse rounded-2xl bg-muted" />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          <div className="h-56 animate-pulse rounded-2xl bg-muted" />
        </div>

        <div className="space-y-4">
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="h-44 animate-pulse rounded-2xl bg-muted" />
          <div className="h-56 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const {
  areas,
  skills,
  weekSessions,
  todaySessions,
  completedThisWeek,
  consistency,
  totalHours,
  dayName,
  dateStr,
  firstName,
  forgeHealth,
  forgePoints,
  forge,
  dailyBriefing,
} = useDashboard();

  return (
    <>
      <PageHeader
        eyebrow={`${dayName} · ${dateStr}`}
        title={
          <>
            The steel is{" "}
            <span className="text-accent">
              glowing
            </span>
            , {firstName}.
          </>
        }
      />

      <WeeklyStrip sessions={weekSessions} />

      <DailyBriefingPanel
        briefing={dailyBriefing}
      />
      <ForgeSidebarLayout
        className="mt-10"
        main={
          <div className="space-y-10">
            <section className="animate-reveal [animation-delay:200ms]">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Today
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                    What needs your attention now.
                  </h2>
                </div>

                <Link
                  to="/today"
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-accent transition-all hover:gap-2"
                >
                  {todaySessions.length}{" "}
                  {todaySessions.length === 1
                    ? "session"
                    : "sessions"}

                  <ArrowRight className="size-3" />
                </Link>
              </div>

              {todaySessions.length === 0 ? (
                <EmptyToday
                  hasSkills={skills.length > 0}
                />
              ) : (
                <div className="space-y-3">
                  {todaySessions
                    .slice(0, 3)
                    .map((session) => {
                      const skill = skills.find(
                        (item) =>
                          item.id ===
                          session.skill_id,
                      );

                      const area = skill
                        ? areas.find(
                            (item) =>
                              item.id ===
                              skill.life_area_id,
                          )
                        : undefined;

                      return (
                        <SessionCard
                          key={session.id}
                          session={session}
                          skill={skill}
                          area={area}
                        />
                      );
                    })}
                </div>
              )}

              {todaySessions.length > 3 && (
                <div className="mt-4">
                  <Link
                    to="/today"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                  >
                    View all today’s practices
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}
            </section>

            {areas.length > 0 && (
              <section className="animate-reveal [animation-delay:400ms]">
                <div className="mb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Life balance
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                    Where your energy is going.
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {areas
                    .slice(0, 8)
                    .map((area) => {
                      const areaSkills =
                        skills.filter(
                          (skill) =>
                            skill.life_area_id ===
                            area.id,
                        );

                      const areaSkillIds = new Set(
                        areaSkills.map((skill) => skill.id),
                      );

                      const areaSessions = weekSessions.filter(
                        (session) =>
                          session.skill_id !== null &&
                          areaSkillIds.has(session.skill_id),
                      );
                      const completed =
                        areaSessions.filter(
                          (session) =>
                            session.completed,
                        ).length;

                      const total =
                        areaSessions.length;

                      const percentage =
                        total > 0
                          ? Math.round(
                              (completed /
                                total) *
                                100,
                            )
                          : 0;

                      return (
                        <Link
                          key={area.id}
                          to="/areas"
                          className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-foreground/20"
                        >
                          <div
                            className="mb-3 size-6 rounded-md"
                            style={{
                              backgroundColor:
                                `${area.color}22`,
                            }}
                          >
                            <div
                              className="size-full rounded-md opacity-70"
                              style={{
                                backgroundColor:
                                  area.color,
                              }}
                            />
                          </div>

                          <p className="truncate text-sm font-bold tracking-tight">
                            {area.name}
                          </p>

                          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {areaSkills.length}{" "}
                            {areaSkills.length === 1
                              ? "skill"
                              : "skills"}{" "}
                            · {percentage}%
                          </p>
                        </Link>
                      );
                    })}
                </div>
              </section>
            )}

            
          </div>
        }
        sidebar={
  <>
    <DashboardCurrentState
      forgeHealth={forgeHealth}
      forgePoints={forgePoints}
      consistency={consistency}
      completedThisWeek={completedThisWeek}
      totalSessions={weekSessions.length}
      totalHours={totalHours}
    />

    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Continue
      </p>

      <h2 className="mt-3 text-xl font-extrabold tracking-tight">
        Keep the rhythm moving.
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Open Today to start, finish, or review the
        practices waiting for you.
      </p>

      <Link
        to="/today"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition hover:bg-foreground/90"
      >
        Go to Today
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
     </>
  }
/>
        
    

      <div className="mt-16 border-t border-border pt-8">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Excellence is not an act, but a habit.
        </p>
      </div>
    </>
  );
}

