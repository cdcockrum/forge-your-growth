import type {
  DetectedPattern,
} from "../../pattern.types";

import type {
  Observation,
} from "../../observation.types";

import type {
  InferenceRule,
} from "../inference.types";

const hasPattern = (
  patterns: readonly DetectedPattern[],
  id: DetectedPattern["id"],
): boolean =>
  patterns.some(
    (pattern) => pattern.id === id,
  );

const getPattern = (
  patterns: readonly DetectedPattern[],
  id: DetectedPattern["id"],
): DetectedPattern | undefined =>
  patterns.find(
    (pattern) => pattern.id === id,
  );

export const interruptionRule: InferenceRule = {
  id: "interruption",

  description:
    "Momentum has slowed while the broader direction remains stable.",

  matches(patterns) {
    return (
      hasPattern(
        patterns,
        "momentum_slowing",
      ) &&
      hasPattern(
        patterns,
        "direction_stable",
      )
    );
  },

  infer(patterns): Observation {
    const momentum = getPattern(
      patterns,
      "momentum_slowing",
    )!;

    const direction = getPattern(
      patterns,
      "direction_stable",
    )!;

    return {
      id: "interruption",

      pattern: "momentum_slowing",

      interpretation:
        "Recent consistency has weakened while the broader direction remains stable.",

      evidence: [
        ...momentum.evidence,
        ...direction.evidence,
      ],

      implications: [
        "The available evidence is more consistent with an interruption than a change in direction.",
      ],

      recommendations: [
        "Focus on restoring a repeatable rhythm before increasing effort.",
      ],

      confidence:
        (momentum.confidence +
          direction.confidence) /
        2,

      importance: Math.max(
        momentum.importance,
        direction.importance,
      ),
    };
  },
};