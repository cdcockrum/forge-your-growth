import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  Scenario,
} from "./simulation.types";

export function generateScenarios(
  _reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): Scenario[] {
  const confidence =
    normalizeConfidence(
      judgment.confidence,
    );

  return [
    {
      id: "best-case",

      title:
        "Positive momentum strengthens",

      description:
        "The current direction continues to strengthen as supportive behavior becomes more consistent.",

      probability:
        confidence,

      projectedConfidence:
        confidence,

      trajectory:
        "accelerating",

      recommendations: [
        "Continue reinforcing the behaviors that support the current direction.",
      ],
    },

    {
      id: "expected-case",

      title:
        "Current direction continues gradually",

      description:
        judgment.summary,

      probability:
        confidence,

      projectedConfidence:
        confidence,

      trajectory:
        determineExpectedTrajectory(
          judgment,
        ),

      recommendations: [
        "Maintain the current direction while continuing to gather evidence.",
      ],
    },

    {
      id: "worst-case",

      title:
        "Progress remains uncertain",

      description:
        reflection.uncertainties[0] ??
        "Current progress may weaken if supportive behavior becomes less consistent.",

      probability:
        1 - confidence,

      projectedConfidence:
        1 - confidence,

      trajectory:
        "declining",

      recommendations: [
        "Watch for interruptions and restore one meaningful practice before momentum declines further.",
      ],
    },
  ];
}

function determineExpectedTrajectory(
  judgment: ExecutiveJudgment,
): Scenario["trajectory"] {
  switch (
    judgment.situation
  ) {
    case "accelerating":
      return "accelerating";

    case "plateauing":
      return "plateau";

    case "recovering":
    case "building":
      return "steady";

    case "uncertain":
    default:
      return "uncertain";
  }
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}