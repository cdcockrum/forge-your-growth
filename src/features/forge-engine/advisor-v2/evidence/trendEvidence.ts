import type {
  PracticeTrendAnalysis,
} from "../../trends";

import type {
  AdvisorEvidence,
} from "../advisor.types";

export function buildTrendEvidence(
  trend: PracticeTrendAnalysis | null,
): AdvisorEvidence[] {
  if (!trend) {
    return [];
  }

  return [
    {
      id: "trend-direction",

      category: "trend",

      source: "overallDirection",

      statement:
        `Overall trend is ${trend.overallDirection}.`,

      confidence:
        trend.confidence / 100,

      impact: 0.9,

      polarity:
        trend.overallDirection === "improving"
          ? "positive"
          : trend.overallDirection === "declining"
          ? "negative"
          : "neutral",

      tags: [
        "trend",
        "consistency",
      ],
    },
  ];
}