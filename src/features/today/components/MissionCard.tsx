import { useState } from "react";

import { ForgeCard } from "@/components/forge";
import type { PracticeSession } from "@/features/forge/types";

type MissionCardProps = {
  sessions: PracticeSession[];
};

export function MissionCard({
  sessions,
}: MissionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const totalMinutes = sessions.reduce(
    (sum, session) =>
      sum + (session.duration_minutes ?? 0),
    0,
  );

  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Today's Mission
      </p>

      <h2 className="mt-3 text-3xl font-black">
        {sessions.length} meaningful
        {sessions.length === 1
          ? " practice"
          : " practices"}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Estimated time • {totalMinutes} minutes
      </p>

      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="mt-6 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:opacity-90"
      >
        {expanded
          ? "Hide Mission"
          : "Begin Mission"}
      </button>

      {expanded && (
        <div className="mt-6 space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 rounded-xl border border-border p-4"
            >
              <input
                type="checkbox"
                checked={session.completed}
                readOnly
              />

              <div>
                <p className="font-semibold">
                  {session.title}
                </p>

                <p className="text-xs text-muted-foreground">
                  {session.duration_minutes ?? 0}
                  {" "}minutes
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ForgeCard>
  );
}