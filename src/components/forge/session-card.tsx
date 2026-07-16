import type { PracticeSession, LifeArea, Skill } from "@/features/forge/types";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { toast } from "sonner";

export function SessionCard({
  session,
  skill,
  area,
  compact = false,
}: {
  session: PracticeSession;
  skill?: Skill;
  area?: LifeArea;
  compact?: boolean;
}) {
  const qc = useQueryClient();

  async function toggle() {
    const next = !session.completed;
    const { error } = await supabase
      .from("practice_sessions")
      .update({
        completed: next,
        completed_at: next ? new Date().toISOString() : null,
      })
      .eq("id", session.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["sessions"] });
    if (next) toast.success("Struck.");
  }

  const color = area?.color ?? "#c2410c";

  return (
    <div
      className={`group relative p-4 bg-surface border border-border rounded-xl ring-1 ring-black/[0.02] flex items-center justify-between transition-opacity ${
        session.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col min-w-0 flex-1">
        {area && (
          <span
            className="text-[10px] font-mono uppercase mb-1 tracking-widest"
            style={{ color }}
          >
            {area.name}
            {skill && ` · ${skill.name}`}
          </span>
        )}
        <h3 className={`font-bold ${compact ? "text-base" : "text-lg"} leading-tight truncate`}>
          {session.title}
        </h3>
        <span className="text-xs text-muted-foreground mt-0.5">
          {session.duration_minutes}m · {session.intensity ?? "deliberate"} practice
        </span>
      </div>
      <button
        onClick={toggle}
        aria-label={session.completed ? "Mark incomplete" : "Mark complete"}
        className={`shrink-0 ml-3 size-10 rounded-full border-2 flex items-center justify-center transition-all ${
          session.completed
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border hover:border-accent"
        }`}
      >
        {session.completed && <Check className="size-4" strokeWidth={3} />}
      </button>
    </div>
  );
}
