import type { ProgressInsight } from "@/features/forge-engine";

type ForgeNoticesProps = {
  insights: ProgressInsight[];
};

export function ForgeNotices({
  insights,
}: ForgeNoticesProps) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-foreground p-6 text-background">
      <header className="max-w-2xl">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-background/55">
          What Forge notices
        </p>

        <h2 className="mt-2 text-xl font-extrabold tracking-tight">
          Patterns worth paying attention to.
        </h2>

        <p className="mt-2 text-sm leading-6 text-background/65">
          These observations come from your completed practices,
          consistency, streaks, and distribution of attention.
        </p>
      </header>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {insights.length === 0 ? (
          <p className="text-sm leading-6 text-background/65">
            Complete a few practices and Forge will begin surfacing
            useful patterns.
          </p>
        ) : (
          insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
            />
          ))
        )}
      </div>
    </section>
  );
}

function InsightCard({
  insight,
}: {
  insight: ProgressInsight;
}) {
  const toneStyles = {
    positive: {
      marker: "bg-emerald-400",
      label: "Momentum",
    },
    attention: {
      marker: "bg-amber-400",
      label: "Attention",
    },
    neutral: {
      marker: "bg-background/45",
      label: "Observation",
    },
  } as const;

  const style = toneStyles[insight.tone];

  return (
    <article className="rounded-xl border border-background/10 bg-background/5 p-5">
      <div className="flex items-center gap-2">
        <span
          className={`size-2 rounded-full ${style.marker}`}
        />

        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-background/50">
          {style.label}
        </p>
      </div>

      <h3 className="mt-3 text-base font-extrabold tracking-tight">
        {insight.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-background/65">
        {insight.description}
      </p>
    </article>
  );
}