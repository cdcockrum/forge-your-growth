import type { Observation } from "../../observation.types";
import type { DetectedPattern } from "../../pattern.types";

import type { InferenceRule } from "../inference.types";

import {
  averageConfidence,
  getPattern,
  hasPattern,
  maxImportance,
  mergeEvidence,
} from "../ruleHelpers";

export const alignmentRule: InferenceRule = {
  id: "alignment",

  description:
    "Current behavior supports the user's stated long-term direction.",

  matches(patterns) {
    return hasPattern(
      patterns,
      "vision_alignment",
    );
  },

  infer(patterns): Observation {
    const alignment = getPattern(
      patterns,
      "vision_alignment",
    )!;

    return {
      id: "alignment",

      pattern: "vision_alignment",

      interpretation:
        "Recent actions are consistent with your long-term direction.",

      evidence: mergeEvidence(
        alignment,
      ),

      implications: [
        "Your recent behavior reinforces your stated vision.",
      ],

      recommendations: [
        "Continue reinforcing these behaviors through repetition.",
      ],

      confidence: averageConfidence(
        alignment,
      ),

      importance: maxImportance(
        alignment,
      ),
    };
  },
};