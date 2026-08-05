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

  const primaryOpportunity =
    input.wisdom.opportunities[0] ??
    null;

  const summary =
    buildExecutiveSummary(
      primaryInsight,
      tone,
    );

  const assessment =
    buildAssessment(
      input.wisdom.longTermThemes,
      input.wisdom.emergingIdentity,
    );

  const recommendation =
    buildRecommendation(
      primaryInsight,
      primaryOpportunity,
      input.confidence.score,
    );

  const reservedLanguage = [
    summary,
    assessment,
    recommendation.explanation,
  ];

  const reasoning =
    uniqueDistinctStrings(
      [
        ...input.wisdom.insights.map(
          (insight) =>
            insight.explanation,
        ),

        ...input.wisdom.longTermThemes,
      ],
      reservedLanguage,
    ).slice(0, 4);

  const actions =
    buildActions(
      input.wisdom.opportunities,
      primaryOpportunity,
    );

  const evidence =
    uniqueStrings(
      input.wisdom.insights.map(
        (insight) =>
          insight.title,
      ),
    ).slice(0, 4);

  const opportunities =
    uniqueStrings(
      input.wisdom.opportunities,
    ).slice(0, 3);

  const risks =
    uniqueStrings(
      input.wisdom.cautions,
    ).slice(0, 3);

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

function buildExecutiveSummary(
  primaryInsight:
    | ForgeCommunicationInput[
        "wisdom"
      ]["insights"][number]
    | null,
  tone: ForgeCommunicationTone,
): string {
  const insight =
    primaryInsight?.explanation
      .trim() ?? "";

  if (insight) {
    return ensureSentence(
      insight,
    );
  }

  switch (tone) {
    case "encouraging":
      return "Your recent choices are beginning to reinforce the direction you want to take.";

    case "direct":
      return "One meaningful tension deserves your attention before you add anything new.";

    case "cautious":
      return "A possible direction is emerging, but it needs more consistent behavior before Forge can treat it as established.";

    case "steady":
    default:
      return "Your recent activity is beginning to form a clearer picture.";
  }
}

function buildAssessment(
  longTermThemes: string[],
  emergingIdentity: string[],
): string {
  const theme =
    longTermThemes[0]?.trim() ??
    "";

  const identity =
    emergingIdentity[0]?.trim() ??
    "";

  if (
    theme &&
    identity &&
    !expressesSameThought(
      theme,
      identity,
    )
  ) {
    return [
      `Over time, ${lowercaseFirst(
        ensureSentence(theme),
      )}`,

      `The clearest identity signal is this: ${lowercaseFirst(
        ensureSentence(identity),
      )}`,
    ].join(" ");
  }

  if (theme) {
    return `Over time, ${lowercaseFirst(
      ensureSentence(theme),
    )}`;
  }

  if (identity) {
    return `The clearest identity signal is this: ${lowercaseFirst(
      ensureSentence(identity),
    )}`;
  }

  return "Forge does not yet have enough repeated evidence to describe a durable change.";
}

function buildRecommendation(
  primaryInsight:
    | ForgeCommunicationInput[
        "wisdom"
      ]["insights"][number]
    | null,
  primaryOpportunity:
    | string
    | null,
  confidence: number,
): ForgeCommunicationResult[
  "recommendation"
] {
  return {
    title:
      primaryInsight?.title
        ? humanizeTitle(
            primaryInsight.title,
          )
        : "Choose one meaningful next step",

    explanation:
      primaryOpportunity
        ? ensureSentence(
            primaryOpportunity,
          )
        : "Choose one action small enough to repeat, then let the result become new evidence.",

    priority:
      determinePriority(
        confidence,
      ),
  };
}

function buildActions(
  opportunities: string[],
  primaryOpportunity: string | null,
): string[] {
  const remaining =
    opportunities.filter(
      (opportunity) =>
        !primaryOpportunity ||
        !expressesSameThought(
          opportunity,
          primaryOpportunity,
        ),
    );

  if (remaining.length > 0) {
    return uniqueStrings(
      remaining.map(
        ensureSentence,
      ),
    ).slice(0, 3);
  }

  return [
    "Choose the smallest version of this recommendation that you can complete.",
    "Notice what helps or prevents you from following through.",
    "Use the result to adjust the next practice.",
  ];
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
    cautionCount >
      opportunityCount &&
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
    opportunityCount >
      cautionCount &&
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
    return "Choose one meaningful next step";
  }

  const lower =
    trimmed.toLowerCase();

  if (
    lower.includes("identity")
  ) {
    return "Reinforce the identity you are building";
  }

  if (
    lower.includes("momentum")
  ) {
    return "Protect the momentum you have created";
  }

  if (
    lower.includes("direction")
  ) {
    return "Continue strengthening this direction";
  }

  if (
    lower.includes("evidence")
  ) {
    return "Create clearer evidence through action";
  }

  return cleanHeadline(
    trimmed,
  );
}

function uniqueDistinctStrings(
  values: string[],
  reserved: string[],
): string[] {
  return uniqueStrings(
    values,
  ).filter(
    (value) =>
      !reserved.some(
        (used) =>
          expressesSameThought(
            value,
            used,
          ),
      ),
  );
}

function uniqueStrings(
  values: string[],
): string[] {
  const seen =
    new Set<string>();

  return values.filter(
    (value) => {
      const trimmed =
        value.trim();

      if (!trimmed) {
        return false;
      }

      const key =
        normalizeForComparison(
          trimmed,
        );

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}

function expressesSameThought(
  left: string,
  right: string,
): boolean {
  const leftWords =
    meaningfulWords(left);

  const rightWords =
    meaningfulWords(right);

  if (
    leftWords.size === 0 ||
    rightWords.size === 0
  ) {
    return false;
  }

  const overlap =
    [...leftWords].filter(
      (word) =>
        rightWords.has(word),
    ).length;

  return (
    overlap /
      Math.min(
        leftWords.size,
        rightWords.size,
      ) >=
    0.6
  );
}

function meaningfulWords(
  value: string,
): Set<string> {
  const ignored =
    new Set([
      "a",
      "an",
      "and",
      "are",
      "as",
      "at",
      "be",
      "for",
      "from",
      "in",
      "is",
      "it",
      "of",
      "on",
      "that",
      "the",
      "this",
      "to",
      "your",
    ]);

  return new Set(
    normalizeForComparison(
      value,
    )
      .split(" ")
      .filter(
        (word) =>
          word.length > 1 &&
          !ignored.has(word),
      ),
  );
}

function normalizeForComparison(
  value: string,
): string {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9\s]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function cleanHeadline(
  value: string,
): string {
  const cleaned =
    value
      .trim()
      .replace(
        /,\s*strongest\b/gi,
        "",
      )
      .replace(
        /[.!?]+$/,
        "",
      );

  if (!cleaned) {
    return "Choose one meaningful next step";
  }

  return (
    cleaned.charAt(0)
      .toUpperCase() +
    cleaned.slice(1)
  );
}

function ensureSentence(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  const sentence =
    trimmed.charAt(0)
      .toUpperCase() +
    trimmed.slice(1);

  return /[.!?]$/.test(sentence)
    ? sentence
    : `${sentence}.`;
}

function lowercaseFirst(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  return (
    trimmed.charAt(0)
      .toLowerCase() +
    trimmed.slice(1)
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