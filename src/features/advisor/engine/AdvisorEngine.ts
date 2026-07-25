import {
  buildInsights,
} from "./AdvisorRules";

import type {
  AdvisorSummary,
} from "./advisor.types";

/**
 * Returns an appropriate greeting based on the user's local time.
 */
function greeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning.";
  }

  if (hour < 18) {
    return "Good afternoon.";
  }

  return "Good evening.";
}

export function buildAdvisorSummary(): AdvisorSummary {
  const insights = buildInsights();

  return {
    greeting: greeting(),

    overview:
      "Forge has analyzed your recent activity and identified several meaningful patterns.",

    insights,

    recommendations: [
      {
        id: "writing",

        title: "Schedule writing earlier.",

        description:
          "Morning sessions have consistently produced higher completion.",

        reason:
          "Completion increases before noon.",

        impact: "high",

        effort: "low",
      },
    ],
  };
}