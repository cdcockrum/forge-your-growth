import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

import {
  generateScenarios,
} from "./scenarioGenerator";

import type {
  Scenario,
  Simulation,
} from "./simulation.types";

export function buildSimulation(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): Simulation {
  const scenarios =
    generateScenarios(
      reasoning,
      judgment,
      reflection,
    );

  const fallback =
    buildFallbackScenario(
      judgment,
    );

  return {
    scenarios,

    bestCase:
      scenarios[0] ??
      fallback,

    expectedCase:
      scenarios[1] ??
      fallback,

    worstCase:
      scenarios[2] ??
      fallback,
  };
}

function buildFallbackScenario(
  judgment: ExecutiveJudgment,
): Scenario {
  return {
    id: "fallback",

    title:
      "Continue gathering evidence",

    description:
      judgment.summary,

    probability:
      judgment.confidence,

    projectedConfidence:
      judgment.confidence,

    trajectory:
      "uncertain",

    recommendations: [
      "Continue recording meaningful actions and reflections.",
    ],
  };
}