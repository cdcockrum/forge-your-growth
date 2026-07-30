import type {
  Observation,
} from "../../../communication/observation.types";

import {
  themeRules,
} from "../themes";

export function buildTheme(
  observations: Observation[],
): string | null {
  const matchingRule =
    themeRules.find((rule) =>
      rule.matches(observations),
    );

  return (
    matchingRule?.build(observations) ??
    null
  );
}