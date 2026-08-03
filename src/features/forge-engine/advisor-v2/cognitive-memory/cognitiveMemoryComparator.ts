import type {
  CognitiveBeliefSnapshot,
  CognitiveMemory,
  CognitiveMemorySnapshot,
  CognitiveMemoryStatus,
  CognitiveRevision,
} from "./cognitiveMemory.types";

export function compareCognitiveMemory(
  current: CognitiveMemorySnapshot,
  previous: CognitiveMemorySnapshot | null,
): CognitiveMemory {
  if (!previous) {
    return {
      current,

      previous:
        null,

      revisions:
        [],

      confidenceHistory: [
        current.confidence,
      ],
    };
  }

  const comparison =
    compareBeliefs(
      current.strongestBelief,
      previous.strongestBelief,
      current.generatedAt,
    );

  const updatedCurrent: CognitiveMemorySnapshot = {
    ...current,

    strongestBelief: {
      ...current.strongestBelief,

      status:
        comparison.status,
    },
  };

  return {
    current:
      updatedCurrent,

    previous,

    revisions:
      comparison.revision
        ? [
            comparison.revision,
          ]
        : [],

    confidenceHistory: [
      previous.confidence,
      current.confidence,
    ],
  };
}

type BeliefComparison = {
  status: CognitiveMemoryStatus;

  revision:
    CognitiveRevision | null;
};

function compareBeliefs(
  current: CognitiveBeliefSnapshot,
  previous: CognitiveBeliefSnapshot,
  recordedAt: string,
): BeliefComparison {
  const sameBelief =
    statementsMatch(
      current.statement,
      previous.statement,
    );

  const confidenceChange =
    current.confidence -
    previous.confidence;

  if (!sameBelief) {
    return {
      status:
        "revised",

      revision: {
        id:
          buildRevisionId(
            previous.statement,
            current.statement,
            recordedAt,
          ),

        previousBelief:
          previous.statement,

        currentBelief:
          current.statement,

        explanation:
          buildRevisionExplanation(
            previous,
            current,
          ),

        confidenceBefore:
          previous.confidence,

        confidenceAfter:
          current.confidence,

        recordedAt,
      },
    };
  }

  if (
    confidenceChange >= 0.1
  ) {
    return {
      status:
        "strengthened",

      revision:
        null,
    };
  }

  if (
    confidenceChange <= -0.1
  ) {
    return {
      status:
        determineWeakeningStatus(
          current,
        ),

      revision:
        null,
    };
  }

  return {
    status:
      "active",

    revision:
      null,
  };
}

function determineWeakeningStatus(
  current: CognitiveBeliefSnapshot,
): CognitiveMemoryStatus {
  if (
    current.confidence < 0.25
  ) {
    return "rejected";
  }

  return "weakened";
}

function buildRevisionExplanation(
  previous: CognitiveBeliefSnapshot,
  current: CognitiveBeliefSnapshot,
): string {
  const confidenceDirection =
    current.confidence >
    previous.confidence
      ? "increased"
      : current.confidence <
          previous.confidence
        ? "decreased"
        : "remained similar";

  return (
    "Forge revised its strongest belief because the current " +
    "interpretation no longer matches the previous one. " +
    `Confidence ${confidenceDirection} from ` +
    `${formatPercentage(
      previous.confidence,
    )} to ${formatPercentage(
      current.confidence,
    )}.`
  );
}

function statementsMatch(
  first: string,
  second: string,
): boolean {
  const normalizedFirst =
    normalizeText(
      first,
    );

  const normalizedSecond =
    normalizeText(
      second,
    );

  if (
    normalizedFirst ===
    normalizedSecond
  ) {
    return true;
  }

  const firstWords =
    new Set(
      meaningfulWords(
        normalizedFirst,
      ),
    );

  const secondWords =
    new Set(
      meaningfulWords(
        normalizedSecond,
      ),
    );

  if (
    firstWords.size === 0 ||
    secondWords.size === 0
  ) {
    return false;
  }

  const sharedCount =
    Array.from(
      firstWords,
    ).filter(
      (word) =>
        secondWords.has(word),
    ).length;

  const smallerSetSize =
    Math.min(
      firstWords.size,
      secondWords.size,
    );

  return (
    sharedCount /
      smallerSetSize >=
    0.7
  );
}

function meaningfulWords(
  value: string,
): string[] {
  return value
    .split(" ")
    .filter(
      (word) =>
        word.length >= 4,
    );
}

function buildRevisionId(
  previousBelief: string,
  currentBelief: string,
  recordedAt: string,
): string {
  const source =
    `${previousBelief}:${currentBelief}:${recordedAt}`;

  return `cognitive-revision-${simpleHash(
    source,
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

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    normalizeConfidence(
      value,
    ) * 100,
  )}%`;
}

function normalizeConfidence(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}