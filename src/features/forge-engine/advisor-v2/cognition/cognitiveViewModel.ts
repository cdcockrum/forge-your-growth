import type {
  AdvisorResult,
} from "../advisor.types";

import {
  buildSummaryViewModel,
} from "./builders/summaryBuilder";

import {
  buildMemoryViewModel,
} from "./builders/memoryBuilder";

import {
  buildCalibrationViewModel,
} from "./builders/calibrationBuilder";

import { buildReasoningViewModel } from "./builders/reasoningBuilder";
import { buildPredictionViewModel } from "./builders/predictionBuilder";

import {
  buildSimulationViewModel,
} from "./builders/simulationBuilder";



export type CognitiveViewModel = {
  summary: SummaryViewModel;

  memory: MemoryViewModel;

  calibration: CalibrationViewModel;

  reasoning: ReasoningViewModel;

  predictions: PredictionViewModel;

  simulation: SimulationViewModel;
};

export type SummaryViewModel = {
  overallConfidence: number;

  evidenceQuality: string;

  calibration: string;

  strongestBelief: string;
};

export type MemoryViewModel = {
  strongestBelief: string;

  confidence: number;

  status: string;

  revisionCount: number;

  previousBelief:
    | string
    | null;

  previousConfidence:
    | number
    | null;

  confidenceChange:
    | number
    | null;

  lastRevision:
    AdvisorResult[
      "cognitiveMemory"
    ]["revisions"][number] | null;
};

export type CalibrationViewModel = {
  calibration: string;

  averageAccuracy: number;

  averageConfidence: number;

  confidenceBias: number;

  overconfidenceBias: number;

  underconfidenceBias: number;

  evidenceReliability: string;

  evidenceCoverage: number;

  contradictionRate: number;

  revisionRate: number;

  predictionCount: number;

  resolvedPredictionCount: number;

  recommendation: string;
};

export type ReasoningViewModel = {
  evidenceCount: number;

  graphNodeCount: number;

  graphEdgeCount: number;

  hypothesisCount: number;

  contradictionCount: number;

  gapCount: number;

  assumptionCount: number;

  uncertaintyCount: number;

  interpretationConfidence: number;

  consistencyScore: number;

  strongestHypothesis:
    | string
    | null;

  strongestInterpretation:
    | string
    | null;
};

export type PredictionViewModel = {
  predictionCount: number;

  resolvedCount: number;

  unresolvedCount: number;

  correctCount: number;

  incorrectCount: number;

  averageConfidence: number;

  averageAccuracy: number;

  latestPrediction:
    AdvisorResult[
      "calibration"
    ]["predictions"][number] | null;
};
export type SimulationScenarioViewModel = {
  id: string;

  title: string;

  description: string;

  probability: number;

  projectedConfidence: number;

  trajectory: string;

  recommendations: string[];
};

export type SimulationViewModel = {
  bestCase:
    SimulationScenarioViewModel;

  expectedCase:
    SimulationScenarioViewModel;

  worstCase:
    SimulationScenarioViewModel;
};

export function buildCognitiveViewModel(
  advisor: AdvisorResult,
): CognitiveViewModel {
  return {
    summary:
      buildSummaryViewModel(
        advisor,
      ),

    memory:
      buildMemoryViewModel(
        advisor,
      ),

    calibration:
      buildCalibrationViewModel(
        advisor,
      ),

    reasoning:
      buildReasoningViewModel(
        advisor,
      ),

    predictions:
      buildPredictionViewModel(
        advisor,
      ),

    simulation:
      buildSimulationViewModel(
        advisor,
      ),
  };
}
