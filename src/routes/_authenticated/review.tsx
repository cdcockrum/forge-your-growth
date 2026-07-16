import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState, useEffect } from "react";
import { reflectionQuery, weekBounds, sessionsInRangeQuery } from "@/features/forge/queries";
import { PageHeader } from "@/components/forge/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/review")({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();
    await Promise.all([
      context.queryClient.ensureQueryData(reflectionQuery(start)),
      context.queryClient.ensureQueryData(sessionsInRangeQuery(start, end)),
    ]);
  },
  component: ReviewPage,
});

function ReviewPage() {
  return (
    <div className="px-5 md:px-10 pt-8 md:pt-12 max-w-2xl mx-auto">
      <Suspense fallback={null}>
        <ReviewContent />
      </Suspense>
    </div>
  );
}

function ReviewContent() {
  const qc = useQueryClient();
  const { start, end, monday, sunday } = weekBounds();
  const { data: reflection } = useSuspenseQuery(reflectionQuery(start));
  const { data: sessions } = useSuspenseQuery(sessionsInRangeQuery(start, end));

  const [wentWell, setWentWell] = useState("");
  const [difficult, setDifficult] = useState("");
  const [learned, setLearned] = useState("");
  const [feeling, setFeeling] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (reflection) {
      setWentWell(reflection.went_well ?? "");
      setDifficult(reflection.difficult ?? "");
      setLearned(reflection.learned ?? "");
      setFeeling(reflection.feeling ?? null);
    }
  }, [reflection]);

  const done = sessions.filter((s) => s.completed).length;

  async function save() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("reflections").upsert(
      {
        user_id: u.user.id,
        week_start: start,
        went_well: wentWell || null,
        difficult: difficult || null,
        learned: learned || null,
        feeling,
      },
      { onConflict: "user_id,week_start" },
    );
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Reflection saved.");
    qc.invalidateQueries({ queryKey: ["reflection"] });
  }

  return (
    <>
      <PageHeader
        eyebrow={`Week of ${monday.toLocaleDateString("en", { month: "short", day: "numeric" })} — ${sunday.toLocaleDateString("en", { month: "short", day: "numeric" })}`}
        title={
          <>
            Weekly <span className="text-accent">reflection</span>.
          </>
        }
      />

      <div className="p-4 bg-muted rounded-xl mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">This week</p>
          <p className="text-2xl font-extrabold tracking-tight">{done} sessions completed</p>
        </div>
      </div>

      <div className="space-y-6">
        <Prompt label="What went well?" value={wentWell} onChange={setWentWell} />
        <Prompt label="What was difficult?" value={difficult} onChange={setDifficult} />
        <Prompt label="What did you learn?" value={learned} onChange={setLearned} />

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">How do you feel?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setFeeling(n)}
                className={`flex-1 h-14 rounded-xl border-2 text-2xl transition-all ${
                  feeling === n ? "border-accent bg-accent/5 scale-105" : "border-border bg-surface hover:border-foreground/20"
                }`}
              >
                {["😔", "😐", "🙂", "😊", "🔥"][n - 1]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full h-12 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save reflection"}
        </button>
      </div>
    </>
  );
}

function Prompt({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder="Type freely..."
        className="mt-2 w-full p-4 rounded-xl border border-border bg-surface text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
      />
    </label>
  );
}
