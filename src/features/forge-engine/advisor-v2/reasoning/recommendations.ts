import type {
  Recommendation,
  RecommendationPriority,
  Interpretation,
} from "./reasoning.types";

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(1, value),
  );
}

function determinePriority(
  confidence: number,
): RecommendationPriority {
  if (confidence >= 0.8) {
    return "high";
  }

  if (confidence >= 0.55) {
    return "medium";
  }

  return "low";
}

function buildTitle(
  interpretation: Interpretation,
): string {
  if (!interpretation.strongest) {
    return "Gather more evidence";
  }

  return interpretation.strongest.title;
}

function buildDescription(
  interpretation: Interpretation,
): string {
  if (!interpretation.strongest) {
    return (
      "Continue recording practice, reflections, and progress " +
      "before making significant changes."
    );
  }

  return (
    interpretation.strongest.description +
    " Continue reinforcing this direction while monitoring for changes."
  );
}

function buildRationale(
  interpretation: Interpretation,
): string[] {
  const rationale: string[] = [
    interpretation.summary,
  ];

  if (interpretation.strongest) {
    rationale.push(
      ...interpretation.strongest.rationale,
    );
  }

  if (
    interpretation.conflictingEvidence.length > 0
  ) {
    rationale.push(
      "Some evidence remains unresolved, so continue validating this interpretation."
    );
  }

  return rationale;
}

export function buildRecommendations(
  interpretation: Interpretation,
): Recommendation[] {
  const confidence =
    clamp01(
      interpretation.confidence,
    );

  return [
    {
      id: "primary-recommendation",

      title:
        buildTitle(
          interpretation,
        ),

      description:
        buildDescription(
          interpretation,
        ),

      rationale:
        buildRationale(
          interpretation,
        ),

      supportingEvidence: [
        ...interpretation.supportingEvidence,
      ],

      confidence,

      priority:
        determinePriority(
          confidence,
        ),
    },
  ];
}