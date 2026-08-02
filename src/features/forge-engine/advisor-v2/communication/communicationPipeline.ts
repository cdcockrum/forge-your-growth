import type {
  AdvisorPriority,
} from "../advisor.types";

import type {
  ForgeCommunicationInput,
  ForgeCommunicationResult,
  ForgeCommunicationTone,
} from "./communication.types";

export function runCommunicationPipeline(
  input: ForgeCommunicationInput,
): ForgeCommunicationResult {
  const tone =
    selectCommunicationTone(
      input.wisdom.confidence,
      input.wisdom.cautions.length,
      input.wisdom.opportunities.length,
    );

  const primaryInsight =
    input.wisdom.insights[0] ??
    null;

  const summary =
    buildSummary(
      input.wisdom.narrative,
      tone,
    );

  const assessment =
    buildAssessment(
      input.wisdom.narrative,
      input.wisdom.longTermThemes,
      input.wisdom.emergingIdentity,
    );

  const recommendation =
    buildRecommendation(
      primaryInsight,
      input.wisdom.opportunities,
      input.confidence.score,
    );

  const reasoning =
    uniqueStrings([
      ...input.wisdom.insights.map(
        (insight) =>
          insight.explanation,
      ),

      ...input.wisdom.longTermThemes,

      ...input.wisdom.emergingIdentity,
    ]).slice(0, 6);

  const actions =
    uniqueStrings(
      input.wisdom.opportunities,
    ).slice(0, 4);

  const evidence =
    uniqueStrings(
      input.wisdom.insights.map(
        (insight) =>
          insight.title,
      ),
    ).slice(0, 6);

  const opportunities =
    uniqueStrings(
      input.wisdom.opportunities,
    ).slice(0, 4);

  const risks =
    uniqueStrings(
      input.wisdom.cautions,
    ).slice(0, 4);

  return {
    summary,

    assessment,

    recommendation,

    reasoning,

    actions,

    evidence,

    opportunities,

    risks,

    tone,
  };
}

function buildSummary(
  narrative: string,
  tone: ForgeCommunicationTone,
): string {
  const trimmedNarrative =
    narrative.trim();

  if (trimmedNarrative) {
    return sentenceCase(
      trimmedNarrative,
    );
  }

  switch (tone) {
    case "encouraging":
      return (
        "Your current direction contains several encouraging signals. " +
        "Continue reinforcing the behaviors that are supporting them."
      );

    case "direct":
      return (
        "A meaningful tension needs your attention. " +
        "Choose one focused action before expanding into additional goals."
      );

    case "cautious":
      return (
        "A possible direction is emerging, but Forge needs more repeated " +
        "evidence before treating it as stable."
      );

    case "steady":
    default:
      return (
        "Your recent activity is beginning to form a coherent picture, " +
        "although Forge will continue testing that interpretation."
      );
  }
}

function buildAssessment(
  narrative: string,
  longTermThemes: string[],
  emergingIdentity: string[],
): string {
  const statements =
    uniqueStrings([
      narrative,

      ...longTermThemes.slice(
        0,
        2,
      ),

      ...emergingIdentity.slice(
        0,
        2,
      ),
    ]);

  if (statements.length === 0) {
    return (
      "Forge is still gathering enough repeated evidence to form " +
      "a durable long-term assessment."
    );
  }

  return statements
    .map(
      sentenceCase,
    )
    .join(" ");
}

function buildRecommendation(
  primaryInsight:
    | ForgeCommunicationInput[
        "wisdom"
      ]["insights"][number]
    | null,
  opportunities: string[],
  confidence: number,
): ForgeCommunicationResult[
  "recommendation"
] {
  const primaryOpportunity =
    opportunities[0] ??
    null;

  return {
    title:
      primaryInsight?.title
        ? humanizeTitle(
            primaryInsight.title,
          )
        : "Continue gathering meaningful evidence",

    explanation:
      buildRecommendationExplanation(
        primaryInsight?.explanation,
        primaryOpportunity,
      ),

    priority:
      determinePriority(
        confidence,
      ),
  };
}

function buildRecommendationExplanation(
  insight:
    | string
    | undefined,
  opportunity:
    | string
    | null,
): string {
  const statements =
    uniqueStrings([
      insight ?? "",
      opportunity ?? "",
    ]);

  if (statements.length > 0) {
    return statements
      .map(
        sentenceCase,
      )
      .join(" ");
  }

  return (
    "Choose one deliberate action that supports your longer-term direction, " +
    "then allow the result to become new evidence."
  );
}

function determinePriority(
  confidence: number,
): AdvisorPriority {
  const normalized =
    normalizeConfidence(
      confidence,
    );

  if (normalized >= 0.75) {
    return "high";
  }

  if (normalized >= 0.5) {
    return "medium";
  }

  return "low";
}

function selectCommunicationTone(
  confidence: number,
  cautionCount: number,
  opportunityCount: number,
): ForgeCommunicationTone {
  const normalized =
    normalizeConfidence(
      confidence,
    );

  if (
    cautionCount > opportunityCount &&
    normalized >= 0.65
  ) {
    return "direct";
  }

  if (
    cautionCount > 0 ||
    normalized < 0.5
  ) {
    return "cautious";
  }

  if (
    opportunityCount > cautionCount &&
    normalized >= 0.7
  ) {
    return "encouraging";
  }

  return "steady";
}

function humanizeTitle(
  title: string,
): string {
  const trimmed =
    title.trim();

  if (!trimmed) {
    return "Take one meaningful next step";
  }

  const lower =
    trimmed.toLowerCase();

  if (
    lower.includes(
      "momentum",
    )
  ) {
    return "Protect and strengthen your momentum";
  }

  if (
    lower.includes(
      "identity",
    )
  ) {
    return "Reinforce the identity you are building";
  }

  if (
    lower.includes(
      "evidence",
    )
  ) {
    return "Create clearer evidence through action";
  }

  return sentenceCase(
    trimmed,
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

function sentenceCase(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return trimmed;
  }

  const sentence =
    trimmed.charAt(0).toUpperCase() +
    trimmed.slice(1);

  return /[.!?]$/.test(
    sentence,
  )
    ? sentence
    : `${sentence}.`;
}