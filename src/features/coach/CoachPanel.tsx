import type {
  ForgeCoachResult,
  CoachRecommendation,
} from "@/features/forge-engine";

import {
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  BookOpen,
  Wrench,
} from "lucide-react";

const icons = {
  practice: Target,
  adjust_plan: Wrench,
  recover: Heart,
  reflect: BookOpen,
  maintain: Sparkles,
};

type CoachPanelProps = {
  coach: ForgeCoachResult;

  onRecommendationAction?: (
    recommendation: CoachRecommendation,
  ) => void;
};

export function CoachPanel({
  coach,
  onRecommendationAction,
}: CoachPanelProps) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-accent" />

        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Forge Coach
        </p>
      </div>

      <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
        {coach.headline}
      </h2>

      <p className="mt-2 leading-7 text-muted-foreground">
        {coach.message}
      </p>

      <div className="mt-8 space-y-3">
        {coach.recommendations.map(
          (item) => (
            <Recommendation
              key={item.id}
              recommendation={item}
              onAction={
                onRecommendationAction
              }
            />
          ),
        )}
      </div>
    </section>
  );
}

function Recommendation({
  recommendation,
  onAction,
}: {
  recommendation:
    CoachRecommendation;

  onAction?: (
    recommendation:
      CoachRecommendation,
  ) => void;
}) {
  const Icon =
    icons[
      recommendation.actionType
    ];

  const content = (
    <div className="flex gap-3">
      <div className="mt-1">
        <Icon className="size-4 text-accent" />
      </div>

      <div className="min-w-0 flex-1 text-left">
        <p className="font-semibold">
          {recommendation.title}
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {recommendation.message}
        </p>
      </div>

      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
    </div>
  );

  if (!onAction) {
    return (
      <div className="rounded-2xl border border-border bg-background p-4">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        onAction(
          recommendation,
        )
      }
      className="group w-full rounded-2xl border border-border bg-background p-4 text-left transition-[border-color,background-color,transform] duration-200 hover:border-accent/30 hover:bg-accent/[0.03] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      {content}
    </button>
  );
}