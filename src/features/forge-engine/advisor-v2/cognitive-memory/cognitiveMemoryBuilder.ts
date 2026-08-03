import type {
  EpistemologyResult,
} from "../epistemology";

import type {
  Wisdom,
} from "../wisdom";

import type {
  CognitiveAssumptionSnapshot,
  CognitiveBeliefSnapshot,
  CognitiveMemorySnapshot,
} from "./cognitiveMemory.types";

export type BuildCognitiveMemorySnapshotOptions = {
  wisdom: Wisdom;

  epistemology: EpistemologyResult;

  recordedAt?: string;
};

export function buildCognitiveMemorySnapshot({
  wisdom,
  epistemology,
  recordedAt = new Date().toISOString(),
}: BuildCognitiveMemorySnapshotOptions): CognitiveMemorySnapshot {
  return {
    id:
      buildSnapshotId(
        recordedAt,
      ),

    generatedAt:
      recordedAt,

    strongestBelief:
      buildStrongestBelief(
        wisdom,
        epistemology,
        recordedAt,
      ),

    assumptions:
      buildAssumptions(
        epistemology,
        recordedAt,
      ),

    confidence: {
      value:
        normalizeConfidence(
          wisdom.confidence,
        ),

      recordedAt,
    },

    revisionConditions:
      uniqueStrings(
        epistemology
          .couldChangeMyMind,
      ),
  };
}

function buildStrongestBelief(
  wisdom: Wisdom,
  epistemology: EpistemologyResult,
  recordedAt: string,
): CognitiveBeliefSnapshot {
  const primaryInsight =
    wisdom.insights[0] ??
    null;

  const statement =
    epistemology.strongestBelief
      .trim() ||
    primaryInsight?.explanation
      .trim() ||
    wisdom.narrative.trim() ||
    "Forge does not yet have enough evidence to form a stable belief.";

  const confidence =
    normalizeConfidence(
      primaryInsight?.confidence ??
      wisdom.confidence,
    );

  return {
    id:
      buildStableId(
        "cognitive-belief",
        statement,
      ),

    statement,

    confidence,

    strength:
      epistemology.beliefStrength,

    status:
      determineInitialStatus(
        epistemology.beliefStrength,
      ),

    evidenceQuality:
      epistemology.evidenceQuality,

    recordedAt,
  };
}

function buildAssumptions(
  epistemology: EpistemologyResult,
  recordedAt: string,
): CognitiveAssumptionSnapshot[] {
  return uniqueStrings(
    epistemology.assumptions,
  ).map(
    (statement) => ({
      id:
        buildStableId(
          "cognitive-assumption",
          statement,
        ),

      statement,

      status:
        determineAssumptionStatus(
          statement,
          epistemology,
        ),

      recordedAt,
    }),
  );
}

function determineInitialStatus(
  strength:
    CognitiveBeliefSnapshot[
      "strength"
    ],
): CognitiveBeliefSnapshot[
  "status"
] {
  switch (strength) {
    case "stable":
      return "strengthened";

    case "developing":
      return "active";

    case "tentative":
    default:
      return "active";
  }
}

function determineAssumptionStatus(
  assumption: string,
  epistemology: EpistemologyResult,
): CognitiveAssumptionSnapshot[
  "status"
] {
  const challenged =
    epistemology.uncertainties.some(
      (uncertainty) =>
        hasMeaningfulOverlap(
          assumption,
          uncertainty,
        ),
    );

  if (challenged) {
    return "unverified";
  }

  const supported =
    epistemology.evidenceQuality ===
      "strong" &&
    epistemology.beliefStrength ===
      "stable";

  return supported
    ? "supported"
    : "unverified";
}

function hasMeaningfulOverlap(
  first: string,
  second: string,
): boolean {
  const firstWords =
    meaningfulWords(
      first,
    );

  const secondWords =
    new Set(
      meaningfulWords(
        second,
      ),
    );

  const sharedWordCount =
    firstWords.filter(
      (word) =>
        secondWords.has(word),
    ).length;

  return sharedWordCount >= 2;
}

function meaningfulWords(
  value: string,
): string[] {
  return normalizeText(
    value,
  )
    .split(" ")
    .filter(
      (word) =>
        word.length >= 5,
    );
}

function uniqueStrings(
  values: string[],
): string[] {
  const seen =
    new Set<string>();

  return values
    .map(
      (value) =>
        value.trim(),
    )
    .filter(
      (value) => {
        const key =
          normalizeText(
            value,
          );

        if (
          !key ||
          seen.has(key)
        ) {
          return false;
        }

        seen.add(key);

        return true;
      },
    );
}

function buildSnapshotId(
  recordedAt: string,
): string {
  return `cognitive-snapshot-${sanitizeId(
    recordedAt,
  )}`;
}

function buildStableId(
  prefix: string,
  value: string,
): string {
  return `${prefix}-${simpleHash(
    normalizeText(
      value,
    ),
  )}`;
}

function simpleHash(
  value: string,
): string {
  let hash = 0;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash =
      (
        hash * 31 +
        value.charCodeAt(index)
      ) >>> 0;
  }

  return hash.toString(
    36,
  );
}

function sanitizeId(
  value: string,
): string {
  return value
    .replace(
      /[^a-zA-Z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function normalizeText(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9\s]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
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