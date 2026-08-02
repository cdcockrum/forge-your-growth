import {
  runBriefPipeline,
} from "./advisor-brief/briefPipeline";

import type {
  AdvisorResult,
  BuildAdvisorAnalysisInput,
} from "./advisor.types";

import {
  runConfidencePipeline,
} from "./confidence/confidencePipeline";

import {
  collectEvidence,
} from "./evidenceCollector";

import {
  buildExecutiveJudgment,
} from "./executive-judgment";

import {
  buildSimulation,
} from "./simulation";

import {
  runReasoningPipeline,
} from "./reasoning";

import {
  buildReflection,
} from "./reflection";

import {
  buildWisdom,
} from "./wisdom";

export function buildAdvisorAnalysis(
  input: BuildAdvisorAnalysisInput,
): AdvisorResult {
  const evidence =
    collectEvidence(input);

  const reasoning =
    runReasoningPipeline(
      evidence,
    );

  const judgment =
    buildExecutiveJudgment(
      reasoning,
    );

  const reflection =
    buildReflection(
      reasoning,
      judgment,
    );

  const simulation =
    buildSimulation(
      reasoning,
      judgment,
      reflection,
    );

    const wisdom =
  buildWisdom(
    reasoning,
    judgment,
    reflection,
    simulation,
    null,
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

    judgment,

    confidence,

    reflection,

    simulation,

    wisdom,
    
    brief,
  };
}