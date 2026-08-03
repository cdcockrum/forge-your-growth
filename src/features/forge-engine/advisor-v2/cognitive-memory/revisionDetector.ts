import type {
  CognitiveBeliefSnapshot,
  CognitiveMemoryStatus,
  CognitiveRevision,
} from "./cognitiveMemory.types";

export type RevisionAnalysis = {
  status: CognitiveMemoryStatus;

  revision: CognitiveRevision | null;

  confidenceDelta: number;

  beliefChanged: boolean;
};

export function detectRevision(
  previous: CognitiveBeliefSnapshot,
  current: CognitiveBeliefSnapshot,
): RevisionAnalysis {
  const delta =
    current.confidence -
    previous.confidence;

  const beliefChanged =
    !sameBelief(
      previous.statement,
      current.statement,
    );

  if (beliefChanged) {
    return {
      status: "revised",

      confidenceDelta: delta,

      beliefChanged: true,

      revision: {
        id:
          buildRevisionId(
            previous,
            current,
          ),

        previousBelief:
          previous.statement,

        currentBelief:
          current.statement,

        explanation:
          explainRevision(
            previous,
            current,
            delta,
          ),

        confidenceBefore:
          previous.confidence,

        confidenceAfter:
          current.confidence,

        recordedAt:
          current.recordedAt,
      },
    };
  }

  if (delta >= 0.10) {
    return {
      status:
        "strengthened",

      confidenceDelta:
        delta,

      beliefChanged:
        false,

      revision:
        null,
    };
  }

  if (delta <= -0.10) {
    return {
      status:
        current.confidence < 0.25
          ? "rejected"
          : "weakened",

      confidenceDelta:
        delta,

      beliefChanged:
        false,

      revision:
        null,
    };
  }

  return {
    status:
      "active",

    confidenceDelta:
      delta,

    beliefChanged:
      false,

    revision:
      null,
  };
}

function explainRevision(
  previous: CognitiveBeliefSnapshot,
  current: CognitiveBeliefSnapshot,
  delta: number,
): string {
  const direction =
    delta > 0
      ? "increased"
      : delta < 0
      ? "decreased"
      : "remained stable";

  return (
    `Forge revised its strongest belief because the ` +
    `new evidence supports a different interpretation. ` +
    `Confidence ${direction} from ` +
    `${Math.round(previous.confidence * 100)}% to ` +
    `${Math.round(current.confidence * 100)}%.`
  );
}

function sameBelief(
  first: string,
  second: string,
): boolean {
  return normalize(first) === normalize(second);
}

function normalize(
  value: string,
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ");
}

function buildRevisionId(
  previous: CognitiveBeliefSnapshot,
  current: CognitiveBeliefSnapshot,
): string {
  return [
    "revision",
    hash(previous.statement),
    hash(current.statement),
    current.recordedAt,
  ].join("-");
}

function hash(
  value: string,
): string {
  let hash = 0;

  for (const character of value) {
    hash =
      (hash * 31 +
        character.charCodeAt(0)) >>> 0;
  }

  return hash.toString(36);
}