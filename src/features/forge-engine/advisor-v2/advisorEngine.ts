import {
  collectEvidence,
} from "./evidenceCollector";

import {
  runReasoningPipeline,
} from "./reasoning";

import {
  runConfidencePipeline,
} from "./confidence/confidencePipeline";

import type {
  AdvisorResult,
  BuildAdvisorAnalysisInput,
} from "./advisor.types";

import {
  runBriefPipeline,
} from "./advisor-brief/briefPipeline";

export function buildAdvisorAnalysis(
  input: BuildAdvisorAnalysisInput,
): AdvisorResult {
  const evidence =
  collectEvidence(input);

const reasoning =
  runReasoningPipeline(
    evidence,
  );

const confidence =
  runConfidencePipeline(
    reasoning,
  );

const brief =
  runBriefPipeline(
    reasoning,
    confidence,
  );

return {
  evidence,
  reasoning,
  confidence,
  brief,
};
}