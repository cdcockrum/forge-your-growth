import type {
  AdvisorResult,
} from "../../advisor.types";

import type {
  SimulationScenarioViewModel,
  SimulationViewModel,
} from "../cognitiveViewModel";

export function buildSimulationViewModel(
  advisor: AdvisorResult,
): SimulationViewModel {
  return {
    bestCase:
      mapScenario(
        advisor.simulation.bestCase,
      ),

    expectedCase:
      mapScenario(
        advisor.simulation.expectedCase,
      ),

    worstCase:
      mapScenario(
        advisor.simulation.worstCase,
      ),
  };
}

function mapScenario(
  scenario: AdvisorResult[
    "simulation"
  ]["bestCase"],
): SimulationScenarioViewModel {
  return {
    id:
      scenario.id,

    title:
      scenario.title,

    description:
      scenario.description,

    probability:
      normalizeScore(
        scenario.probability,
      ),

    projectedConfidence:
      normalizeScore(
        scenario.projectedConfidence,
      ),

    trajectory:
      scenario.trajectory,

    recommendations: [
      ...scenario.recommendations,
    ],
  };
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}