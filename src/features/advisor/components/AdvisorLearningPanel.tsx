import {
  Brain,
  Sparkles,
  TrendingDown,
  TrendingUp,
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

  const hasEvaluations =
    summary.evaluatedCount > 0;

  const confidenceDirection =
    getConfidenceDirection(
      summary.averageConfidenceAdjustment,
    );

  if (!hasEvaluations) {
    return (
      <section className="rounded-3xl border border-border bg-card p-6">
        <PanelHeader />

        <div className="mt-6 max-w-3xl">
          <h3 className="text-lg font-black tracking-tight">
            Forge is waiting to see what happens next
          </h3>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            You have not completed a recommendation review period yet.
            Once Forge can compare a recommendation with what followed,
            it will begin learning which kinds of guidance are most useful
            for you.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-accent" />

            <div>
              <p className="font-semibold">
                What Forge will examine
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Forge will compare your response, practice follow-through,
                momentum, and progress with the conditions that existed
                when the recommendation was made.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <PanelHeader />

      <div className="mt-6 max-w-3xl">
        <h3 className="text-lg font-black tracking-tight">
          {buildLearningHeadline(
            confidenceDirection,
          )}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {buildLearningSummary(
            summary.evaluatedCount,
            confidenceDirection,
          )}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Recommendations considered"
          value={summary.recommendationCount.toString()}
        />

        <Metric
          label="Outcomes reviewed"
          value={summary.evaluatedCount.toString()}
        />

        <Metric
          label="Accepted"
          value={formatPercentage(
            summary.acceptanceRate,
          )}
        />

        <Metric
          label="Helpful outcomes"
          value={formatPercentage(
            summary.successRate,
          )}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background p-5">
        <div className="flex items-center gap-2">
          <ConfidenceTrendIcon
            direction={confidenceDirection}
          />

          <p className="font-semibold">
            How Forge’s confidence changed
          </p>
        </div>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {buildConfidenceExplanation(
            summary.averageConfidenceAdjustment,
            confidenceDirection,
          )}
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-accent/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-accent" />

          <p className="font-semibold">
            What this means
          </p>
        </div>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {buildAssessment(
            confidenceDirection,
          )}
        </p>
      </div>
    </section>
  );
}

function PanelHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10">
        <Brain className="size-6 text-accent" />
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Adaptive Learning
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight">
          What Forge is learning from experience
        </h2>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

type ConfidenceDirection =
  | "strengthening"
  | "weakening"
  | "unchanged";

function ConfidenceTrendIcon({
  direction,
}: {
  direction: ConfidenceDirection;
}) {
  if (
    direction === "strengthening"
  ) {
    return (
      <TrendingUp className="size-5 text-green-600" />
    );
  }

  if (
    direction === "weakening"
  ) {
    return (
      <TrendingDown className="size-5 text-amber-600" />
    );
  }

  return (
    <Brain className="size-5 text-accent" />
  );
}

function getConfidenceDirection(
  adjustment: number,
): ConfidenceDirection {
  if (adjustment > 0.005) {
    return "strengthening";
  }

  if (adjustment < -0.005) {
    return "weakening";
  }

  return "unchanged";
}

function buildLearningHeadline(
  direction: ConfidenceDirection,
): string {
  switch (direction) {
    case "strengthening":
      return "Some recommendations are earning greater trust";

    case "weakening":
      return "Recent outcomes are challenging Forge’s assumptions";

    case "unchanged":
    default:
      return "Forge is learning, but the picture remains mixed";
  }
}

function buildLearningSummary(
  evaluatedCount: number,
  direction: ConfidenceDirection,
): string {
  const outcomeLabel =
    evaluatedCount === 1
      ? "outcome"
      : "outcomes";

  switch (direction) {
    case "strengthening":
      return `Across ${evaluatedCount} reviewed ${outcomeLabel}, your results have generally supported the guidance Forge provided.`;

    case "weakening":
      return `Across ${evaluatedCount} reviewed ${outcomeLabel}, your results have not consistently supported Forge’s earlier guidance.`;

    case "unchanged":
    default:
      return `Forge has reviewed ${evaluatedCount} ${outcomeLabel}, but the evidence is not yet consistent enough to justify a meaningful confidence change.`;
  }
}

function buildConfidenceExplanation(
  adjustment: number,
  direction: ConfidenceDirection,
): string {
  const percentage =
    Math.abs(
      Math.round(
        adjustment * 100,
      ),
    );

  switch (direction) {
    case "strengthening":
      return `Confidence increased by an average of ${percentage}% after Forge compared its recommendations with what actually happened.`;

    case "weakening":
      return `Confidence decreased by an average of ${percentage}%. Forge will treat similar recommendations more cautiously until stronger evidence appears.`;

    case "unchanged":
    default:
      return "Confidence has remained essentially unchanged. The outcomes observed so far do not clearly favor either strengthening or revising the current approach.";
  }
}

function buildAssessment(
  direction: ConfidenceDirection,
): string {
  switch (direction) {
    case "strengthening":
      return "The current approach appears useful, but Forge will continue testing it rather than treating early success as proof.";

    case "weakening":
      return "This is useful disagreement. Forge should revise its guidance when your lived results do not support its assumptions.";

    case "unchanged":
    default:
      return "Forge is preserving uncertainty for now. More completed recommendation cycles are needed before it can distinguish a durable pattern from ordinary variation.";
  }
}

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    normalizeScore(value) * 100,
  )}%`;
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}