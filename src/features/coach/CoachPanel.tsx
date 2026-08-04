import {
  useNavigate,
} from "@tanstack/react-router";

import type {
  CoachRecommendation,
  ForgeCoachResult,
} from "@/features/forge-engine";

import {
  ActionCard,
} from "@/components/forge/forge-ui";

import {
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
  const navigate =
    useNavigate();

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

      <div className="mt-8 space-y-4">
        {coach.recommendations.map(
          (recommendation) => {
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
              <ActionCard
                key={
                  recommendation.id
                }
                eyebrow="Forge Recommendation"
                title={
                  recommendation.title
                }
                description={
                  recommendation.message
                }
                icon={
                  Icon
                }
                actionLabel={
                  actionLabelFor(
                    recommendation,
                  )
                }
                onAction={() => {
                  void navigate({
                    to:
                      destination,
                  });
                }}
              />
            );
          },
        )}
      </div>
    </section>
  );
}

function actionLabelFor(
  recommendation: CoachRecommendation,
): string {
  switch (recommendation.actionType) {
    case "practice":
    case "adjust_plan":
      return "Create Your Rhythm";

    case "recover":
      return "Review Recovery";

    case "reflect":
      return "Open Reflection";

    case "maintain":
      return "Continue Your Rhythm";

    default:
      return "Open";
  }
}