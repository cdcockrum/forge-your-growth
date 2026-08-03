import type {
  AdvisorEvidence,
} from "../advisor.types";

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
  analyzeAssumptions,
  identifyUnverifiedAssumptions,
} from "./assumptionAnalysis";

import {
  determineBeliefStrength,
} from "./beliefStrength";

import {
  determineEvidenceQuality,
} from "./evidenceQuality";

import type {
  EpistemologyResult,
} from "./epistemology.types";

import {
  analyzeUncertainty,
} from "./uncertaintyAnalysis";

export function buildEpistemology(
  evidence: AdvisorEvidence[],
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): EpistemologyResult {
  const assumptions =
    analyzeAssumptions(
      reasoning,
      judgment,
      reflection,
    );

  const unverifiedAssumptions =
    identifyUnverifiedAssumptions(
      assumptions,
      reasoning,
    );

  const uncertainty =
    analyzeUncertainty(
      reasoning,
      judgment,
      reflection,
    );

  const beliefStrength =
    determineBeliefStrength(
      reasoning,
    );

  const evidenceQuality =
    determineEvidenceQuality(
      evidence,
      reasoning,
    );

  const strongestBelief =
    reasoning.interpretation
      .strongest?.description ??
    judgment.summary ??
    "Forge does not yet have enough evidence to form a stable belief.";

  return {
    strongestBelief,

    beliefStrength,

    evidenceQuality,

    assumptions:
      unverifiedAssumptions,

    uncertainties:
      uncertainty.uncertainties,

    missingEvidence:
      uncertainty.missingEvidence,

    couldChangeMyMind:
      uncertainty.couldChangeMyMind,

    confidenceNarrative:
      buildConfidenceNarrative(
        beliefStrength,
        evidenceQuality,
        judgment.confidence,
        uncertainty.uncertainties.length,
      ),
  };
}

function buildConfidenceNarrative(
  beliefStrength:
    EpistemologyResult["beliefStrength"],
  evidenceQuality:
    EpistemologyResult["evidenceQuality"],
  confidence: number,
  uncertaintyCount: number,
): string {
  const percentage =
    Math.round(
      normalizeConfidence(
        confidence,
      ) * 100,
    );

  const beliefPhrase =
    describeBeliefStrength(
      beliefStrength,
    );

  const evidencePhrase =
    describeEvidenceQuality(
      evidenceQuality,
    );

  if (
    uncertaintyCount > 0
  ) {
    return (
      `Forge is ${percentage}% confident in this belief. ` +
      `${beliefPhrase} ${evidencePhrase} ` +
      `${uncertaintyCount} unresolved ${
        uncertaintyCount === 1
          ? "uncertainty remains"
          : "uncertainties remain"
      }, so the conclusion should stay open to revision.`
    );
  }

  return (
    `Forge is ${percentage}% confident in this belief. ` +
    `${beliefPhrase} ${evidencePhrase} ` +
    "No major unresolved uncertainty is currently strong enough to weaken it."
  );
}

function describeBeliefStrength(
  strength:
    EpistemologyResult["beliefStrength"],
): string {
  switch (strength) {
    case "stable":
      return (
        "The belief appears stable across the current reasoning."
      );

    case "developing":
      return (
        "The belief is developing but has not yet become durable."
      );

    case "tentative":
    default:
      return (
        "The belief remains tentative."
      );
  }
}

function describeEvidenceQuality(
  quality:
    EpistemologyResult["evidenceQuality"],
): string {
  switch (quality) {
    case "strong":
      return (
        "The supporting evidence is strong and comes from multiple sources."
      );

    case "moderate":
      return (
        "The supporting evidence is meaningful but still incomplete."
      );

    case "weak":
    default:
      return (
        "The supporting evidence is currently weak or too limited."
      );
  }
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}