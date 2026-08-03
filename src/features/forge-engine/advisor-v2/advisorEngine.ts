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
  buildReflection,
} from "./reflection";

import {
  runReasoningPipeline,
} from "./reasoning";

import {
  buildSimulation,
} from "./simulation";

import {
  validateAdvisor,
} from "./validation";

import {
  buildWisdom,
} from "./wisdom";

import {
  buildEpistemology,
} from "./epistemology";

import {
  buildCognitiveMemorySnapshot,
  compareCognitiveMemory,
} from "./cognitive-memory";

import {
  getPreviousCognitiveSnapshot,
  saveCognitiveSnapshot,
} from "./cognitive-memory";

import {
  buildCalibration,
} from "./calibration";

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

  const epistemology =
  buildEpistemology(
    evidence,
    reasoning,
    judgment,
    reflection,
  );

  const cognitiveSnapshot =
  buildCognitiveMemorySnapshot({
    wisdom,

    epistemology,
  });

 const previousSnapshot =
  getPreviousCognitiveSnapshot();

  const cognitiveMemory =
    compareCognitiveMemory(
      cognitiveSnapshot,
      previousSnapshot,
    );

  const calibration =
  buildCalibration({
    predictions: [],

    evidence,

    cognitiveMemory,
  });

  saveCognitiveSnapshot(
    cognitiveMemory.current,
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

  const advisor: AdvisorResult = {
    evidence,

    reasoning,

    judgment,

    reflection,

    simulation,

    wisdom,

    epistemology,

    cognitiveMemory,

    calibration,

    confidence,

    brief,
  };

  const validation =
    validateAdvisor(
      advisor,
    );

  if (
    import.meta.env.DEV &&
    validation.issues.length > 0
  ) {
    console.warn(
      "Advisor validation issues:",
      validation.issues,
    );
  }

  return advisor;
}