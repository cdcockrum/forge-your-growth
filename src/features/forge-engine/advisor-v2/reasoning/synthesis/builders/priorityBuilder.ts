import type {
  Observation,
} from "../../../communication/observation.types";

import {
  priorityRules,
} from "../priorities";

export function buildPriorities(
  observations: Observation[],
): string[] {
  return priorityRules
    .filter((rule) =>
      rule.matches(observations),
    )
    .map((rule) =>
      rule.build(observations),
    );
}