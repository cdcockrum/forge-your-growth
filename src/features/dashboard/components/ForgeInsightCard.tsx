type ForgeInsightCardProps = {
  headline: string;
  summary: string;
  recommendation: string;
  confidence: number;
};

export function ForgeInsightCard({
  headline,
  summary,
  recommendation,
  confidence,
}: ForgeInsightCardProps) {
  return (
    <section className="mt-10 animate-reveal">
      <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Today's Insight
        </p>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          {headline}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
          {summary}
        </p>

        <div className="mt-7 rounded-2xl border border-border bg-background p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Recommended Focus
          </p>

          <p className="mt-3 text-lg font-bold leading-7">
            {recommendation}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
          <span className="text-xs text-muted-foreground">
            Insight confidence
          </span>

          <span className="font-mono text-xs font-bold">
            {confidence}%
          </span>
        </div>
      </div>
    </section>
  );
}