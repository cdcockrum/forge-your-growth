import {
  collectEvidence,
} from "./evidenceCollector";

import {
  runReasoningPipeline,
} from "./reasoning";



import type {
  AdvisorResult,
  BuildAdvisorAnalysisInput,
} from "./advisor.types";

export function buildAdvisorAnalysis(
  input: BuildAdvisorAnalysisInput,
): AdvisorResult {
  const evidence =
    collectEvidence(
      input,
    );

  const reasoning =
    runReasoningPipeline(
      evidence,
    );

  return {
    evidence,
    reasoning,
  };
}