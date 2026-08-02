import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  Reflection,
} from "./reflection.types";

export function buildReflection(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): Reflection {
  return {
    assumptions:
      buildAssumptions(
        reasoning,
        judgment,
      ),

    uncertainties:
      buildUncertainties(
        reasoning,
      ),

    alternativeInterpretations:
      buildAlternativeInterpretations(
        reasoning,
      ),

    additionalEvidenceNeeded:
      buildAdditionalEvidenceNeeded(
        reasoning,
      ),

    confidenceStatement:
      buildConfidenceStatement(
        reasoning,
        judgment,
      ),
  };
}

function buildAssumptions(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): string[] {
  const assumptions: string[] = [];

  if (
    reasoning.interpretation
      .strongest
  ) {
    assumptions.push(
      "The strongest current interpretation reflects a meaningful pattern rather than a temporary fluctuation.",
    );
  }

  if (
    reasoning.interpretation
      .supportingEvidence.length > 0
  ) {
    assumptions.push(
      "The available supporting evidence is representative of the user's current direction.",
    );
  }

  if (
    judgment.situation !==
    "uncertain"
  ) {
    assumptions.push(
      "Recent behavior provides enough context to describe the current situation.",
    );
  }

  return uniqueStrings(
    assumptions,
  );
}

function buildUncertainties(
  reasoning: ReasoningResult,
): string[] {
  const uncertainties: string[] = [];

  if (
    reasoning.evaluation
      .contradictions.length > 0
  ) {
    uncertainties.push(
      "Some evidence supports opposing conclusions.",
    );
  }

  if (
    reasoning.evaluation
      .competingHypotheses.length > 0
  ) {
    uncertainties.push(
      "More than one explanation remains plausible.",
    );
  }

  if (
    reasoning.evaluation
      .gaps.length > 0
  ) {
    uncertainties.push(
      ...reasoning.evaluation.gaps.map(
        (gap) =>
          gap.explanation,
      ),
    );
  }

  if (
    reasoning.graph.nodes.length === 0
  ) {
    uncertainties.push(
      "There is not yet enough evidence to form a stable conclusion.",
    );
  }

  return uniqueStrings(
    uncertainties,
  );
}

function buildAlternativeInterpretations(
  reasoning: ReasoningResult,
): string[] {
  return uniqueStrings(
    reasoning.evaluation
      .competingHypotheses.map(
        (hypothesis) =>
          hypothesis.description ||
          hypothesis.title,
      ),
  );
}

function buildAdditionalEvidenceNeeded(
  reasoning: ReasoningResult,
): string[] {
  const evidenceNeeded =
    reasoning.evaluation.gaps.map(
      (gap) =>
        gap.explanation,
    );

  if (
    reasoning.graph.nodes.length === 0
  ) {
    evidenceNeeded.push(
      "Additional completed practices, reflections, and progress observations are needed.",
    );
  }

  if (
    reasoning.interpretation
      .confidence < 0.7
  ) {
    evidenceNeeded.push(
      "More repeated behavior would help determine whether this pattern remains consistent over time.",
    );
  }

  return uniqueStrings(
    evidenceNeeded,
  );
}

function buildConfidenceStatement(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): string {
  const percentage =
    Math.round(
      normalizeConfidence(
        judgment.confidence,
      ) * 100,
    );

  const hasContradictions =
    reasoning.evaluation
      .contradictions.length > 0;

  const hasGaps =
    reasoning.evaluation
      .gaps.length > 0;

  if (
    reasoning.graph.nodes.length === 0
  ) {
    return (
      "Forge does not yet have enough evidence " +
      "to form a reliable judgment."
    );
  }

  if (
    hasContradictions
  ) {
    return (
      `Forge is ${percentage}% confident in this judgment. ` +
      "Supporting evidence is present, but contradictory signals remain."
    );
  }

  if (hasGaps) {
    return (
      `Forge is ${percentage}% confident in this judgment. ` +
      "The current interpretation is supported, although additional evidence would improve reliability."
    );
  }

  return (
    `Forge is ${percentage}% confident in this judgment. ` +
    "The available evidence is currently consistent with the conclusion."
  );
}

function uniqueStrings(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim(),
        )
        .filter(
          (value) =>
            value.length > 0,
        ),
    ),
  );
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