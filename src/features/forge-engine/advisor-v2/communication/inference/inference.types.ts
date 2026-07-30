import type {
  DetectedPattern,
} from "../pattern.types";

import type {
  Observation,
} from "../observation.types";

export interface InferenceRule {
  id: string;

  description: string;

  matches(
    patterns: readonly DetectedPattern[],
  ): boolean;

  infer(
    patterns: readonly DetectedPattern[],
  ): Observation;
}