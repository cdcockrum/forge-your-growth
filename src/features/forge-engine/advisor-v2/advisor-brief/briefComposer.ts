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
    return makeHeadlineNatural(
      strongest.title,
    );
  }

  if (hasLimitedConfidence(confidence)) {
    return "The picture is still taking shape.";
  }

  return "A clearer pattern is beginning to emerge.";
}

function buildSummary(
  reasoning: ReasoningResult,
  confidence: ConfidenceResult,
): string {
  const strongest =
    reasoning.interpretation.strongest;

  if (strongest) {
    const observation =
      makeUserFacing(
        strongest.description,
      );

    if (hasLimitedConfidence(confidence)) {
      return joinSentences([
        observation,
        "There is not enough history yet to treat this as a firm conclusion.",
      ]);
    }

    if (
      strongest.conflictingEvidence.length >
      0
    ) {
      return joinSentences([
        observation,
        "Some of the evidence points in another direction, so this interpretation may change as Forge learns more.",
      ]);
    }

    return observation;
  }

  const interpretationSummary =
    makeUserFacing(
      reasoning.interpretation.summary,
    );

  if (interpretationSummary.length > 0) {
    return interpretationSummary;
  }

  if (hasLimitedConfidence(confidence)) {
    return "Forge is still learning your rhythms. A few more completed practices and reflections should make the picture clearer.";
  }

  return "Several signals are beginning to align, although none is strong enough to stand alone yet.";
}

function buildInsightItem(
  strongest: Hypothesis | null,
): AdvisorItem | null {
  if (!strongest) {
    return null;
  }

  return {
    id: `advisor-insight-${strongest.id}`,
    section: "insight",
    title: "What seems most important",
    body: selectDistinctThoughts([
      strongest.description,
      ...strongest.rationale,
    ]),
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
    title: "What is working in your favor",
    body: selectDistinctThoughts([
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
      title: "Something worth looking at",
      body: selectDistinctThoughts([
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
      title: "Where things may be pulling apart",
      body: selectDistinctThoughts([
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
    title: "What Forge is still learning",
    body: selectDistinctThoughts([
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
    title: makeHeadlineNatural(
      recommendation.title,
    ),
    body: selectDistinctThoughts([
      recommendation.description,
      ...recommendation.rationale,
    ]),
    evidenceIds: uniqueStrings(
      recommendation.supportingEvidence,
    ),
  };
}

function hasLimitedConfidence(
  confidence: ConfidenceResult,
): boolean {
  return (
    confidence.level === "low" ||
    confidence.level === "very-low"
  );
}

function selectDistinctThoughts(
  values: string[],
  limit = 3,
): string[] {
  return uniqueStrings(
    values.map(makeUserFacing),
  ).slice(0, limit);
}

function makeUserFacing(
  value: string,
): string {
  const cleaned = value
    .trim()
    .replace(
      /^the available evidence (suggests|indicates|shows) that\s+/i,
      "",
    )
    .replace(
      /^the evidence (suggests|indicates|shows) that\s+/i,
      "",
    )
    .replace(
      /^evidence (suggests|indicates|shows) that\s+/i,
      "",
    )
    .replace(
      /^analysis (suggests|indicates|shows) that\s+/i,
      "",
    )
    .replace(
      /^the current interpretation is that\s+/i,
      "",
    )
    .replace(
      /^it appears that\s+/i,
      "",
    );

  if (cleaned.length === 0) {
    return "";
  }

  const sentence =
    cleaned.charAt(0).toUpperCase() +
    cleaned.slice(1);

  return /[.!?]$/.test(sentence)
    ? sentence
    : `${sentence}.`;
}

function makeHeadlineNatural(
  value: string,
): string {
  const cleaned = value
    .trim()
    .replace(/[.!?]+$/, "");

  if (cleaned.length === 0) {
    return "A pattern is beginning to emerge";
  }

  return (
    cleaned.charAt(0).toUpperCase() +
    cleaned.slice(1)
  );
}

function joinSentences(
  values: string[],
): string {
  return values
    .map(makeUserFacing)
    .filter(
      (value) => value.length > 0,
    )
    .join(" ");
}

function uniqueStrings(
  values: string[],
): string[] {
  const seen = new Set<string>();

  return values.filter((value) => {
    const cleaned = value.trim();

    if (cleaned.length === 0) {
      return false;
    }

    const comparisonKey = cleaned
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ");

    if (seen.has(comparisonKey)) {
      return false;
    }

    seen.add(comparisonKey);

    return true;
  });
}