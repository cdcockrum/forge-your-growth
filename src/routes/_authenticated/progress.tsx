import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { skillsQuery, lifeAreasQuery, sessionsInRangeQuery, weekBounds, iso } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/progress")({
  loader: async ({ context }) => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 28);
    await Promise.all([
      context.queryClient.ensureQueryData(sessionsInRangeQuery(iso(start), iso(now))),
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(lifeAreasQuery()),
    ]);
  },
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-5xl mx-auto">
      <Suspense fallback={null}>
        <ProgressContent />
      </Suspense>
    </div>
  );
}

function ProgressContent() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 28);
  const { data: sessions } = useSuspenseQuery(sessionsInRangeQuery(iso(start), iso(now)));
  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());

  const completed = sessions.filter((s) => s.completed);
  const totalHours = Math.round((completed.reduce((sum, s) => sum + s.duration_minutes, 0) / 60) * 10) / 10;
  const completionPct = sessions.length > 0 ? Math.round((completed.length / sessions.length) * 100) : 0;
  const streak = calcStreak(sessions);

  // Weekly bar data (4 weeks)
  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (3 - i) * 7 - 6);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const s = sessions.filter((x) => x.scheduled_date >= iso(weekStart) && x.scheduled_date <= iso(weekEnd));
    const c = s.filter((x) => x.completed);
    return {
      week: weekStart.toLocaleDateString("en", { month: "short", day: "numeric" }),
      hours: Math.round((c.reduce((sum, x) => sum + x.duration_minutes, 0) / 60) * 10) / 10,
      sessions: c.length,
    };
  });

  // Life area balance
  const areaData = areas.map((a) => {
    const areaSkills = skills.filter((s) => s.life_area_id === a.id);
    const done = completed.filter((s) => areaSkills.some((k) => k.id === s.skill_id)).length;
    return { name: a.name, value: done, color: a.color };
  }).filter((a) => a.value > 0);

  return (
    <>
      <PageHeader
        eyebrow="Last 28 days"
        title={
          <>
            The <span className="text-accent">record</span>.
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat label="Hours" value={`${totalHours}`} />
        <Stat label="Sessions" value={`${completed.length}`} />
        <Stat label="Consistency" value={`${completionPct}%`} />
        <Stat label="Streak" value={`${streak}d`} dark />
      </div>

      <section className="p-6 bg-surface border border-border rounded-2xl mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Weekly hours
        </h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="hours" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {areaData.length > 0 && (
        <section className="p-6 bg-surface border border-border rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Life Balance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={areaData} innerRadius={50} outerRadius={90} dataKey="value" stroke="var(--surface)" strokeWidth={2}>
                    {areaData.map((a, i) => (
                      <Cell key={i} fill={a.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {areaData.map((a) => (
                <div key={a.name} className="flex items-center gap-3">
                  <span className="size-3 rounded-sm" style={{ backgroundColor: a.color }} />
                  <span className="text-sm font-medium flex-1">{a.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{a.value} sessions</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`p-5 rounded-2xl ${dark ? "bg-foreground text-background" : "bg-muted"}`}>
      <p className={`font-mono text-[10px] uppercase tracking-widest ${dark ? "opacity-60" : "text-muted-foreground"}`}>{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tighter">{value}</p>
    </div>
  );
}

function calcStreak(sessions: { scheduled_date: string; completed: boolean }[]) {
  const done = new Set(sessions.filter((s) => s.completed).map((s) => s.scheduled_date));
  let streak = 0;
  const d = new Date();
  while (done.has(iso(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
