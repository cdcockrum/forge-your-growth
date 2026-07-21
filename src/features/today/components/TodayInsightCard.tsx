import { ForgeCard } from "@/components/forge";

import type {
  ForgeInsight,
} from "@/features/forge-engine";

type TodayInsightCardProps = {
  insight: ForgeInsight;
};

export function TodayInsightCard({
  insight,
}: TodayInsightCardProps) {
  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Today’s insight
      </p>

      <h2 className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
        {insight.headline}
      </h2>

      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
        {insight.summary}
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-background p-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          What matters now
        </p>

        <p className="mt-3 text-base font-bold leading-7">
          {insight.recommendation}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          Insight confidence
        </span>

        <span className="font-mono text-xs font-bold">
          {insight.confidence}%
        </span>
      </div>
    </ForgeCard>
  );
}