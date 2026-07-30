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

export const recoveryRule: InferenceRule = {
  id: "recovery",

  description:
    "Momentum is strengthening after a previous interruption.",

  matches(patterns) {
    return (
      hasPattern(
        patterns,
        "recovery_beginning",
      ) &&
      hasPattern(
        patterns,
        "direction_stable",
      )
    );
  },

  infer(patterns): Observation {
    const recovery = getPattern(
      patterns,
      "recovery_beginning",
    )!;

    const direction = getPattern(
      patterns,
      "direction_stable",
    )!;

    return {
      id: "recovery",

      pattern: "recovery_beginning",

      interpretation:
        "Recent evidence suggests that consistency is beginning to return while the broader direction remains stable.",

      evidence: [
        ...recovery.evidence,
        ...direction.evidence,
      ],

      implications: [
        "The interruption may have been temporary rather than a change in long-term direction.",
      ],

      recommendations: [
        "Protect the current rhythm before increasing difficulty or volume.",
      ],

      confidence:
        (recovery.confidence +
          direction.confidence) / 2,

      importance: Math.max(
        recovery.importance,
        direction.importance,
      ),
    };
  },
};