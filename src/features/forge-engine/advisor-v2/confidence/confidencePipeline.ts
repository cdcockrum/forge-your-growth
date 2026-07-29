import type {
  ReasoningResult,
} from "../reasoning/reasoning.types";

import type {
  ConfidenceResult,
} from "./confidence.types";

import {
  calculateConfidence,
} from "./confidenceCalculator";

export function runConfidencePipeline(
  reasoning: ReasoningResult,
  now: Date = new Date(),
): ConfidenceResult {
  return calculateConfidence(
    reasoning,
    now,
  );
}