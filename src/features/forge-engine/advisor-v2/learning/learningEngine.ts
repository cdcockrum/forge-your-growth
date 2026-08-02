import {
  calibrateConfidence,
} from "./confidenceCalibration";

import {
  evaluateRecommendations,
} from "./recommendationEvaluator";

import {
  updateBeliefs,
  type LearnedBelief,
} from "./beliefUpdater";

import type {
  LearningResult,
  RecommendationHistory,
} from "./learning.types";

export function runLearningEngine(
  recommendationHistory: RecommendationHistory[],
  beliefs: LearnedBelief[],
  predictedConfidence: number,
  observedConfidence: number,
): LearningResult {
  const effectiveness =
    evaluateRecommendations(
      recommendationHistory,
    );

  const calibration = [
    calibrateConfidence(
      predictedConfidence,
      observedConfidence,
    ),
  ];

  const updatedBeliefs =
    updateBeliefs(
      beliefs,
    );

  return {
    effectiveness,

    calibration,

    learnedBeliefs:
      updatedBeliefs.map(
        (belief) =>
          belief.statement,
      ),

    updatedConfidence:
      averageConfidence(
        updatedBeliefs,
      ),
  };
}

function averageConfidence(
  beliefs: LearnedBelief[],
): number {
  if (beliefs.length === 0) {
    return 0;
  }

  return (
    beliefs.reduce(
      (total, belief) =>
        total +
        belief.confidence,
      0,
    ) / beliefs.length
  );
}