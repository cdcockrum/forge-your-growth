import type {
  ReasoningResult,
} from "../reasoning/reasoning.types";

import type {
  ConfidenceResult,
} from "../confidence/confidence.types";

import type {
  AdvisorBrief,
} from "./advisorBrief.types";

import {
  composeAdvisorBrief,
} from "./briefComposer";

export function runBriefPipeline(
  reasoning: ReasoningResult,
  confidence: ConfidenceResult,
  now: Date = new Date(),
): AdvisorBrief {
  return composeAdvisorBrief(
    reasoning,
    confidence,
    now,
  );
}