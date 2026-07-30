import type { Observation } from "../../observation.types";
import type { InferenceRule } from "../inference.types";

import {
  averageConfidence,
  getPattern,
  hasPattern,
  maxImportance,
  mergeEvidence,
} from "../ruleHelpers";

export const compoundingRule: InferenceRule = {
  id: "compounding",

  description:
    "Consistent practice is reinforcing long-term direction.",

  matches(patterns) {
    return (
      hasPattern(patterns, "practice_compounding") &&
      hasPattern(patterns, "vision_alignment")
    );
  },

  infer(patterns): Observation {
    const practice = getPattern(
      patterns,
      "practice_compounding",
    )!;

    const alignment = getPattern(
      patterns,
      "vision_alignment",
    )!;

    return {
      id: "compounding",

      pattern: "practice_compounding",

      interpretation:
        "Consistent practice is beginning to reinforce your long-term direction.",

      evidence: mergeEvidence(
        practice,
        alignment,
      ),

      implications: [
        "Small, repeated actions are beginning to accumulate into meaningful progress.",
      ],

      recommendations: [
        "Maintain consistency. Avoid unnecessary changes while momentum is building.",
      ],

      confidence: averageConfidence(
        practice,
        alignment,
      ),

      importance: maxImportance(
        practice,
        alignment,
      ),
    };
  },
};