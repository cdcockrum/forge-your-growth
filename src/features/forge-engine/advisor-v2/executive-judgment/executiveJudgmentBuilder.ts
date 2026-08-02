import type {
  ReasoningResult,
} from "../reasoning";

import type {
  ExecutiveJudgment,
  SituationAssessment,
} from "./executiveJudgment.types";

export function buildExecutiveJudgment(
  reasoning: ReasoningResult,
): ExecutiveJudgment {
  const {
    interpretation,
    evaluation,
    recommendations,
  } = reasoning;

  const primaryRecommendation =
    recommendations[0] ?? null;

  const situation =
    determineSituation(
      reasoning,
    );

  const urgency =
    determineUrgency(
      reasoning,
    );

  const rationale =
    buildRationale(
      reasoning,
    );

  return {
    headline:
      primaryRecommendation?.title ??
      interpretation.strongest?.title ??
      "Continue gathering evidence",

    summary:
      interpretation.summary,

    situation,

    urgency,

    confidence:
      normalizeConfidence(
        interpretation.confidence,
      ),

    rationale,
  };
}

function determineSituation(
  reasoning: ReasoningResult,
): SituationAssessment {
  const {
    graph,
    interpretation,
    evaluation,
  } = reasoning;

  if (graph.nodes.length === 0) {
    return "uncertain";
  }

  if (
    !interpretation.strongest ||
    interpretation.confidence < 0.4
  ) {
    return "uncertain";
  }

  if (
    evaluation.contradictions.length > 0 ||
    evaluation.consistencyScore < 0.55
  ) {
    return "plateauing";
  }

  const strongestTitle =
    interpretation.strongest.title
      .toLowerCase();

  const strongestDescription =
    interpretation.strongest.description
      .toLowerCase();

  const combined =
    `${strongestTitle} ${strongestDescription}`;

  if (
    combined.includes("recover") ||
    combined.includes("return")
  ) {
    return "recovering";
  }

  if (
    combined.includes("accelerat") ||
    combined.includes("compound") ||
    combined.includes("strengthen")
  ) {
    return "accelerating";
  }

  return "building";
}

function determineUrgency(
  reasoning: ReasoningResult,
): ExecutiveJudgment["urgency"] {
  const {
    evaluation,
    recommendations,
  } = reasoning;

  const primaryPriority =
    recommendations[0]?.priority;

  if (
    evaluation.contradictions.length > 0 ||
    primaryPriority === "high"
  ) {
    return "high";
  }

  if (
    evaluation.gaps.length > 0 ||
    evaluation.competingHypotheses.length > 0 ||
    primaryPriority === "medium"
  ) {
    return "medium";
  }

  return "low";
}

function buildRationale(
  reasoning: ReasoningResult,
): string[] {
  const {
    interpretation,
    evaluation,
  } = reasoning;

  const rationale: string[] = [
    ...(
      interpretation.strongest
        ?.rationale ?? []
    ),
  ];

  if (
    evaluation.competingHypotheses.length > 0
  ) {
    rationale.push(
      "Alternative explanations remain plausible.",
    );
  }

  if (
    evaluation.contradictions.length > 0
  ) {
    rationale.push(
      "Contradictory evidence limits certainty.",
    );
  }

  if (
    evaluation.gaps.length > 0
  ) {
    rationale.push(
      "Additional evidence would strengthen this judgment.",
    );
  }

  return uniqueStrings(
    rationale,
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