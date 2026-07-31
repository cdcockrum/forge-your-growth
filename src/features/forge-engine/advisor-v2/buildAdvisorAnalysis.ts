// src/features/forge-engine/advisor-v2/buildAdvisorAnalysis.ts

import type {
  AdvisorResult,
  BuildAdvisorAnalysisInput,
} from "./advisor.types";

import {
  runBriefPipeline,
} from "./advisor-brief/briefPipeline";

import {
  runConfidencePipeline,
} from "./confidence/confidencePipeline";

import {
  collectEvidence,
} from "./evidenceCollector";

import {
  runReasoningPipeline,
} from "./reasoning";

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