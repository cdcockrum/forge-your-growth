import {
  Link,
} from "@tanstack/react-router";

import type {
  CoachRecommendation,
  ForgeCoachResult,
} from "@/features/forge-engine";

import {
  ArrowRight,
  BookOpen,
  Heart,
  Sparkles,
  Target,
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

      <p className="mt-2 leading-7 text-muted-foreground">
        {coach.message}
      </p>

      <div className="mt-8 space-y-3">
        {coach.recommendations.map(
          (recommendation) => (
            <Recommendation
              key={recommendation.id}
              recommendation={
                recommendation
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
}: {
  recommendation:
    CoachRecommendation;
}) {
  const Icon =
    icons[
      recommendation.actionType
    ];

  const destination =
    recommendation.actionType ===
    "reflect"
      ? "/review"
      : "/plan";

  return (
    <Link
      to={destination}
      className="group block min-h-20 w-full touch-manipulation rounded-2xl border border-border bg-background p-4 text-left transition-[border-color,background-color,transform] duration-200 hover:border-accent/30 hover:bg-accent/3 active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <div className="flex gap-3">
        <div className="mt-1">
          <Icon className="size-4 text-accent" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {recommendation.title}
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {recommendation.message}
          </p>
        </div>

        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
      </div>
    </Link>
  );
}