import type {
  NarrativeInput,
  NarrativeSignal,
  WeeklyNarrative,
} from "./narrative.types";

import {
  buildNarrativeSignals,
} from "./narrativeSignals";

export function buildWeeklyNarrative(
  input: NarrativeInput,
): WeeklyNarrative {
  const signals = buildNarrativeSignals(input);

  const identitySignals = selectSignals(
    signals,
    "identity",
    3,
  );

  const victorySignals = selectSignals(
    signals,
    "victory",
    3,
  );

  const obstacleSignals = selectSignals(
    signals,
    "obstacle",
    3,
  );

  const focusSignal = signals.find(
    (signal) =>
      signal.category === "focus",
  );

  return {
    title: buildTitle(
      input,
      identitySignals,
    ),

    opening: buildOpening(input),

    identityGrowth:
      identitySignals.map(
        (signal) => signal.text,
      ),

    victories:
      victorySignals.map(
        (signal) => signal.text,
      ),

    obstacles:
      obstacleSignals.map(
        (signal) => signal.text,
      ),

    coachReflection:
      buildCoachReflection(input),

    nextWeekFocus:
      focusSignal?.text ??
      buildDefaultFocus(input),

    closing:
      buildClosing(input),

    signals,
  };
}

function selectSignals(
  signals: NarrativeSignal[],
  category: NarrativeSignal["category"],
  limit: number,
): NarrativeSignal[] {
  return signals
    .filter(
      (signal) =>
        signal.category === category,
    )
    .slice(0, limit);
}

function buildTitle(
  input: NarrativeInput,
  identitySignals: NarrativeSignal[],
): string {
  const strongestIdentity =
    input.identity.strongestIdentity;

  if (strongestIdentity) {
    return `${getIdentityLabel(
      strongestIdentity,
    )} in Practice`;
  }

  if (identitySignals.length > 0) {
    return "Becoming Through Practice";
  }

  if (input.progress.completionRate >= 80) {
    return "A Week of Follow-Through";
  }

  if (input.progress.completionRate >= 50) {
    return "The Rhythm Takes Shape";
  }

  return "Returning to the Forge";
}

function buildOpening(
  input: NarrativeInput,
): string {
  const strongestIdentity =
    input.identity.strongestIdentity
      ? getIdentityLabel(
          input.identity.strongestIdentity,
        )
      : null;

  if (
    strongestIdentity &&
    input.progress.completionRate >= 75
  ) {
    return `This week, your actions provided meaningful evidence of the ${strongestIdentity} you are becoming.`;
  }

  if (input.progress.completedSessions > 0) {
    return `This week, you completed ${input.progress.completedSessions} ${
      input.progress.completedSessions === 1
        ? "practice"
        : "practices"
    } and continued shaping your rhythm through deliberate action.`;
  }

  return "This week offered a chance to reconsider the rhythm you want to carry forward.";
}

function buildCoachReflection(
  input: NarrativeInput,
): string {
  const primaryRecommendation =
    input.coach.recommendations[0];

  if (primaryRecommendation) {
    return `${input.coach.headline}: ${primaryRecommendation.message}`;
  }

  return input.coach.message;
}

function buildDefaultFocus(
  input: NarrativeInput,
): string {
  if (
    input.progress.neglectedSkill &&
    input.progress.neglectedSkill
      .daysSincePracticed !== null
  ) {
    return `Return to ${input.progress.neglectedSkill.name} with one manageable practice next week.`;
  }

  if (input.progress.completionRate < 50) {
    return "Reduce the plan to a smaller set of commitments that you can consistently keep.";
  }

  if (input.progress.strongestSkill) {
    return `Protect the rhythm you have created around ${input.progress.strongestSkill.name}.`;
  }

  return "Choose one meaningful practice and make it the foundation of next week.";
}

function buildClosing(
  input: NarrativeInput,
): string {
  const northStar =
    input.vision?.north_star?.trim();

  if (northStar) {
    return `Keep moving toward your North Star: “${northStar}”`;
  }

  if (input.progress.completionRate >= 80) {
    return "The rhythm is working. Protect it without making it heavier.";
  }

  return "Becoming is built through the next deliberate action, not a perfect week.";
}

function getIdentityLabel(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value !== "object" ||
    value === null
  ) {
    return "Identity";
  }

  const record =
    value as Record<string, unknown>;

  if (
    typeof record.identity === "object" &&
    record.identity !== null
  ) {
    const identity =
      record.identity as Record<
        string,
        unknown
      >;

    if (
      typeof identity.name === "string"
    ) {
      return identity.name;
    }

    if (
      typeof identity.key === "string"
    ) {
      return identity.key;
    }
  }

  if (
    typeof record.identity === "string"
  ) {
    return record.identity;
  }

  if (
    typeof record.name === "string"
  ) {
    return record.name;
  }

  if (
    typeof record.title === "string"
  ) {
    return record.title;
  }

  if (
    typeof record.label === "string"
  ) {
    return record.label;
  }

  if (
    typeof record.skillName === "string"
  ) {
    return record.skillName;
  }

  return "Identity";
}