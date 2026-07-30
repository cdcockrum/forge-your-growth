import {
  describeConfidence,
  humanizeEvidence,
  normalizeConfidence,
  selectTone,
} from "./language";

import type {
  ForgeCommunicationInput,
  ForgeCommunicationResult,
} from "./communication.types";

import {
  composeConversation,
} from "./conversation";

import {
  buildNarrative,
} from "./narrative";

export function runCommunicationPipeline(
  input: ForgeCommunicationInput,
): ForgeCommunicationResult {
  const positiveEvidence =
    input.evidence.filter(
      (item) =>
        item.polarity ===
        "positive",
    );

  const negativeEvidence =
    input.evidence.filter(
      (item) =>
        item.polarity ===
        "negative",
    );

  const tone =
    selectTone(
      positiveEvidence.length,
      negativeEvidence.length,
      input.confidence.score,
    );

 
const narrative =
  buildNarrative(
    input,
  );

const summary =
  composeConversation(
    narrative,
  );


  const strongestEvidence =
    [...input.evidence]
      .sort(
        (left, right) =>
          evidenceWeight(right) -
          evidenceWeight(left),
      )
      .slice(0, 6);

  const primaryRecommendation =
    input.reasoning
      .recommendations[0] ??
    null;

   const assessment =
    buildAssessment(
      strongestEvidence.map(
        humanizeEvidence,
      ),
      describeConfidence(
        input.confidence,
      ),
    );

  const recommendation = {
    title:
      humanizeRecommendationTitle(
        primaryRecommendation
          ?.title,
      ),

    explanation:
      humanizeRecommendationExplanation(
        primaryRecommendation
          ?.description,
        primaryRecommendation
          ?.rationale,
      ),

    priority:
      primaryRecommendation
        ?.priority ??
      "low",
  };

  const reasoning =
    uniqueStrings([
      ...strongestEvidence
        .slice(0, 4)
        .map(
          humanizeEvidence,
        ),

      describeConfidence(
        input.confidence,
      ),
    ]);

  const actions =
    uniqueStrings(
      input.reasoning
        .recommendations
        .flatMap(
          (item) => [
            item.description,
            ...item.rationale,
          ],
        )
        .map(
          humanizeAction,
        )
        .slice(0, 4),
    );

  return {
    summary,

    assessment,

    recommendation,

    reasoning,

    actions,

    evidence:
      strongestEvidence.map(
        humanizeEvidence,
      ),

    opportunities:
      positiveEvidence
        .sort(
          (left, right) =>
            evidenceWeight(right) -
            evidenceWeight(left),
        )
        .slice(0, 3)
        .map(
          humanizeEvidence,
        ),

    risks:
      negativeEvidence
        .sort(
          (left, right) =>
            evidenceWeight(right) -
            evidenceWeight(left),
        )
        .slice(0, 3)
        .map(
          humanizeEvidence,
        ),

    tone,
  };
}

function buildSummary(
  evidence: string[],
  tone:
    ForgeCommunicationResult["tone"],
): string {
  const primary =
    evidence[0] ??
    "Forge is still learning how your recent actions connect to your longer-term direction.";

  switch (tone) {
    case "encouraging":
      return `Looking across your recent activity, one encouraging theme stands out. ${primary}`;

    case "direct":
      return `One thing needs your attention right now. ${primary}`;

    case "cautious":
      return `A possible direction is beginning to emerge, although it is still too early to treat it as settled. ${primary}`;

    case "steady":
    default:
      return `Looking across your recent activity, a fairly consistent picture is beginning to emerge. ${primary}`;
  }
}

function buildAssessment(
  evidence: string[],
  confidenceStatement: string,
): string {
  const observations =
    uniqueStrings(
      evidence,
    ).slice(
      0,
      3,
    );

  if (
    observations.length === 0
  ) {
    return confidenceStatement;
  }

  return [
    ...observations,
    confidenceStatement,
  ].join(
    " ",
  );
}

function humanizeRecommendationTitle(
  title:
    | string
    | undefined,
): string {
  if (!title?.trim()) {
    return "Take one meaningful next step";
  }

  const normalized =
    title
      .trim()
      .toLowerCase();

  if (
    normalized.includes(
      "recommendation",
    )
  ) {
    return "Turn this insight into practice";
  }

  if (
    normalized.includes(
      "momentum",
    )
  ) {
    return "Rebuild momentum with one clear action";
  }

  if (
    normalized.includes(
      "identity",
    )
  ) {
    return "Reinforce the identity you are building";
  }

  return sentenceCase(
    title,
  );
}

function humanizeRecommendationExplanation(
  description:
    | string
    | undefined,
  rationale:
    | string[]
    | undefined,
): string {
  const candidates =
    uniqueStrings([
      description ?? "",
      ...(rationale ?? []),
    ]);

  const first =
    candidates[0];

  if (!first) {
    return "Choose one action that clearly supports the person you are trying to become, then use the result as new evidence.";
  }

  return humanizeAction(
    first,
  );
}

function humanizeAction(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return trimmed;
  }

  const lower =
    trimmed.toLowerCase();

  if (
    lower.includes(
      "continue reinforcing",
    )
  ) {
    return "Choose one meaningful action that reinforces this direction today.";
  }

  if (
    lower.includes(
      "monitor",
    )
  ) {
    return "Pay attention to whether this becomes a repeated pattern or remains an isolated event.";
  }

  if (
    lower.includes(
      "complete",
    ) &&
    lower.includes(
      "practice",
    )
  ) {
    return "Complete one meaningful practice session and treat it as the first step toward rebuilding consistency.";
  }

  return sentenceCase(
    trimmed,
  );
}

function evidenceWeight(
  item: ForgeCommunicationInput[
    "evidence"
  ][number],
): number {
  return (
    normalizeConfidence(
      item.confidence,
    ) *
    item.impact
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
    trimmed
      .charAt(0)
      .toUpperCase() +
    trimmed.slice(1);

  return /[.!?]$/.test(
    sentence,
  )
    ? sentence
    : `${sentence}.`;
}



function buildNarrativeSummary(
  identity: ForgeCommunicationInput["evidence"],
  momentum: ForgeCommunicationInput["evidence"],
  vision: ForgeCommunicationInput["evidence"],
): string {
  const hasIdentity = identity.length > 0;
  const hasMomentum = momentum.length > 0;
  const hasVision = vision.length > 0;

  if (hasIdentity && hasMomentum && hasVision) {
    return "Your recent activity paints a coherent picture. The person you're becoming is still visible, your momentum is evolving, and your daily actions continue to relate to your longer-term direction.";
  }

  if (hasIdentity && hasMomentum) {
    return "Your recent actions continue to shape your identity, although the pace of that growth has shifted.";
  }

  if (hasMomentum && hasVision) {
    return "Your current momentum is beginning to reveal how closely your daily choices align with your long-term direction.";
  }

  return "Forge is continuing to learn from your recent activity.";
}

