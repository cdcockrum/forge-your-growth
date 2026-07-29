import type {
  MomentumResult,
} from "../../momentum";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function normalizeScore(
  value: number,
): number {
  return value > 1
    ? Math.min(
        1,
        Math.max(
          0,
          value / 100,
        ),
      )
    : Math.min(
        1,
        Math.max(
          0,
          value,
        ),
      );
}

function getDirectionPolarity(
  direction: MomentumResult["direction"],
): AdvisorEvidence["polarity"] {
  if (direction === "rising") {
    return "positive";
  }

  if (direction === "falling") {
    return "negative";
  }

  return "neutral";
}

function getBurnoutPolarity(
  burnoutRisk: MomentumResult["burnoutRisk"],
): AdvisorEvidence["polarity"] {
  if (burnoutRisk === "high") {
    return "negative";
  }

  if (burnoutRisk === "moderate") {
    return "neutral";
  }

  return "positive";
}

function getBurnoutImpact(
  burnoutRisk: MomentumResult["burnoutRisk"],
): number {
  if (burnoutRisk === "high") {
    return 0.95;
  }

  if (burnoutRisk === "moderate") {
    return 0.8;
  }

  return 0.6;
}

export function buildMomentumEvidence(
  momentum: MomentumResult,
): AdvisorEvidence[] {
  const evidence: AdvisorEvidence[] = [];

  evidence.push({
    id: "momentum-direction",
    category: "momentum",
    source: "direction",
    statement:
      `Current momentum is ${momentum.direction}.`,
    confidence: 0.9,
    impact: 0.9,
    polarity:
      getDirectionPolarity(
        momentum.direction,
      ),
    tags: [
      "momentum",
      "direction",
      "trajectory",
    ],
  });

  evidence.push({
    id: "momentum-score",
    category: "momentum",
    source: "score",
    statement:
      `The current momentum score is ${Math.round(
        momentum.score,
      )}.`,
    confidence: 0.9,
    impact: 0.85,
    polarity:
      momentum.score >= 70
        ? "positive"
        : momentum.score < 40
        ? "negative"
        : "neutral",
    tags: [
      "momentum",
      "score",
      "trajectory",
    ],
  });

  evidence.push({
    id: "momentum-consistency",
    category: "momentum",
    source: "consistency",
    statement:
      `Consistency is ${Math.round(
        momentum.consistency,
      )}.`,
    confidence: 0.9,
    impact: 0.85,
    polarity:
      momentum.consistency >= 70
        ? "positive"
        : momentum.consistency < 40
        ? "negative"
        : "neutral",
    tags: [
      "momentum",
      "consistency",
      "practice",
    ],
  });

  evidence.push({
    id: "momentum-adherence",
    category: "momentum",
    source: "adherence",
    statement:
      `Plan adherence is ${Math.round(
        momentum.adherence,
      )}.`,
    confidence: 0.9,
    impact: 0.8,
    polarity:
      momentum.adherence >= 70
        ? "positive"
        : momentum.adherence < 40
        ? "negative"
        : "neutral",
    tags: [
      "momentum",
      "adherence",
      "planning",
    ],
  });

  evidence.push({
    id: "momentum-recovery",
    category: "momentum",
    source: "recovery",
    statement:
      `Recovery capacity is ${Math.round(
        momentum.recovery,
      )}.`,
    confidence: 0.85,
    impact: 0.8,
    polarity:
      momentum.recovery >= 70
        ? "positive"
        : momentum.recovery < 40
        ? "negative"
        : "neutral",
    tags: [
      "momentum",
      "recovery",
      "resilience",
    ],
  });

  evidence.push({
    id: "momentum-burnout-risk",
    category: "momentum",
    source: "burnoutRisk",
    statement:
      `Burnout risk is ${momentum.burnoutRisk}.`,
    confidence: 0.9,
    impact:
      getBurnoutImpact(
        momentum.burnoutRisk,
      ),
    polarity:
      getBurnoutPolarity(
        momentum.burnoutRisk,
      ),
    tags: [
      "momentum",
      "burnout",
      "recovery",
      "risk",
    ],
  });

  if (momentum.message.trim().length > 0) {
    evidence.push({
      id: "momentum-message",
      category: "momentum",
      source: "message",
      statement:
        momentum.message,
      confidence:
        normalizeScore(
          momentum.score,
        ),
      impact: 0.65,
      polarity:
        getDirectionPolarity(
          momentum.direction,
        ),
      tags: [
        "momentum",
        "summary",
      ],
    });
  }

  return evidence;
}