import type { SkillAdaptation } from "@/features/forge-engine";

import { RecommendationCard } from "./RecommendationCard";

type AdaptiveRecommendationsProps = {
  adaptations: SkillAdaptation[];
  applyingSkillId: string | null;
  onApply: (
    adaptation: SkillAdaptation,
  ) => Promise<void>;
};

export function AdaptiveRecommendations({
  adaptations,
  applyingSkillId,
  onApply,
}: AdaptiveRecommendationsProps) {
  const usefulRecommendations = adaptations.filter(
    (adaptation) =>
      adaptation.dayPerformance.length > 0 &&
      adaptation.reasons.length > 0,
  );

  if (usefulRecommendations.length === 0) {
    return (
      <section className="mt-10 rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-10 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          Adaptive planning
        </p>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight">
          Forge is still learning your rhythm.
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Complete and skip practices over several weeks. Forge will
          compare your preferred days with the days that produce the
          strongest follow-through.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <header className="mb-5 max-w-2xl">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          Adaptive planning
        </p>

        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
          Forge recommendations.
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Suggestions based on your demonstrated completion patterns.
          Forge never changes your schedule without your approval.
        </p>
      </header>

      <div className="space-y-3">
        {usefulRecommendations.map((adaptation) => (
          <RecommendationCard
            key={adaptation.skillId}
            adaptation={adaptation}
            applying={
              applyingSkillId === adaptation.skillId
            }
            onApply={() => onApply(adaptation)}
          />
        ))}
      </div>
    </section>
  );
}