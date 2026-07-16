import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { lifeAreasQuery, skillsQuery, sessionsInRangeQuery, todayIso, weekBounds } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { SessionCard } from "@/components/forge/session-card";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/today")({
  loader: async ({ context }) => {
    const today = todayIso();
    const { start, end } = weekBounds();
    await Promise.all([
      context.queryClient.ensureQueryData(sessionsInRangeQuery(start, end)),
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(lifeAreasQuery()),
    ]);
    return { today };
  },
  component: TodayPage,
});

function TodayPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-3xl mx-auto">
      <Suspense fallback={null}>
        <TodayContent />
      </Suspense>
    </div>
  );
}

function TodayContent() {
  const today = todayIso();
  const { start, end } = weekBounds();
  const { data: sessions } = useSuspenseQuery(sessionsInRangeQuery(start, end));
  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());

  const todaySessions = sessions.filter((s) => s.scheduled_date === today);
  const done = todaySessions.filter((s) => s.completed).length;

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
        title={
          <>
            Today's <span className="text-accent">work</span>.
          </>
        }
      />

      {todaySessions.length > 0 && (
        <div className="mb-6 flex items-center justify-between p-4 bg-muted rounded-xl">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Progress</p>
            <p className="text-2xl font-extrabold tracking-tight mt-0.5">
              {done} / {todaySessions.length}
            </p>
          </div>
          <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${todaySessions.length > 0 ? (done / todaySessions.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {todaySessions.length === 0 ? (
        <div className="p-12 bg-surface border border-dashed border-border rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-4">Nothing scheduled today.</p>
          <Link
            to="/plan"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            Open weekly planner
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {todaySessions.map((s) => {
            const skill = skills.find((k) => k.id === s.skill_id);
            const area = skill ? areas.find((a) => a.id === skill.life_area_id) : undefined;
            return <SessionCard key={s.id} session={s} skill={skill} area={area} />;
          })}
        </div>
      )}
    </>
  );
}
