import { ProgressRing } from "@/features/today/components/ProgressRing";

type ProgressPanelProps = {
  todayCompleted: number;
  todayTotal: number;
  todayPercentage: number;
  weekCompleted: number;
  weekTotal: number;
};

export function ProgressPanel({
  todayCompleted,
  todayTotal,
  todayPercentage,
  weekCompleted,
  weekTotal,
}: ProgressPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Today
      </p>

      <div className="mt-5">
        <ProgressRing value={todayPercentage} />
      </div>

      <p className="mt-5 text-sm font-semibold">
        {todayTotal === 0
          ? "No practices scheduled"
          : `${todayCompleted} of ${todayTotal} complete`}
      </p>

      <div className="my-5 h-px bg-border" />

      <div className="flex items-center justify-between gap-4 text-left">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            This week
          </p>

          <p className="mt-1 text-lg font-extrabold tracking-tight">
            {weekCompleted}/{weekTotal}
          </p>
        </div>

        <p className="text-right text-xs leading-5 text-muted-foreground">
          Intentional repetitions
          <br />
          completed this week
        </p>
      </div>
    </section>
  );
}