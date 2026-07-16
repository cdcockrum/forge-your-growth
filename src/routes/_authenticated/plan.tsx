import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { skillsQuery, lifeAreasQuery, sessionsInRangeQuery, weekBounds, iso, todayIso } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { DAYS, DAY_LABELS } from "@/features/forge/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Sparkles, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/plan")({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();
    await Promise.all([
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(lifeAreasQuery()),
      context.queryClient.ensureQueryData(sessionsInRangeQuery(start, end)),
    ]);
  },
  component: PlanPage,
});

function PlanPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-6xl mx-auto">
      <Suspense fallback={null}>
        <PlanContent />
      </Suspense>
    </div>
  );
}

function PlanContent() {
  const qc = useQueryClient();
  const { start, end, monday } = weekBounds();
  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());
  const { data: sessions } = useSuspenseQuery(sessionsInRangeQuery(start, end));
  const [generating, setGenerating] = useState(false);

  const dayList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: d, iso: iso(d), key: DAYS[i] };
  });

  async function generateWeek() {
    if (skills.length === 0) {
      toast.error("Add skills first");
      return;
    }
    setGenerating(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const toInsert: any[] = [];
    for (const skill of skills) {
      const preferred = skill.preferred_days?.length > 0 ? skill.preferred_days : ["mon", "wed", "fri"];
      const target = Math.min(skill.target_frequency, preferred.length);
      const chosen = preferred.slice(0, target);
      for (const dayKey of chosen) {
        const day = dayList.find((d) => d.key === dayKey);
        if (!day) continue;
        // Skip if already scheduled that day for that skill
        const exists = sessions.some((s) => s.skill_id === skill.id && s.scheduled_date === day.iso);
        if (exists) continue;
        toInsert.push({
          user_id: u.user.id,
          skill_id: skill.id,
          scheduled_date: day.iso,
          duration_minutes: skill.session_minutes,
          title: skill.name,
          intensity: skill.difficulty >= 4 ? "high" : "deliberate",
        });
      }
    }

    if (toInsert.length === 0) {
      toast.info("This week is already planned.");
      setGenerating(false);
      return;
    }

    const { error } = await supabase.from("practice_sessions").insert(toInsert);
    setGenerating(false);
    if (error) return toast.error(error.message);
    toast.success(`Forged ${toInsert.length} sessions.`);
    qc.invalidateQueries({ queryKey: ["sessions"] });
  }

  return (
    <>
      <PageHeader
        eyebrow={`Week of ${monday.toLocaleDateString("en", { month: "short", day: "numeric" })}`}
        title={
          <>
            The <span className="text-accent">week ahead</span>.
          </>
        }
        action={
          <button
            onClick={generateWeek}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 disabled:opacity-50"
          >
            <Sparkles className="size-3.5" />
            {generating ? "Forging..." : "AI plan week"}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {dayList.map((day) => {
          const daySessions = sessions.filter((s) => s.scheduled_date === day.iso);
          const isToday = day.iso === todayIso();
          return (
            <div
              key={day.iso}
              className={`p-3 rounded-xl border ${
                isToday ? "border-foreground bg-surface" : "border-border bg-surface/50"
              }`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className={`font-mono text-[10px] uppercase tracking-widest ${isToday ? "text-accent font-bold" : "text-muted-foreground"}`}>
                  {DAY_LABELS[day.key]}
                </span>
                <span className="text-lg font-extrabold tracking-tight">{day.date.getDate()}</span>
              </div>
              <div className="space-y-2 min-h-[80px]">
                {daySessions.map((s) => {
                  const skill = skills.find((k) => k.id === s.skill_id);
                  const area = skill ? areas.find((a) => a.id === skill.life_area_id) : undefined;
                  return (
                    <PlanSlot key={s.id} session={s} area={area} />
                  );
                })}
                <AddSlot date={day.iso} skills={skills} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PlanSlot({ session, area }: { session: any; area: any }) {
  const qc = useQueryClient();
  async function remove() {
    await supabase.from("practice_sessions").delete().eq("id", session.id);
    qc.invalidateQueries({ queryKey: ["sessions"] });
  }
  async function toggle() {
    const next = !session.completed;
    await supabase
      .from("practice_sessions")
      .update({ completed: next, completed_at: next ? new Date().toISOString() : null })
      .eq("id", session.id);
    qc.invalidateQueries({ queryKey: ["sessions"] });
  }
  return (
    <div
      className={`group p-2.5 rounded-lg border text-left transition-all ${
        session.completed ? "opacity-50 bg-muted" : "bg-background"
      }`}
      style={{ borderColor: area?.color ? area.color + "33" : undefined }}
    >
      <div className="flex items-start justify-between gap-1">
        <button onClick={toggle} className="flex-1 min-w-0 text-left">
          {area && (
            <p className="font-mono text-[9px] uppercase tracking-widest truncate" style={{ color: area.color }}>
              {area.name}
            </p>
          )}
          <p className="text-xs font-bold truncate">{session.title}</p>
          <p className="text-[10px] text-muted-foreground">{session.duration_minutes}m</p>
        </button>
        {session.completed ? (
          <Check className="size-3 text-accent shrink-0" />
        ) : (
          <button
            onClick={remove}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive text-[10px]"
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function AddSlot({ date, skills }: { date: string; skills: any[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  async function add(skill: any) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("practice_sessions").insert({
      user_id: u.user.id,
      skill_id: skill.id,
      scheduled_date: date,
      duration_minutes: skill.session_minutes,
      title: skill.name,
    });
    qc.invalidateQueries({ queryKey: ["sessions"] });
    setOpen(false);
  }
  if (skills.length === 0) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-1.5 rounded-lg border border-dashed border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
        aria-label="Add session"
      >
        <Plus className="size-3.5" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-48 bg-surface border border-border rounded-lg shadow-xl p-1 max-h-60 overflow-auto">
          {skills.map((s) => (
            <button
              key={s.id}
              onClick={() => add(s)}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-muted text-xs truncate"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
