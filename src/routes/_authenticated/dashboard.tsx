import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { lifeAreasQuery, skillsQuery, sessionsInRangeQuery, profileQuery, weekBounds, todayIso } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { SessionCard } from "@/components/forge/session-card";
import { ForgePage } from "@/components/forge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();
    await Promise.all([
      context.queryClient.ensureQueryData(lifeAreasQuery()),
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(sessionsInRangeQuery(start, end)),
      context.queryClient.ensureQueryData(profileQuery()),
    ]);
  },
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-5xl mx-auto">
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardContent() {
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());
  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: profile } = useSuspenseQuery(profileQuery());
  const { start, end } = weekBounds();
  const { data: weekSessions } = useSuspenseQuery(sessionsInRangeQuery(start, end));

  const today = todayIso();
  const todaySessions = weekSessions.filter((s) => s.scheduled_date === today);
  const completedThisWeek = weekSessions.filter((s) => s.completed).length;
  const consistency = weekSessions.length > 0 ? Math.round((completedThisWeek / weekSessions.length) * 100) : 0;
  const totalHours = Math.round((weekSessions.filter((s) => s.completed).reduce((sum, s) => sum + s.duration_minutes, 0) / 60) * 10) / 10;

  const dayName = new Date().toLocaleDateString("en", { weekday: "long" });
  const dateStr = new Date().toLocaleDateString("en", { month: "short", day: "numeric" });
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        eyebrow={`${dayName} · ${dateStr}`}
        title={
          <>
            The steel is <span className="text-accent">glowing</span>, {firstName}.
          </>
        }
      />

      {/* Weekly strip */}
      <WeeklyStrip sessions={weekSessions} />

      {/* Today */}
      <section className="mt-10 animate-reveal [animation-delay:200ms]">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Today's Focus</h2>
          <Link
            to="/today"
            className="font-mono text-[10px] text-accent uppercase tracking-widest inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            {todaySessions.length} sessions <ArrowRight className="size-3" />
          </Link>
        </div>
        {todaySessions.length === 0 ? (
          <EmptyToday hasSkills={skills.length > 0} />
        ) : (
          <div className="space-y-3">
            {todaySessions.slice(0, 3).map((s) => {
              const skill = skills.find((k) => k.id === s.skill_id);
              const area = skill ? areas.find((a) => a.id === skill.life_area_id) : undefined;
              return <SessionCard key={s.id} session={s} skill={skill} area={area} />;
            })}
          </div>
        )}
      </section>

      {/* Stats grid */}
      <section className="mt-10 grid grid-cols-2 gap-3 animate-reveal [animation-delay:300ms]">
        <div className="p-5 bg-muted rounded-2xl flex flex-col justify-between aspect-square">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Consistency</span>
          <div>
            <p className="text-5xl font-extrabold tracking-tighter leading-none">{consistency}%</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-tight">
              {completedThisWeek} of {weekSessions.length} this week
            </p>
          </div>
        </div>
        <div className="p-5 bg-foreground text-background rounded-2xl flex flex-col justify-between aspect-square">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">Practice</span>
          <div>
            <p className="text-5xl font-extrabold tracking-tighter leading-none">{totalHours}h</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-tight opacity-70">Hours this week</p>
          </div>
        </div>
      </section>

      {/* Life balance */}
      {areas.length > 0 && (
        <section className="mt-10 animate-reveal [animation-delay:400ms]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Life Balance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {areas.slice(0, 8).map((a) => {
              const areaSkills = skills.filter((s) => s.life_area_id === a.id);
              const areaSessions = weekSessions.filter((s) => areaSkills.some((sk) => sk.id === s.skill_id));
              const done = areaSessions.filter((s) => s.completed).length;
              const total = areaSessions.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Link
                  key={a.id}
                  to="/areas"
                  className="p-4 bg-surface border border-border rounded-2xl hover:border-foreground/20 transition-colors"
                >
                  <div className="size-6 rounded-md mb-3" style={{ backgroundColor: a.color + "22", color: a.color }}>
                    <div className="size-full rounded-md" style={{ backgroundColor: a.color, opacity: 0.7 }} />
                  </div>
                  <p className="text-sm font-bold tracking-tight truncate">{a.name}</p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                    {areaSkills.length} skill{areaSkills.length === 1 ? "" : "s"} · {pct}%
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* AI Coach insight */}
      <section className="mt-10 animate-reveal [animation-delay:500ms]">
        <div className="p-6 md:p-8 bg-accent/5 border border-accent/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono text-[80px] md:text-[120px] opacity-[0.03] select-none uppercase font-extrabold leading-none">
            FORGE
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-3.5 text-accent" />
            <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em]">
              The Mentor · AI Insight
            </p>
          </div>
          <p className="text-lg md:text-2xl font-bold leading-snug tracking-tight text-pretty relative">
            {insight(consistency, areas.length, skills.length)}
          </p>
        </div>
      </section>

      <div className="mt-16 pt-8 border-t border-border">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground text-center">
          Excellence is not an act, but a habit.
        </p>
      </div>
    </>
  );
}

function insight(consistency: number, areasN: number, skillsN: number) {
  if (areasN === 0) return "Begin by naming the areas of life you want to become expert in. The forge waits for the first strike.";
  if (skillsN === 0) return "Add the skills that will move you toward who you're becoming. Direction precedes discipline.";
  if (consistency >= 80) return "Excellence is not an act, but a habit. You are showing up. Double down on your current rhythm.";
  if (consistency >= 50) return "The blade is not made by the intensity of the heat, but by the regularity of the strike. Return tomorrow.";
  return "True discipline is not about control, but about remembering what you want most. Start with one session today.";
}

function EmptyToday({ hasSkills }: { hasSkills: boolean }) {
  return (
    <div className="p-8 bg-surface border border-dashed border-border rounded-2xl text-center">
      <p className="text-sm text-muted-foreground mb-4">
        {hasSkills ? "No practice scheduled for today." : "You haven't added any skills yet."}
      </p>
      <Link
        to={hasSkills ? "/plan" : "/skills"}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
      >
        {hasSkills ? "Plan your week" : "Add a skill"}
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

function WeeklyStrip({ sessions }: { sessions: { scheduled_date: string; completed: boolean }[] }) {
  const { monday } = weekBounds();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const today = todayIso();
  return (
    <section className="animate-reveal [animation-delay:100ms]">
      <div className="flex gap-1.5 justify-between max-w-md">
        {days.map((d) => {
          const iso = d.toISOString().slice(0, 10);
          const dayCount = sessions.filter((s) => s.scheduled_date === iso).length;
          const done = sessions.filter((s) => s.scheduled_date === iso && s.completed).length;
          const isToday = iso === today;
          const isPast = iso < today;
          return (
            <div key={iso} className={`flex flex-col items-center gap-2 flex-1 ${isPast && !isToday ? "opacity-40" : ""}`}>
              <span className={`font-mono text-[9px] uppercase ${isToday ? "text-accent font-bold" : "text-muted-foreground"}`}>
                {d.toLocaleDateString("en", { weekday: "narrow" })}
              </span>
              <div
                className={`size-9 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                  isToday
                    ? "bg-foreground text-background border-foreground ring-4 ring-foreground/10"
                    : done > 0 && done === dayCount
                    ? "bg-accent/10 text-accent border-accent/30"
                    : "border-border text-foreground"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
