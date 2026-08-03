import {
  BrainCircuit,
  CircleDot,
  GitBranch,
  Network,
  TriangleAlert,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type ReasoningOverviewCardProps = {
  evidenceCount: number;

  graphNodeCount: number;

  graphEdgeCount: number;

  hypothesisCount: number;

  contradictionCount: number;

  gapCount: number;

  assumptionCount: number;

  uncertaintyCount: number;

  interpretationConfidence: number;

  consistencyScore: number;

  strongestHypothesis:
    | string
    | null;

  strongestInterpretation:
    | string
    | null;
};

export function ReasoningOverviewCard({
  evidenceCount,
  graphNodeCount,
  graphEdgeCount,
  hypothesisCount,
  contradictionCount,
  gapCount,
  assumptionCount,
  uncertaintyCount,
  interpretationConfidence,
  consistencyScore,
  strongestHypothesis,
  strongestInterpretation,
}: ReasoningOverviewCardProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-border bg-background p-3">
          <Network className="size-5 text-accent" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Reasoning Overview
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            How Forge reached its conclusion
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {strongestInterpretation ??
              "Forge is still gathering enough evidence to form a clear interpretation."}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReasoningMetric
          icon={CircleDot}
          label="Evidence collected"
          value={String(
            evidenceCount,
          )}
        />

        <ReasoningMetric
          icon={Network}
          label="Graph structure"
          value={`${graphNodeCount} nodes · ${graphEdgeCount} links`}
        />

        <ReasoningMetric
          icon={GitBranch}
          label="Hypotheses"
          value={String(
            hypothesisCount,
          )}
        />

        <ReasoningMetric
          icon={BrainCircuit}
          label="Interpretation confidence"
          value={formatPercentage(
            interpretationConfidence,
          )}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReasoningMetric
          icon={TriangleAlert}
          label="Contradictions"
          value={String(
            contradictionCount,
          )}
        />

        <ReasoningMetric
          icon={TriangleAlert}
          label="Evidence gaps"
          value={String(
            gapCount,
          )}
        />

        <ReasoningMetric
          icon={BrainCircuit}
          label="Assumptions"
          value={String(
            assumptionCount,
          )}
        />

        <ReasoningMetric
          icon={TriangleAlert}
          label="Uncertainties"
          value={String(
            uncertaintyCount,
          )}
        />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Strongest hypothesis
          </p>

          <p className="mt-3 text-sm font-semibold leading-6">
            {strongestHypothesis ??
              "No dominant hypothesis has emerged yet."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Reasoning consistency
          </p>

          <p className="mt-3 text-2xl font-black tracking-tight">
            {formatPercentage(
              consistencyScore,
            )}
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {describeConsistency(
              consistencyScore,
            )}
          </p>
        </div>
      </section>
    </ForgeCard>
  );
}

function ReasoningMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Network;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-accent" />

        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-3 text-lg font-black tracking-tight">
        {value}
      </p>
    </div>
  );
}

function formatPercentage(
  value: number,
): string {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return `${Math.round(
    Math.max(
      0,
      Math.min(
        normalized,
        1,
      ),
    ) * 100,
  )}%`;
}

function describeConsistency(
  value: number,
): string {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  if (normalized >= 0.8) {
    return "The available evidence and hypotheses are largely aligned.";
  }

  if (normalized >= 0.5) {
    return "The reasoning is moderately consistent, though meaningful tension remains.";
  }

  return "The current reasoning contains substantial uncertainty or conflicting evidence.";
}