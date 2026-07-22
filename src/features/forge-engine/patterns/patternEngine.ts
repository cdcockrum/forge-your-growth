import type {
  PracticeSession,
} from "@/features/forge/types";

import type {
  ReflectionEntry,
} from "../reflection";

import type {
  ForgePattern,
  PatternSummary,
} from "./pattern.types";

export function buildPatternSummary(
  reflections: ReflectionEntry[],
  sessions: PracticeSession[],
): PatternSummary {

  const patterns: ForgePattern[] = [];

  const highEnergy =
    reflections.filter(
      r => r.energy === "high",
    );

  if (highEnergy.length >= 3) {

    patterns.push({
      id: "high-energy",

      title:
        "High Energy Days",

      description:
        "High energy has appeared repeatedly.",

      confidence:
        highEnergy.length >= 6
          ? "high"
          : "medium",

      evidenceCount:
        highEnergy.length,

      recommendation:
        "Schedule creative work during high-energy periods.",
    });

  }

  const highStress =
    reflections.filter(
      r => r.stress === "high",
    );

  if (highStress.length >= 3) {

    patterns.push({
      id: "high-stress",

      title:
        "High Stress",

      description:
        "Stress has appeared consistently.",

      confidence:
        highStress.length >= 6
          ? "high"
          : "medium",

      evidenceCount:
        highStress.length,

      recommendation:
        "Reduce unnecessary commitments before increasing workload.",
    });

  }

  return {

    patterns,

    strongestPattern:
      patterns[0] ?? null,

  };

}