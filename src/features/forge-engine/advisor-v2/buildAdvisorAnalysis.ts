// src/features/forge-engine/advisor-v2/buildAdvisorAnalysis.ts

import type {
  AdvisorAnalysis,
  BuildAdvisorAnalysisInput,
} from "./advisor.types";

import {
  collectEvidence,
} from "./evidenceCollector";

export function buildAdvisorAnalysis(
  input: BuildAdvisorAnalysisInput,
): AdvisorAnalysis {
  const evidence = collectEvidence(input);

  const confidence =
    evidence.length === 0
      ? 0
      : evidence.reduce(
          (total, item) => total + item.confidence,
          0,
        ) / evidence.length;

  return {
    generatedAt: new Date().toISOString(),

    primaryInsight: {
      title:
        evidence.length > 0
          ? "Forge is beginning to form an executive view"
          : "Advisor not initialized",

      summary:
        evidence.length > 0
          ? `Advisor V2 collected ${evidence.length} evidence ${
              evidence.length === 1 ? "item" : "items"
            }.`
          : "Advisor V2 has not yet collected enough evidence.",

      confidence,
    },

    primaryRisk: null,

    primaryOpportunity: null,

    recommendation: {
      title:
        evidence.length > 0
          ? "Continue building consistent evidence"
          : "Continue collecting evidence",

      description:
        evidence.length > 0
          ? "Continue completing and reflecting on practice sessions so Forge can strengthen its recommendations."
          : "Complete additional practice sessions to improve recommendations.",

      priority: "medium",

      confidence,
    },

    evidence,

    confidence,

    reasoning:
      evidence.length > 0
        ? "The current analysis is based on standardized evidence collected from Forge's cognitive engines."
        : "Advisor V2 has not yet received enough standardized evidence to form an analysis.",
  };
}