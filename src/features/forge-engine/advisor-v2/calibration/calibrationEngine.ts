import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  CognitiveMemory,
} from "../cognitive-memory";

import {
  buildConfidenceMetrics,
} from "./confidenceTracker";

import {
  buildReliabilityMetrics,
} from "./evidenceReliability";

import {
  predictionAccuracy,
} from "./predictionTracker";

import type {
  CalibrationResult,
  PredictionRecord,
} from "./calibration.types";

export type BuildCalibrationOptions = {
  predictions: PredictionRecord[];

  evidence: AdvisorEvidence[];

  cognitiveMemory: CognitiveMemory;
};

export function buildCalibration({
  predictions,
  evidence,
  cognitiveMemory,
}: BuildCalibrationOptions): CalibrationResult {
  const confidence =
    buildConfidenceMetrics(
      predictions,
    );

  const revisionRate =
    calculateRevisionRate(
      cognitiveMemory,
    );

  const reliability =
    buildReliabilityMetrics(
      evidence,
      revisionRate,
    );

  return {
    predictions,

    confidence,

    reliability,

    recommendation:
      buildCalibrationRecommendation(
        confidence.calibration,
        reliability.evidenceReliability,
        predictionAccuracy(
          predictions,
        ),
      ),
  };
}

function calculateRevisionRate(
  memory: CognitiveMemory,
): number {
  const historyCount =
    Math.max(
      memory.confidenceHistory.length,
      1,
    );

  return clamp01(
    memory.revisions.length /
      historyCount,
  );
}

function buildCalibrationRecommendation(
  calibration:
    CalibrationResult[
      "confidence"
    ]["calibration"],
  evidenceReliability:
    CalibrationResult[
      "reliability"
    ]["evidenceReliability"],
  accuracy: number,
): string {
  if (
    calibration ===
      "overconfident" &&
    evidenceReliability ===
      "low"
  ) {
    return (
      "Reduce confidence until more reliable evidence and resolved outcomes are available."
    );
  }

  if (
    calibration ===
      "overconfident"
  ) {
    return (
      "Use more conservative confidence estimates until prediction accuracy improves."
    );
  }

  if (
    calibration ===
      "underconfident" &&
    evidenceReliability ===
      "high"
  ) {
    return (
      "The available evidence has been more reliable than Forge's confidence estimates suggest."
    );
  }

  if (
    evidenceReliability ===
      "low"
  ) {
    return (
      "Gather broader and more consistent evidence before increasing confidence."
    );
  }

  if (
    accuracy < 0.5
  ) {
    return (
      "Continue tracking outcomes before relying heavily on current prediction patterns."
    );
  }

  return (
    "Current confidence and evidence quality appear reasonably aligned. Continue monitoring resolved outcomes."
  );
}

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      value,
      1,
    ),
  );
}