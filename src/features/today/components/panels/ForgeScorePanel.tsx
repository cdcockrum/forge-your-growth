import type { ScoreBreakdown } from "@/features/forge-engine";

type ForgeScorePanelProps = {
  score: number;
  breakdown: ScoreBreakdown;
};

export function ForgeScorePanel({
  score,
  breakdown,
}: ForgeScorePanelProps) {
  const items = [
    {
      label: "Consistency",
      value: breakdown.consistency,
    },
    {
      label: "Difficulty",
      value: breakdown.difficulty,
    },
    {
      label: "Duration",
      value: breakdown.duration,
    },
    {
      label: "Reflection",
      value: breakdown.reflection,
    },
    {
      label: "Weekly review",
      value: breakdown.review,
    },
  ].filter((item) => item.value !== 0);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Forge Score
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-5xl font-extrabold tracking-tight">
          {score}
        </p>

        <p className="pb-1 text-right text-xs leading-5 text-muted-foreground">
          This week
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Built through deliberate, consistent practice.
      </p>

      {items.length > 0 && (
        <>
          <div className="my-5 h-px bg-border" />

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">
                  {item.label}
                </span>

                <span className="font-semibold">
                  +{item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}