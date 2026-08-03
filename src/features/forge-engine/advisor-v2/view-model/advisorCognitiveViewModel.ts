import type {
  AdvisorResult,
} from "../advisor.types";

import {
  buildCognitiveViewModel,
} from "../cognition";

import type {
  CognitiveViewModel,
} from "../cognition";

export type AdvisorRecommendationViewModel = {
  title: string;

  description: string;

  priority:
    | "low"
    | "medium"
    | "high";

  confidence: number;
};

export type AdvisorAlertViewModel = {
  id: string;

  title: string;

  description: string;

  severity:
    | "info"
    | "warning"
    | "critical";
};

export type AdvisorCognitiveViewModel = {
  cognition: CognitiveViewModel;

  recommendation:
    AdvisorRecommendationViewModel | null;

  alerts: AdvisorAlertViewModel[];
};

export function buildAdvisorCognitiveViewModel(
  advisor: AdvisorResult,
): AdvisorCognitiveViewModel {
  return {
    cognition:
      buildCognitiveViewModel(
        advisor,
      ),

    recommendation:
      buildPrimaryRecommendation(
        advisor,
      ),

    alerts:
      buildAlerts(
        advisor,
      ),
  };
}

function buildPrimaryRecommendation(
  advisor: AdvisorResult,
): AdvisorRecommendationViewModel | null {
  const recommendation =
    advisor.reasoning
      .recommendations[0] ??
    null;

  if (!recommendation) {
    return null;
  }

  return {
    title:
      recommendation.title,

    description:
      recommendation.description,

    priority:
      recommendation.priority,

    confidence:
      normalizeScore(
        recommendation.confidence,
      ),
  };
}

function buildAlerts(
  advisor: AdvisorResult,
): AdvisorAlertViewModel[] {
  const alerts:
    AdvisorAlertViewModel[] = [];

  if (
    advisor.calibration.confidence
      .calibration ===
      "overconfident"
  ) {
    alerts.push({
      id:
        "calibration-overconfidence",

      title:
        "Confidence may be too high",

      description:
        advisor.calibration
          .recommendation,

      severity:
        "warning",
    });
  }

  if (
    advisor.calibration.reliability
      .evidenceReliability ===
      "low"
  ) {
    alerts.push({
      id:
        "low-evidence-reliability",

      title:
        "Evidence remains limited",

      description:
        "Forge needs broader or more consistent evidence before treating this conclusion as durable.",

      severity:
        "warning",
    });
  }

  if (
    advisor.reasoning.evaluation
      .contradictions.length > 0
  ) {
    alerts.push({
      id:
        "reasoning-contradictions",

      title:
        "Conflicting signals remain",

      description:
        `${advisor.reasoning.evaluation.contradictions.length} ${
          advisor.reasoning.evaluation.contradictions.length === 1
            ? "contradiction is"
            : "contradictions are"
        } still affecting the current conclusion.`,

      severity:
        "info",
    });
  }

  if (
    advisor.cognitiveMemory.current
      .strongestBelief.status ===
      "rejected"
  ) {
    alerts.push({
      id:
        "belief-rejected",

      title:
        "A previous belief lost support",

      description:
        "Forge no longer considers the previous interpretation sufficiently supported.",

      severity:
        "critical",
    });
  }

  return alerts;
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