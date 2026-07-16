import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { skillsQuery, lifeAreasQuery } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { DAYS, DAY_LABELS } from "@/features/forge/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/skills")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(lifeAreasQuery()),
    ]);
  },
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-4xl mx-auto">
      <Suspense fallback={null}>
        <SkillsContent />
      </Suspense>
    </div>
  );
}

function SkillsContent() {
  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());
  const [creating, setCreating] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title={
          <>
            Deliberate <span className="text-accent">practice</span>.
          </>
        }
        action={
          areas.length > 0 && (
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
            >
              <Plus className="size-3.5" />
              New skill
            </button>
          )
        }
      />

      {areas.length === 0 ? (
        <div className="p-10 bg-surface border border-dashed border-border rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-4">Create a life area first.</p>
          <Link
            to="/areas"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background"
          >
            Go to life areas
          </Link>
        </div>
      ) : skills.length === 0 && !creating ? (
        <div className="p-12 bg-surface border border-dashed border-border rounded-2xl text-center">
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Skills are the specific practices that move you forward. Writing, French, running, painting, guitar, Python, leadership.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            Add your first skill
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {creating && <SkillForm areas={areas} onClose={() => setCreating(false)} />}
          {skills.map((s) => (
            <SkillRow key={s.id} skill={s} area={areas.find((a) => a.id === s.life_area_id)} />
          ))}
        </div>
      )}
    </>
  );
}

function SkillRow({ skill, area }: { skill: any; area: any }) {
  const qc = useQueryClient();
  async function remove() {
    if (!confirm(`Archive "${skill.name}"?`)) return;
    await supabase.from("skills").update({ archived: true }).eq("id", skill.id);
    qc.invalidateQueries({ queryKey: ["skills"] });
  }
  return (
    <div className="p-5 bg-surface border border-border rounded-xl flex items-center justify-between gap-4 group">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          {area && (
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: area.color }}>
              {area.name}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold tracking-tight truncate">{skill.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {skill.target_frequency}×/week · {skill.session_minutes}m · Difficulty {skill.difficulty}/5 · Level {skill.current_level}
        </p>
        <div className="mt-2 flex gap-1">
          {DAYS.map((d) => (
            <span
              key={d}
              className={`px-1.5 py-0.5 rounded font-mono text-[9px] uppercase ${
                skill.preferred_days?.includes(d)
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {DAY_LABELS[d][0]}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={remove}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function SkillForm({ areas, onClose }: { areas: any[]; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const [frequency, setFrequency] = useState(3);
  const [minutes, setMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState(3);
  const [days, setDays] = useState<string[]>(["mon", "wed", "fri"]);
  const [loading, setLoading] = useState(false);

  function toggleDay(d: string) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !areaId) return;
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("skills").insert({
      user_id: u.user.id,
      life_area_id: areaId,
      name: name.trim(),
      target_frequency: frequency,
      session_minutes: minutes,
      difficulty,
      preferred_days: days,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["skills"] });
    onClose();
  }

  return (
    <form onSubmit={submit} className="p-5 bg-surface border-2 border-foreground rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">New skill</p>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <input
        autoFocus
        placeholder="e.g. Deep Writing, French, Running"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full text-2xl font-extrabold tracking-tight bg-transparent outline-none placeholder:text-muted-foreground/40"
      />
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <SelectField label="Life area" value={areaId} onChange={setAreaId}>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </SelectField>
        <NumField label="Freq/wk" value={frequency} onChange={setFrequency} min={1} max={7} />
        <NumField label="Minutes" value={minutes} onChange={setMinutes} min={5} max={240} step={5} />
        <NumField label="Difficulty" value={difficulty} onChange={setDifficulty} min={1} max={5} />
      </div>
      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Preferred days</p>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                days.includes(d) ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {DAY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          Create skill
        </button>
      </div>
    </form>
  );
}

function SelectField({ label, value, onChange, children }: any) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-9 px-2 rounded-lg border border-border bg-surface text-sm">
        {children}
      </select>
    </label>
  );
}

function NumField({ label, value, onChange, min, max, step = 1 }: any) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full h-9 px-2 rounded-lg border border-border bg-surface text-sm"
      />
    </label>
  );
}
