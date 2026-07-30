import type { Observation } from "../observation.types";
import type { Narrative } from "./narrative.types";

export function buildNarrative(
  observations: Observation[],
): Narrative {
  const sorted = [...observations].sort(
    (a, b) => b.importance - a.importance,
  );

  return {
    title: "",

    summary: "",

    observations: sorted,

    priorities: [],

    opportunities: [],

    risks: [],
  };
}