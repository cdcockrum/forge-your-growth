import {
  Brain,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";

import type {
  AdvisorAdaptiveLearning,
} from "@/features/forge-engine/advisor-v2";

type AdvisorLearningPanelProps = {
  learning: AdvisorAdaptiveLearning;
};

export function AdvisorLearningPanel({
  learning,
}: AdvisorLearningPanelProps) {
  const {
    summary,
  } = learning;

  const improving =
    summary.averageConfidenceAdjustment >= 0;

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10">
          <Brain className="size-6 text-accent" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Adaptive Learning
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight">
            Forge is learning
          </h2>
        </div>
      </div>

      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        {
          improving
            ? "Recent outcomes have strengthened Forge's confidence in its recommendations."
            : "Recent outcomes suggest several recommendations need further evidence before Forge becomes more confident."
        }
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Metric
          label="Acceptance Rate"
          value={`${Math.round(summary.acceptanceRate * 100)}%`}
        />

        <Metric
          label="Success Rate"
          value={`${Math.round(summary.successRate * 100)}%`}
        />

        <Metric
          label="Evaluated"
          value={summary.evaluatedCount.toString()}
        />

        <Metric
          label="Average Outcome"
          value={`${Math.round(summary.averageOutcomeScore * 100)}%`}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center gap-2">
          {improving ? (
            <TrendingUp className="size-5 text-green-600" />
          ) : (
            <TrendingDown className="size-5 text-amber-600" />
          )}

          <p className="font-semibold">
            Confidence Trend
          </p>
        </div>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Forge's recommendation confidence has{" "}
          {improving
            ? "improved"
            : "declined"}{" "}
          by{" "}
          <strong>
            {Math.abs(
              Math.round(
                summary.averageConfidenceAdjustment *
                  100,
              ),
            )}
            %
          </strong>{" "}
          based on observed outcomes.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-accent/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-accent" />

          <p className="font-semibold">
            Forge's Assessment
          </p>
        </div>

        <p className="mt-3 leading-7 text-sm">
          {
            improving
              ? "The evidence collected so far supports Forge's current coaching approach. Recommendations are becoming increasingly reliable as more observations are gathered."
              : "Forge is still calibrating. Additional observations will improve recommendation quality and reduce uncertainty."
          }
        </p>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}:{
  label:string;

  value:string;
}){

  return(
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}