import type {
  Observation,
} from "../../communication/observation.types";

import {
  buildOpportunities,
} from "./builders/opportunityBuilder";

import {
  buildPriorities,
} from "./builders/priorityBuilder";

import {
  buildRisks,
} from "./builders/riskBuilder";

import {
  buildSummary,
} from "./builders/summaryBuilder";

import {
  buildTheme,
} from "./builders/themeBuilder";

import type {
  SynthesisResult,
} from "./synthesis.types";

export function synthesize(
  observations: Observation[],
): SynthesisResult {
  const dominantTheme =
    buildTheme(observations);

  const priorities =
    buildPriorities(observations);

  const opportunities =
    buildOpportunities(observations);

  const risks =
    buildRisks(observations);

  const summary =
    buildSummary({
      dominantTheme,
      priorities,
      opportunities,
      risks,
    });

  return {
    dominantTheme,
    priorities,
    opportunities,
    risks,
    summary,
  };
}