import type {
  Vision,
} from "@/features/vision";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function cleanValues(
  values: string[],
): string[] {
  return values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function buildVisionEvidence(
  vision: Vision | null,
): AdvisorEvidence[] {
  if (!vision) {
    return [];
  }

  const evidence: AdvisorEvidence[] = [];

  const mission = vision.mission.trim();

  if (mission.length > 0) {
    evidence.push({
      id: `vision-${vision.id}-mission`,
      category: "vision",
      source: "mission",
      statement:
        `The user's stated mission is: ${mission}`,
      confidence: 1,
      impact: 1,
      polarity: "positive",
      tags: [
        "vision",
        "mission",
        "declared-intent",
      ],
    });
  }

  const northStar =
    vision.north_star.trim();

  if (northStar.length > 0) {
    evidence.push({
      id: `vision-${vision.id}-north-star`,
      category: "vision",
      source: "north_star",
      statement:
        `The user's stated north star is: ${northStar}`,
      confidence: 1,
      impact: 1,
      polarity: "positive",
      tags: [
        "vision",
        "north-star",
        "direction",
        "declared-intent",
      ],
    });
  }

  const coreValues =
    cleanValues(
      vision.core_values,
    );

  if (coreValues.length > 0) {
    evidence.push({
      id: `vision-${vision.id}-core-values`,
      category: "vision",
      source: "core_values",
      statement:
        `The user's stated core values are: ${coreValues.join(
          ", ",
        )}.`,
      confidence: 1,
      impact: 0.95,
      polarity: "positive",
      tags: [
        "vision",
        "values",
        "principles",
        "declared-intent",
      ],
    });
  }

  const identities =
    cleanValues(
      vision.identities,
    );

  if (identities.length > 0) {
    evidence.push({
      id: `vision-${vision.id}-identities`,
      category: "vision",
      source: "identities",
      statement:
        `The identities the user intends to develop are: ${identities.join(
          ", ",
        )}.`,
      confidence: 1,
      impact: 0.95,
      polarity: "positive",
      tags: [
        "vision",
        "identity",
        "aspiration",
        "declared-intent",
      ],
    });
  }

  const themes =
    cleanValues(
      vision.themes,
    );

  if (themes.length > 0) {
    evidence.push({
      id: `vision-${vision.id}-themes`,
      category: "vision",
      source: "themes",
      statement:
        `The user's current vision themes are: ${themes.join(
          ", ",
        )}.`,
      confidence: 1,
      impact: 0.85,
      polarity: "positive",
      tags: [
        "vision",
        "themes",
        "priorities",
        "declared-intent",
      ],
    });
  }

  return evidence;
}