import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  ConfidenceResult,
} from "../confidence/confidence.types";

import type {
  ForgeCommunicationTone,
} from "./communication.types";

/**
 * Forge does not describe data.
 *
 * Forge describes what the data means
 * for the person's journey.
 */

export function humanizeEvidence(
  evidence: AdvisorEvidence,
): string {
  const statement =
    evidence.statement.trim();

  const category =
    evidence.category;

  if (
    category === "momentum" &&
    evidence.polarity === "negative"
  ) {
    return "Your momentum has slowed, which means your recent actions are not reinforcing your direction as consistently as before.";
  }

  if (
    category === "momentum" &&
    evidence.polarity === "positive"
  ) {
    return "Your recent actions are building momentum and making your direction easier to sustain.";
  }

  if (
    category === "identity" &&
    evidence.polarity === "positive"
  ) {
    return "Your recent choices are reinforcing the identity you are trying to build.";
  }

  if (
    category === "identity" &&
    evidence.polarity === "negative"
  ) {
    return "Your recent behavior has not supported this identity as consistently as it could.";
  }

  if (
    category === "vision" &&
    evidence.polarity === "positive"
  ) {
    return "Your current direction still appears aligned with the vision you set for yourself.";
  }

  if (
    category === "vision" &&
    evidence.polarity === "negative"
  ) {
    return "There is some distance between your current behavior and the direction you described for yourself.";
  }

  if (
    category === "pattern" &&
    evidence.polarity === "neutral"
  ) {
    return "A possible pattern is beginning to emerge, but Forge needs more evidence before treating it as stable.";
  }

  if (
    category === "prediction"
  ) {
    return "Forge is beginning to see where this pattern may lead, but the outcome is not settled.";
  }

  if (
    category === "memory"
  ) {
    return "Looking back across your recent history, this appears connected to a broader pattern rather than a single isolated moment.";
  }

  if (
    category === "belief"
  ) {
    return "The beliefs Forge has formed about your behavior are beginning to influence this assessment.";
  }

  if (
    category === "trend" &&
    evidence.polarity === "negative"
  ) {
    return "The recent trend is moving in a less helpful direction, although it may still be early enough to change.";
  }

  if (
    category === "trend" &&
    evidence.polarity === "positive"
  ) {
    return "The recent trend suggests that your consistency is improving.";
  }

  return sentenceCase(
    statement,
  );
}

export function describeConfidence(
  confidence: ConfidenceResult,
): string {
  const score =
    normalizeConfidence(
      confidence.score,
    );

  if (score >= 0.8) {
    return "The evidence is consistent enough that Forge can say this with high confidence.";
  }

  if (score >= 0.6) {
    return "The evidence points in a fairly consistent direction, although some uncertainty remains.";
  }

  if (score >= 0.4) {
    return "Forge is beginning to see a direction, but the evidence is still mixed.";
  }

  return "There is not yet enough consistent evidence to draw a strong conclusion.";
}

export function selectTone(
  positiveCount: number,
  negativeCount: number,
  confidence: number,
): ForgeCommunicationTone {
  const normalizedConfidence =
    normalizeConfidence(
      confidence,
    );

  if (
    negativeCount > positiveCount &&
    normalizedConfidence >= 0.65
  ) {
    return "direct";
  }

  if (
    normalizedConfidence < 0.5
  ) {
    return "cautious";
  }

  if (
    positiveCount > negativeCount
  ) {
    return "encouraging";
  }

  return "steady";
}

export function normalizeConfidence(
  confidence: number,
): number {
  if (confidence > 1) {
    return Math.min(
      confidence / 100,
      1,
    );
  }

  return Math.max(
    0,
    Math.min(
      confidence,
      1,
    ),
  );
}

function sentenceCase(
  value: string,
): string {
  if (!value) {
    return value;
  }

  const sentence =
    value.charAt(0).toUpperCase() +
    value.slice(1);

  return /[.!?]$/.test(
    sentence,
  )
    ? sentence
    : `${sentence}.`;
}