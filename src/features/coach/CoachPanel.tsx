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

export function CoachPanel({
  coach,
}: {
  coach: ForgeCoachResult;
}) {
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

      <p className="mt-2 text-muted-foreground leading-7">
        {coach.summary}
      </p>

      <div className="mt-8 space-y-3">
        {coach.recommendations.map((item) => (
          <Recommendation
            key={item.id}
            recommendation={item}
          />
        ))}
      </div>
    </section>
  );
}

function Recommendation({
  recommendation,
}: {
  recommendation: CoachRecommendation;
}) {
  const Icon =
    icons[recommendation.actionType];

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex gap-3">
        <div className="mt-1">
          <Icon className="size-4 text-accent" />
        </div>

        <div className="flex-1">
          <p className="font-semibold">
            {recommendation.title}
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {recommendation.description}
          </p>
        </div>

        <ArrowRight className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}