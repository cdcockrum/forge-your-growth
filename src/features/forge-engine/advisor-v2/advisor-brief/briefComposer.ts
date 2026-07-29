import type {
  ConfidenceResult,
} from "../confidence/confidence.types";

import type {
  Hypothesis,
  ReasoningResult,
  Recommendation,
} from "../reasoning/reasoning.types";

import type {
  AdvisorBrief,
  AdvisorItem,
} from "./advisorBrief.types";

export function composeAdvisorBrief(
  reasoning: ReasoningResult,
  confidence: ConfidenceResult,
  now: Date = new Date(),
): AdvisorBrief {
  const strongest =
    reasoning.interpretation.strongest;

  const items = [
    buildInsightItem(strongest),
    buildStrengthItem(reasoning),
    buildOpportunityItem(reasoning),
    buildRecommendationItem(
      reasoning.recommendations[0] ?? null,
    ),
  ].filter(
    (item): item is AdvisorItem =>
      item !== null,
  );

  return {
    headline: buildHeadline(
      strongest,
      confidence,
    ),

    summary: buildSummary(
      reasoning,
      confidence,
    ),

    overallConfidence:
      confidence.level,

    generatedAt: now.toISOString(),

    items,
  };
}

function buildHeadline(
  strongest: Hypothesis | null,
  confidence: ConfidenceResult,
): string {
  if (strongest) {
    return strongest.title;
  }

  if (
    confidence.level === "low" ||
    confidence.level === "very-low"
  ) {
    return "Forge is still gathering enough evidence.";
  }

  return "Your recent activity is beginning to form a clearer pattern.";
}

function buildSummary(
  reasoning: ReasoningResult,
  confidence: ConfidenceResult,
): string {
  const interpretationSummary =
    reasoning.interpretation.summary.trim();

  if (interpretationSummary.length > 0) {
    return interpretationSummary;
  }

  if (
    confidence.level === "low" ||
    confidence.level === "very-low"
  ) {
    return "The available evidence is still limited, so Forge is treating these conclusions cautiously.";
  }

  return "Forge has identified several evidence-backed signals worth reviewing.";
}

function buildInsightItem(
  strongest: Hypothesis | null,
): AdvisorItem | null {
  if (!strongest) {
    return null;
  }

  const body = uniqueStrings([
    strongest.description,
    ...strongest.rationale,
  ]);

  return {
    id: `advisor-insight-${strongest.id}`,
    section: "insight",
    title: "Primary insight",
    body,
    evidenceIds: uniqueStrings([
      ...strongest.supportingEvidence,
      ...strongest.conflictingEvidence,
    ]),
  };
}

function buildStrengthItem(
  reasoning: ReasoningResult,
): AdvisorItem | null {
  const strongestAgreement =
    [...reasoning.analysis.agreements].sort(
      (left, right) =>
        right.strength - left.strength,
    )[0];

  if (!strongestAgreement) {
    return null;
  }

  return {
    id: `advisor-strength-${strongestAgreement.id}`,
    section: "strength",
    title: "What is reinforcing your growth",
    body: uniqueStrings([
      strongestAgreement.explanation,
    ]),
    evidenceIds: uniqueStrings(
      strongestAgreement.evidenceIds,
    ),
  };
}

function buildOpportunityItem(
  reasoning: ReasoningResult,
): AdvisorItem | null {
  const strongestContradiction =
    [...reasoning.analysis.contradictions].sort(
      (left, right) =>
        right.severity - left.severity,
    )[0];

  if (strongestContradiction) {
    return {
      id: `advisor-opportunity-${strongestContradiction.id}`,
      section: "opportunity",
      title: "A tension worth examining",
      body: uniqueStrings([
        strongestContradiction.explanation,
      ]),
      evidenceIds: uniqueStrings(
        strongestContradiction.evidenceIds,
      ),
    };
  }

  const strongestTension =
    [...reasoning.analysis.tensions].sort(
      (left, right) =>
        right.severity - left.severity,
    )[0];

  if (strongestTension) {
    return {
      id: `advisor-opportunity-${strongestTension.id}`,
      section: "opportunity",
      title: "An emerging opportunity",
      body: uniqueStrings([
        strongestTension.explanation,
      ]),
      evidenceIds: uniqueStrings(
        strongestTension.evidenceIds,
      ),
    };
  }

  const highestPriorityGap =
    [...reasoning.analysis.gaps].sort(
      (left, right) =>
        right.importance - left.importance,
    )[0];

  if (!highestPriorityGap) {
    return null;
  }

  return {
    id: `advisor-opportunity-${highestPriorityGap.id}`,
    section: "opportunity",
    title: "More evidence is needed",
    body: uniqueStrings([
      highestPriorityGap.explanation,
    ]),
    evidenceIds: [],
  };
}

function buildRecommendationItem(
  recommendation: Recommendation | null,
): AdvisorItem | null {
  if (!recommendation) {
    return null;
  }

  return {
    id: `advisor-recommendation-${recommendation.id}`,
    section: "recommendation",
    title: recommendation.title,
    body: uniqueStrings([
      recommendation.description,
      ...recommendation.rationale,
    ]),
    evidenceIds: uniqueStrings(
      recommendation.supportingEvidence,
    ),
  };
}

function uniqueStrings(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(
          (value) => value.length > 0,
        ),
    ),
  );
}