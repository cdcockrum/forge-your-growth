type MomentumPanelProps = {
  score: number;
  direction: "rising" | "stable" | "falling";
  consistency: number;
  recovery: number;
  adherence: number;
  burnoutRisk: "low" | "moderate" | "high";
  message: string;
};

export function MomentumPanel({
  score,
  direction,
  consistency,
  recovery,
  adherence,
  burnoutRisk,
  message,
}: MomentumPanelProps) {
  return (
    <section className="rounded-2xl border border-border bg-foreground p-6 text-background">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-background/55">
            Momentum
          </p>

          <p className="mt-3 text-5xl font-extrabold tracking-tight">
            {score}
          </p>
        </div>

        <MomentumDirectionBadge direction={direction} />
      </div>

      <p className="mt-4 text-sm leading-6 text-background/70">
        {message}
      </p>

      <div className="my-5 h-px bg-background/10" />

      <div className="space-y-3">
        <MomentumMetric
          label="Consistency"
          value={consistency}
        />

        <MomentumMetric
          label="Recovery"
          value={recovery}
        />

        <MomentumMetric
          label="Adherence"
          value={adherence}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-background/5 px-3 py-2.5">
        <span className="text-xs text-background/60">
          Burnout risk
        </span>

        <span className="text-xs font-semibold capitalize">
          {burnoutRisk}
        </span>
      </div>
    </section>
  );
}

function MomentumDirectionBadge({
  direction,
}: {
  direction: MomentumPanelProps["direction"];
}) {
  const labels = {
    rising: "↑ Rising",
    stable: "→ Stable",
    falling: "↓ Falling",
  } as const;

  return (
    <span className="rounded-full border border-background/15 bg-background/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-background/75">
      {labels[direction]}
    </span>
  );
}

function MomentumMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const normalizedValue = Math.max(
    0,
    Math.min(100, value),
  );

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-background/60">
          {label}
        </span>

        <span className="font-semibold">
          {normalizedValue}%
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/10">
        <div
          className="h-full rounded-full bg-background transition-[width] duration-500"
          style={{
            width: `${normalizedValue}%`,
          }}
        />
      </div>
    </div>
  );
}