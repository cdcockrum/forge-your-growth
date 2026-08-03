import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

export type UncertaintyAnalysis = {
  uncertainties: string[];

  missingEvidence: string[];

  couldChangeMyMind: string[];
};

export function analyzeUncertainty(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): UncertaintyAnalysis {
  return {
    uncertainties:
      buildUncertainties(
        reasoning,
        judgment,
        reflection,
      ),

    missingEvidence:
      buildMissingEvidence(
        reasoning,
        reflection,
      ),

    couldChangeMyMind:
      buildChangeConditions(
        reasoning,
        judgment,
        reflection,
      ),
  };
}

function buildUncertainties(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): string[] {
  const uncertainties = [
    ...reflection.uncertainties,
  ];

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
      .contradictions.length > 0
  ) {
    uncertainties.push(
      "Some evidence supports conclusions that conflict with the current judgment.",
    );
  }

  if (
    reasoning.interpretation
      .confidence < 0.6
  ) {
    uncertainties.push(
      "The strongest interpretation has not yet reached a high level of confidence.",
    );
  }

  if (
    reasoning.graph.nodes.length < 3
  ) {
    uncertainties.push(
      "The current conclusion is based on a limited number of observations.",
    );
  }

  if (
    judgment.situation ===
    "uncertain"
  ) {
    uncertainties.push(
      "Forge cannot yet describe the current situation with sufficient stability.",
    );
  }

  return uniqueStrings(
    uncertainties,
  );
}

function buildMissingEvidence(
  reasoning: ReasoningResult,
  reflection: Reflection,
): string[] {
  const missingEvidence = [
    ...reflection
      .additionalEvidenceNeeded,

    ...reasoning.evaluation.gaps.map(
      (gap) =>
        gap.explanation,
    ),
  ];

  const evidenceCategories =
    new Set(
      reasoning.graph.nodes.map(
        (node) =>
          node.evidence.category,
      ),
    );

  if (
    !evidenceCategories.has(
      "history",
    )
  ) {
    missingEvidence.push(
      "More historical evidence is needed to determine whether the pattern persists over time.",
    );
  }

  if (
    !evidenceCategories.has(
      "trend",
    )
  ) {
    missingEvidence.push(
      "Additional trend evidence is needed to distinguish a durable direction from a short-term fluctuation.",
    );
  }

  if (
    !evidenceCategories.has(
      "memory",
    )
  ) {
    missingEvidence.push(
      "More memory evidence would help compare the current pattern with prior behavior.",
    );
  }

  if (
    reasoning.graph.nodes.length === 0
  ) {
    missingEvidence.push(
      "Completed practices, reflections, and progress observations are needed before forming a reliable conclusion.",
    );
  }

  return uniqueStrings(
    missingEvidence,
  );
}

function buildChangeConditions(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): string[] {
  const conditions: string[] = [];

  if (
    reasoning.evaluation
      .contradictions.length > 0
  ) {
    conditions.push(
      "A repeated pattern of contradictory behavior would weaken the current judgment.",
    );
  }

  if (
    reasoning.interpretation
      .supportingEvidence.length > 0
  ) {
    conditions.push(
      "If the supporting behavior stops recurring, Forge should reduce confidence in this conclusion.",
    );
  }

  if (
    judgment.situation ===
      "accelerating" ||
    judgment.situation ===
      "building"
  ) {
    conditions.push(
      "A sustained decline in completion, momentum, or identity alignment would change the current interpretation.",
    );
  }

  if (
    judgment.situation ===
      "plateauing"
  ) {
    conditions.push(
      "Several consistent improvements would provide evidence that the plateau is ending.",
    );
  }

  if (
    judgment.situation ===
      "recovering"
  ) {
    conditions.push(
      "A renewed interruption in supportive behavior would weaken the recovery interpretation.",
    );
  }

  if (
    reflection
      .alternativeInterpretations
      .length > 0
  ) {
    conditions.push(
      "Stronger evidence for an alternative interpretation would require Forge to revise its conclusion.",
    );
  }

  if (
    conditions.length === 0
  ) {
    conditions.push(
      "New repeated behavior that conflicts with the current pattern would cause Forge to reconsider this conclusion.",
    );
  }

  return uniqueStrings(
    conditions,
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