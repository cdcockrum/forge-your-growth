import type {
  ForgeCommunicationInput,
} from "./communication.types";

import type {
  Narrative,
  NarrativeConfidence,
  NarrativeState,
  NarrativeTheme,
} from "./narrative.types";

type CommunicationEvidence =
  ForgeCommunicationInput["evidence"];

export function buildNarrative(
  input: ForgeCommunicationInput,
): Narrative {
  const identityEvidence =
    getIdentityEvidence(
      input.evidence,
    );

  const momentumEvidence =
    getMomentumEvidence(
      input.evidence,
    );

  const visionEvidence =
    getVisionEvidence(
      input.evidence,
    );

  const themes = [
    scoreTheme(
      "identity",
      identityEvidence,
    ),

    scoreTheme(
      "momentum",
      momentumEvidence,
    ),

    scoreTheme(
      "vision",
      visionEvidence,
    ),
  ].sort(
    (left, right) =>
      right.importance -
      left.importance,
  );

  const primary =
    themes[0];

  const secondary =
    themes.find(
      (theme) =>
        theme.theme !==
          primary.theme &&
        theme.evidenceCount > 0,
    );

  return {
    primaryTheme:
      primary.theme,

    primaryState:
      primary.state,

    secondaryTheme:
      secondary?.theme,

    confidence:
      determineNarrativeConfidence(
        input,
        primary,
      ),

    recommendation:
      determineRecommendation(
        primary.theme,
        primary.state,
      ),
  };
}

interface ThemeScore {
  theme: NarrativeTheme;

  state: NarrativeState;

  importance: number;

  evidenceCount: number;
}

function scoreTheme(
  theme: NarrativeTheme,
  evidence: CommunicationEvidence,
): ThemeScore {
  if (
    evidence.length === 0
  ) {
    return {
      theme,

      state:
        "uncertain",

      importance:
        0,

      evidenceCount:
        0,
    };
  }

  const positiveWeight =
    evidence
      .filter(
        (item) =>
          item.polarity ===
          "positive",
      )
      .reduce(
        (total, item) =>
          total +
          evidenceWeight(
            item,
          ),
        0,
      );

  const negativeWeight =
    evidence
      .filter(
        (item) =>
          item.polarity ===
          "negative",
      )
      .reduce(
        (total, item) =>
          total +
          evidenceWeight(
            item,
          ),
        0,
      );

  const totalWeight =
    evidence.reduce(
      (total, item) =>
        total +
        evidenceWeight(
          item,
        ),
      0,
    );

  return {
    theme,

    state:
      determineState(
        positiveWeight,
        negativeWeight,
      ),

    importance:
      totalWeight,

    evidenceCount:
      evidence.length,
  };
}

function determineState(
  positiveWeight: number,
  negativeWeight: number,
): NarrativeState {
  const total =
    positiveWeight +
    negativeWeight;

  if (total === 0) {
    return "uncertain";
  }

  const difference =
    positiveWeight -
    negativeWeight;

  const relativeDifference =
    difference / total;

  if (
    relativeDifference >=
    0.2
  ) {
    return "strengthening";
  }

  if (
    relativeDifference <=
    -0.2
  ) {
    return "slowing";
  }

  return "steady";
}

function determineNarrativeConfidence(
  input: ForgeCommunicationInput,
  primary: ThemeScore,
): NarrativeConfidence {
  const confidence =
    normalizeScore(
      input.confidence.score,
    );

  if (
    primary.evidenceCount === 0 ||
    confidence < 0.4
  ) {
    return "low";
  }

  if (
    confidence >= 0.75 &&
    primary.evidenceCount >= 2
  ) {
    return "high";
  }

  return "medium";
}

function determineRecommendation(
  theme: NarrativeTheme,
  state: NarrativeState,
): string {
  if (
    state ===
    "slowing"
  ) {
    return "restoreConsistency";
  }

  if (
    state ===
    "strengthening"
  ) {
    return theme ===
      "momentum"
      ? "continueGrowth"
      : "maintainConsistency";
  }

  if (
    state ===
    "steady"
  ) {
    return "maintainConsistency";
  }

  return "gatherEvidence";
}

function getIdentityEvidence(
  evidence: CommunicationEvidence,
): CommunicationEvidence {
  return evidence.filter(
    (item) =>
      item.category ===
        "identity" ||
      item.category ===
        "memory" ||
      item.category ===
        "belief",
  );
}

function getMomentumEvidence(
  evidence: CommunicationEvidence,
): CommunicationEvidence {
  return evidence.filter(
    (item) =>
      item.category ===
        "momentum" ||
      item.category ===
        "progress" ||
      item.category ===
        "trend",
  );
}

function getVisionEvidence(
  evidence: CommunicationEvidence,
): CommunicationEvidence {
  return evidence.filter(
    (item) =>
      item.category ===
        "vision" ||
      item.tags.includes(
        "vision",
      ) ||
      item.tags.includes(
        "alignment",
      ),
  );
}

function evidenceWeight(
  item: CommunicationEvidence[number],
): number {
  return (
    normalizeScore(
      item.confidence,
    ) *
    normalizeScore(
      item.impact,
    )
  );
}

function normalizeScore(
  value: number,
): number {
  if (value > 1) {
    return Math.min(
      value / 100,
      1,
    );
  }

  return Math.max(
    0,
    Math.min(
      value,
      1,
    ),
  );
}