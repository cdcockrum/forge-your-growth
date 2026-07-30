import type {
  DetectedPattern,
} from "../pattern.types";

import type {
  Observation,
} from "../observation.types";

import type {
  InferenceRule,
} from "./inference.types";

import {
  inferenceRules,
} from "./rules";

export function inferObservations(
  patterns: readonly DetectedPattern[],
): Observation[] {
  return inferenceRules
    .filter((rule) => rule.matches(patterns))
    .map((rule) => rule.infer(patterns))
    .sort(
      (a, b) =>
        b.importance - a.importance,
    );
}