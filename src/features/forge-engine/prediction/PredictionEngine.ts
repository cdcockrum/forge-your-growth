import type {
  BeliefResult,
} from "../beliefs";

import type {
  ContradictionResult,
} from "../contradictions";

import type {
  MomentumResult,
} from "../momentum";

import type {
  PatternSummary,
} from "../patterns";

import type {
  ProgressSummary,
} from "../progress";

import type {
  ForgePrediction,
  PredictionResult,
} from "./prediction.types";

type BuildPredictionsInput = {
  progress: ProgressSummary;

  momentum: MomentumResult;

  beliefs: BeliefResult;

  contradictions: ContradictionResult;

  patterns: PatternSummary;
};

export function buildPredictions({
  progress,
  momentum,
  beliefs,
  contradictions,
  patterns,
}: BuildPredictionsInput): PredictionResult {
  const predictions: ForgePrediction[] = [];

  addMomentumPrediction(
    predictions,
    progress,
    momentum,
  );

  addConsistencyPrediction(
    predictions,
    progress,
  );

  addRecoveryPrediction(
    predictions,
    momentum,
  );

  addIdentityPrediction(
    predictions,
    beliefs,
    contradictions,
  );

  addPatternPrediction(
    predictions,
    patterns,
  );

  const sortedPredictions =
    [...predictions].sort(
      (first, second) =>
        second.confidence -
        first.confidence,
    );

  return {
    predictions:
      sortedPredictions,

    strongest:
      sortedPredictions[0] ??
      null,

    confidence:
      calculateOverallConfidence(
        sortedPredictions,
      ),
  };
}

function addMomentumPrediction(
  predictions: ForgePrediction[],
  progress: ProgressSummary,
  momentum: MomentumResult,
): void {
  if (
    momentum.score >= 75 &&
    progress.completionRate >= 70
  ) {
    predictions.push({
      id: "momentum-continue",

      title:
        "Your current momentum is likely to continue.",

      description:
        "Recent follow-through and momentum are both strong enough to support another productive week.",

      category:
        "momentum",

      confidence:
        Math.min(
          95,
          Math.round(
            momentum.score * 0.6 +
              progress.completionRate *
                0.4,
          ),
        ),

      timeframe:
        "week",

      evidence: [
        `Momentum score is ${momentum.score}.`,
        `Completion rate is ${progress.completionRate}%.`,
      ],

      recommendation:
        "Protect the routines already producing results rather than adding unnecessary commitments.",
    });
  }
}

function addConsistencyPrediction(
  predictions: ForgePrediction[],
  progress: ProgressSummary,
): void {
  if (
    progress.totalSessions >= 5 &&
    progress.completionRate < 50
  ) {
    predictions.push({
      id: "consistency-risk",

      title:
        "The current plan is likely to remain difficult to complete.",

      description:
        "Recent completion suggests that the present workload or timing may continue producing missed sessions.",

      category:
        "consistency",

      confidence:
        Math.min(
          90,
          55 +
            Math.round(
              (50 -
                progress.completionRate) *
                0.7,
            ),
        ),

      timeframe:
        "week",

      evidence: [
        `Completion rate is ${progress.completionRate}%.`,
        `${progress.totalSessions} sessions were included in the observation period.`,
      ],

      recommendation:
        "Reduce the next plan to fewer, more achievable practices.",
    });
  }
}

function addRecoveryPrediction(
  predictions: ForgePrediction[],
  momentum: MomentumResult,
): void {
  if (
    momentum.burnoutRisk === "high"
  ) {
    predictions.push({
      id: "recovery-needed",

      title:
        "Continued effort without recovery may weaken momentum.",

      description:
        "The current burnout signal suggests that maintaining the same load could reduce follow-through.",

      category:
        "recovery",

      confidence:
        88,

      timeframe:
        "week",

      evidence: [
        "Burnout risk is high.",
        `Momentum score is ${momentum.score}.`,
      ],

      recommendation:
        "Shorten or remove one demanding commitment and protect a meaningful recovery period.",
    });
  }
}

function addIdentityPrediction(
  predictions: ForgePrediction[],
  beliefs: BeliefResult,
  contradictions: ContradictionResult,
): void {
  const identityBelief =
    beliefs.beliefs.find(
      (belief) =>
        belief.id === "identity",
    );

  if (!identityBelief) {
    return;
  }

  const identityConflict =
    contradictions.contradictions.find(
      (contradiction) =>
        contradiction.id ===
        "identity-behavior",
    );

  if (identityConflict) {
    predictions.push({
      id: "identity-weakening",

      title:
        "Your strongest identity may lose support.",

      description:
        "The identity remains meaningful, but recent behavior is not reinforcing it consistently.",

      category:
        "identity",

      confidence:
        Math.min(
          90,
          Math.max(
            55,
            identityBelief.confidence,
          ),
        ),

      timeframe:
        "week",

      evidence: [
        identityBelief.statement,
        identityConflict.title,
      ],

      recommendation:
        "Complete one manageable practice that directly reinforces this identity.",
    });

    return;
  }

  if (
    identityBelief.confidence >= 70
  ) {
    predictions.push({
      id: "identity-strengthening",

      title:
        "Your strongest identity is likely to continue strengthening.",

      description:
        "Current belief confidence is high and no major identity conflict is present.",

      category:
        "identity",

      confidence:
        identityBelief.confidence,

      timeframe:
        "month",

      evidence: [
        identityBelief.statement,
        `${identityBelief.supportingEvidence.length} supporting evidence items are available.`,
      ],

      recommendation:
        "Continue protecting the practices that provide evidence for this identity.",
    });
  }
}

function addPatternPrediction(
  predictions: ForgePrediction[],
  patterns: PatternSummary,
): void {
  const strongest =
    patterns.strongestPattern;

  if (!strongest) {
    return;
  }

  predictions.push({
    id:
      `pattern-${strongest.id}`,

    title:
      strongest.title,

    description:
      strongest.description,

    category:
      "practice",

    confidence:
      patternConfidenceToNumber(
        strongest.confidence,
      ),

    timeframe:
      "week",

    evidence: [
      `Observed ${strongest.evidenceCount} times.`,
    ],

    recommendation:
      strongest.recommendation ??
      "Continue observing this pattern before making a major adjustment.",
  });
}

function patternConfidenceToNumber(
  confidence:
    "low" | "medium" | "high",
): number {
  switch (confidence) {
    case "high":
      return 85;

    case "medium":
      return 70;

    case "low":
      return 50;
  }
}

function calculateOverallConfidence(
  predictions: ForgePrediction[],
): number {
  if (
    predictions.length === 0
  ) {
    return 0;
  }

  const total =
    predictions.reduce(
      (sum, prediction) =>
        sum +
        prediction.confidence,
      0,
    );

  return Math.round(
    total /
      predictions.length,
  );
}