import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { lifeAreasQuery } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { LIFE_AREA_COLORS } from "@/features/forge/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/areas")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(lifeAreasQuery());
  },
  component: AreasPage,
});

function AreasPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-4xl mx-auto">
      <Suspense fallback={null}>
        <AreasContent />
      </Suspense>
    </div>
  );
}

function AreasContent() {
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());
  const [creating, setCreating] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Life Areas"
        title={
          <>
            Who are you <span className="text-accent">becoming</span>?
          </>
        }
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            <Plus className="size-3.5" />
            New area
          </button>
        }
      />

      {areas.length === 0 && !creating && (
        <div className="p-12 bg-surface border border-dashed border-border rounded-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Start here
          </p>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Life areas are the domains you want to grow in: Career, Health, Creativity, Languages, Finance, Relationships, Spirituality, Adventure.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
          >
            Add your first area
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {creating && <AreaForm onClose={() => setCreating(false)} />}
        {areas.map((a) => (
          <AreaCard key={a.id} area={a} />
        ))}
      </div>

      {areas.length > 0 && (
        <SuggestedAreas existing={areas.map((a) => a.name.toLowerCase())} />
      )}
    </>
  );
}

function AreaCard({ area }: { area: { id: string; name: string; color: string; vision: string | null; priority: number } }) {
  const qc = useQueryClient();
  async function remove() {
    if (!confirm(`Archive "${area.name}"?`)) return;
    await supabase.from("life_areas").update({ archived: true }).eq("id", area.id);
    qc.invalidateQueries({ queryKey: ["life_areas"] });
  }
  return (
    <div className="p-5 bg-surface border border-border rounded-2xl group">
      <div className="flex items-start justify-between mb-4">
        <div className="size-10 rounded-lg" style={{ backgroundColor: area.color }} />
        <button
          onClick={remove}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <h3 className="text-lg font-bold tracking-tight">{area.name}</h3>
      {area.vision && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{area.vision}</p>
      )}
      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Priority {area.priority}
      </p>
    </div>
  );
}

function AreaForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");
  const [color, setColor] = useState<string>(LIFE_AREA_COLORS[0]);
  const [priority, setPriority] = useState(3);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("life_areas").insert({
      user_id: u.user.id,
      name: name.trim(),
      vision: vision.trim() || null,
      color,
      priority,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["life_areas"] });
    onClose();
  }

  return (
    <form onSubmit={submit} className="p-5 bg-surface border-2 border-foreground rounded-2xl md:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">New life area</p>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <input
        autoFocus
        placeholder="e.g. Career, Health, Creativity"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full text-2xl font-extrabold tracking-tight bg-transparent outline-none placeholder:text-muted-foreground/40"
      />
      <textarea
        placeholder="Long-term vision — who do you want to become in this area?"
        value={vision}
        onChange={(e) => setVision(e.target.value)}
        rows={2}
        className="mt-3 w-full text-sm bg-transparent outline-none resize-none text-muted-foreground placeholder:text-muted-foreground/40"
      />
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Color</span>
          <div className="flex gap-1.5">
            {LIFE_AREA_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`size-6 rounded-md transition-all ${color === c ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="text-sm px-2 py-1 rounded-md border border-border bg-surface"
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          Create
        </button>
      </div>
    </form>
  );
}

const SUGGESTIONS = [
  { name: "Career", color: "#0369a1" },
  { name: "Health", color: "#166534" },
  { name: "Creativity", color: "#c2410c" },
  { name: "Languages", color: "#4338ca" },
  { name: "Finance", color: "#a16207" },
  { name: "Relationships", color: "#be185d" },
  { name: "Spirituality", color: "#7c3aed" },
  { name: "Adventure", color: "#0891b2" },
];

function SuggestedAreas({ existing }: { existing: string[] }) {
  const qc = useQueryClient();
  const remaining = SUGGESTIONS.filter((s) => !existing.includes(s.name.toLowerCase()));
  if (remaining.length === 0) return null;
  async function add(s: { name: string; color: string }) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("life_areas").insert({ user_id: u.user.id, name: s.name, color: s.color });
    qc.invalidateQueries({ queryKey: ["life_areas"] });
  }
  return (
    <section className="mt-12">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Suggested</p>
      <div className="flex flex-wrap gap-2">
        {remaining.map((s) => (
          <button
            key={s.name}
            onClick={() => add(s)}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-full text-xs font-medium hover:border-foreground/30 transition-colors"
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </button>
        ))}
      </div>
    </section>
  );
}
