import type {
  ForgeState,
} from "@/features/forge-engine";

import type {
  MorningBriefingModel,
} from "../types";

function capitalize(
  value: string,
): string {
  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export function buildMorningBriefing(
  forge: ForgeState,
): MorningBriefingModel {
  const dominantTrait =
    forge.traits.dominantTrait;

  const strongestIdentity =
    forge.identity.strongestIdentity;

  const primaryCoachRecommendation =
    forge.coach.recommendations[0];

  const observations = [
    forge.insight.headline,
    strongestIdentity
      ? `${strongestIdentity.identity.name} is currently your strongest developing identity.`
      : null,
    forge.advisor.reasoning[0] ?? null,
  ].filter(
    (
      value,
    ): value is string =>
      Boolean(value),
  );

  return {
    greeting: "Good morning.",

    summary:
      forge.advisor.message,

    metrics: [
      {
        label: "Momentum",
        value:
          forge.momentum.score.toFixed(
            0,
          ),
      },
      {
        label: "Forge Score",
        value:
          forge.forgeScore.score.toFixed(
            0,
          ),
      },
      {
        label: "Completion",
        value: `${Math.round(
          forge.progress.completionRate,
        )}%`,
      },
      {
        label: "Dominant Trait",
        value: dominantTrait
          ? capitalize(
              dominantTrait.trait,
            )
          : "Emerging",
      },
    ],

    observations,

    recommendation:
      primaryCoachRecommendation
        ?.message ??
      forge.insight.recommendation,

    confidence:
      Math.round(
        (
          forge.advisor.confidence +
          forge.insight.confidence
        ) / 2,
      ),
  };
}