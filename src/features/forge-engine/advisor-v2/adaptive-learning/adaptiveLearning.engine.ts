import {
  analyzeOutcome,
  type OutcomeAnalyzerOptions,
} from "./outcomeAnalyzer";

import {
  evaluateRecommendation,
  type RecommendationEvaluatorOptions,
} from "./recommendationEvaluator";

import {
  buildBeliefRevision,
  type BeliefRevisionBuilderOptions,
} from "./beliefRevisionBuilder";

import {
  buildAdaptiveLearning,
} from "./adaptiveLearningBuilder";

import type {
  AdvisorAdaptiveLearning,
  AdvisorRecommendationOutcome,
  AdvisorLearningAdjustment,
} from "./adaptiveLearning.types";

export type AdaptiveLearningEngineOptions = {
  outcome: OutcomeAnalyzerOptions;

  previousOutcomes: AdvisorRecommendationOutcome[];

  previousAdjustments: AdvisorLearningAdjustment[];

  recommendationEvaluation: Omit<
    RecommendationEvaluatorOptions,
    "outcomes"
  >;

  beliefRevision: Omit<
    BeliefRevisionBuilderOptions,
    "outcomes" | "adjustment"
  >;

  generatedAt: string;
};

export type AdaptiveLearningEngineResult = {
  adaptiveLearning: AdvisorAdaptiveLearning;

  outcome: AdvisorRecommendationOutcome;

  adjustment: AdvisorLearningAdjustment;

  beliefRevision: ReturnType<
    typeof buildBeliefRevision
  >;
};

export function buildAdaptiveLearningPipeline(
  options: AdaptiveLearningEngineOptions,
): AdaptiveLearningEngineResult {

  // 1
  const outcome =
    analyzeOutcome(
      options.outcome,
    );

  // 2
  const outcomes = [
    ...options.previousOutcomes,
    outcome,
  ];

  // 3
  const adjustment =
    evaluateRecommendation({
      ...options.recommendationEvaluation,
      outcomes,
    });

  // 4
  const adjustments = [
    ...options.previousAdjustments,
    adjustment,
  ];

  // 5
  const beliefRevision =
    buildBeliefRevision({
      ...options.beliefRevision,
      outcomes,
      adjustment,
    });

  // 6
  const adaptiveLearning =
    buildAdaptiveLearning({
      outcomes,
      adjustments,
      generatedAt:
        options.generatedAt,
    });

  return {
    adaptiveLearning,
    outcome,
    adjustment,
    beliefRevision,
  };
}