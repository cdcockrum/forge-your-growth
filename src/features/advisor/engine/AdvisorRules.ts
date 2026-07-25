import type {
  AdvisorInsight,
} from "./advisor.types";

export function buildInsights(): AdvisorInsight[] {
  return [
    {
      id: "creative-growth",

      type: "success",

      title:
        "Creative momentum is improving.",

      description:
        "Creative practice has become one of your strongest recurring behaviors.",

      confidence: 0.92,

      evidence: [
        "Writing",
        "Painting",
        "Reflection",
      ],

      priority: 90,
    },

    {
      id: "health-drop",

      type: "warning",

      title:
        "Health routines are slipping.",

      description:
        "Physical activity has declined over the past week.",

      confidence: 0.81,

      evidence: [
        "Workout frequency",
        "Recovery",
      ],

      priority: 75,
    },
  ];
}