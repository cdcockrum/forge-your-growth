import type {
  Observation,
} from "../../../communication/observation.types";

import {
  opportunityRules,
} from "../opportunities";

export function buildOpportunities(
  observations: Observation[],
): string[] {
  return opportunityRules
    .filter((rule) =>
      rule.matches(observations),
    )
    .map((rule) =>
      rule.build(observations),
    );
}