import type {
  PracticeSession,
} from "@/features/forge/types";

import type {
  ReflectionEntry,
} from "../reflection";

import type {
  ForgePattern,
} from "./pattern.types";

export function detectReflectionPatterns(
  reflections: ReflectionEntry[],
): ForgePattern[] {
  const patterns: ForgePattern[] = [];

  const highEnergyCount =
    reflections.filter(
      (reflection) =>
        reflection.energy === "high",
    ).length;

  if (highEnergyCount >= 3) {
    patterns.push({
      id: "reflection-high-energy",

      title: "High-energy periods are recurring.",

      description:
        "You have reported high energy repeatedly across recent reflections.",

      confidence:
        confidenceFromCount(
          highEnergyCount,
        ),

      evidenceCount:
        highEnergyCount,

      recommendation:
        "Protect high-energy periods for demanding or creative practice.",
    });
  }

  const highStressCount =
    reflections.filter(
      (reflection) =>
        reflection.stress === "high",
    ).length;

  if (highStressCount >= 3) {
    patterns.push({
      id: "reflection-high-stress",

      title: "High stress is recurring.",

      description:
        "High stress has appeared repeatedly across recent reflections.",

      confidence:
        confidenceFromCount(
          highStressCount,
        ),

      evidenceCount:
        highStressCount,

      recommendation:
        "Reduce unnecessary commitments before increasing your workload.",
    });
  }

  return patterns;
}

export function detectSessionPatterns(
  sessions: PracticeSession[],
): ForgePattern[] {
  const patterns: ForgePattern[] = [];

  if (sessions.length < 3) {
    return patterns;
  }

  const completedCount =
    sessions.filter(
      (session) =>
        session.completed,
    ).length;

  const completionRate =
    Math.round(
      (completedCount /
        sessions.length) *
        100,
    );

  if (completionRate >= 80) {
    patterns.push({
      id: "sessions-high-consistency",

      title: "Strong follow-through is becoming consistent.",

      description:
        `You completed ${completionRate}% of the practices in the current observation period.`,

      confidence:
        confidenceFromCount(
          completedCount,
        ),

      evidenceCount:
        completedCount,

      recommendation:
        "Protect the structure supporting this level of consistency.",
    });
  }

  if (
    completionRate < 50 &&
    sessions.length >= 5
  ) {
    const skippedCount =
      sessions.length -
      completedCount;

    patterns.push({
      id: "sessions-low-follow-through",

      title: "Planned practice is repeatedly being missed.",

      description:
        `Only ${completionRate}% of planned practices were completed in the current observation period.`,

      confidence:
        confidenceFromCount(
          skippedCount,
        ),

      evidenceCount:
        skippedCount,

      recommendation:
        "Reduce the number or difficulty of planned sessions until follow-through improves.",
    });
  }

  return patterns;
}

function confidenceFromCount(
  count: number,
): ForgePattern["confidence"] {
  if (count >= 6) {
    return "high";
  }

  if (count >= 3) {
    return "medium";
  }

  return "low";
}