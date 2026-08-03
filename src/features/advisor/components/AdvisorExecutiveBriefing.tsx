import {
  ArrowRight,
  BrainCircuit,
} from "lucide-react";

import {
  ConfidenceBadge,
  HeroCard,
  StatusBadge,
} from "@/components/forge/forge-ui";

type AdvisorExecutiveBriefingProps = {
  greeting: string;

  summary: string;

  recommendation: {
    title: string;

    explanation: string;

    priority:
      | "low"
      | "medium"
      | "high";

    confidence: number;
  };

  action?: React.ReactNode;
};

export function AdvisorExecutiveBriefing({
  greeting,
  summary,
  recommendation,
  action,
}: AdvisorExecutiveBriefingProps) {
  return (
    <HeroCard
      eyebrow="Executive Briefing"
      icon={BrainCircuit}
      title={greeting}
      description={
        <p>
          {summary}
        </p>
      }
      aside={
        <div className="rounded-3xl border border-border bg-background/80 p-5 backdrop-blur-sm">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Current assessment
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <ConfidenceBadge
              value={
                recommendation.confidence
              }
            />

            <StatusBadge
              label={
                recommendation.priority
              }
              tone={priorityTone(
                recommendation.priority,
              )}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            Forge updates this briefing as new
            evidence, practice, and reflection become
            available.
          </p>

          {action}
        </div>
      }
    >
      <section className="rounded-3xl border border-border bg-background/75 p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Primary recommendation
        </p>

        <h2 className="mt-3 max-w-3xl text-pretty text-2xl font-black tracking-tight sm:text-3xl">
          {recommendation.title}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          {recommendation.explanation}
        </p>

        {action && (
          <div className="mt-6 sm:hidden">
            {action}
          </div>
        )}

        {!action && (
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-foreground">
            <span>
              Review the supporting guidance below
            </span>

            <ArrowRight
              aria-hidden="true"
              className="size-4 text-accent"
            />
          </div>
        )}
      </section>
    </HeroCard>
  );
}

function priorityTone(
  priority:
    AdvisorExecutiveBriefingProps[
      "recommendation"
    ][
      "priority"
    ],
):
  | "neutral"
  | "informational"
  | "warning"
  | "critical" {
  switch (priority) {
    case "high":
      return "warning";

    case "medium":
      return "informational";

    case "low":
    default:
      return "neutral";
  }
}
