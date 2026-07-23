import type {
  MorningBriefingModel,
} from "../types";

import {
  BriefingCard,
} from "./BriefingCard";

import {
  MetricChip,
} from "./MetricChip";



type MorningBriefingProps = {
  briefing: MorningBriefingModel;
};


export function MorningBriefing({
  briefing,
}: MorningBriefingProps) {
  return (
    <section className="overflow-hidden rounded-3xl border bg-card">
      <div className="border-b bg-muted/30 px-5 py-7 sm:px-8 sm:py-9">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Morning Briefing
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {briefing.greeting}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {briefing.summary}
        </p>
      </div>

      <div className="space-y-6 p-5 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {briefing.metrics.map(
            (metric) => (
              <MetricChip
                key={metric.label}
                metric={metric}
              />
            ),
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <BriefingCard eyebrow="What Forge noticed">
            {briefing.observations.length > 0 ? (
              <div className="space-y-3">
                {briefing.observations.map(
                  (observation) => (
                    <p
                      key={observation}
                      className="leading-relaxed"
                    >
                      {observation}
                    </p>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Forge is still gathering enough evidence to identify meaningful changes.
              </p>
            )}
          </BriefingCard>

          <BriefingCard eyebrow="Recommendation">
            <p className="text-lg font-medium leading-relaxed">
              {briefing.recommendation}
            </p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Confidence</span>
                <span>
                  {briefing.confidence}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        100,
                        briefing.confidence,
                      ),
                    )}%`,
                  }}
                />
              </div>
            </div>
          </BriefingCard>
        </div>
      </div>
    </section>
  );
}