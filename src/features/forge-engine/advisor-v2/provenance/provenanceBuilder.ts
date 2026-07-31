// src/features/forge-engine/advisor-v2/provenance/provenancePipeline.ts

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  AdvisorProvenance,
} from "./provenance.types";

export function buildProvenance(
  reasoning: ReasoningResult,
): AdvisorProvenance {
  void reasoning;

  return {
    generatedAt: new Date().toISOString(),

    recommendations: [],
  };
}