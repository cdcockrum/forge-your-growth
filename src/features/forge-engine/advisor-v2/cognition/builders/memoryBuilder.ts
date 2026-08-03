
import type {
  AdvisorResult,
} from "../../advisor.types";

import type {
  MemoryViewModel,
} from "../cognitiveViewModel";

export function buildMemoryViewModel(
  advisor: AdvisorResult,
): MemoryViewModel {
  const {
    current,
    previous,
    revisions,
  } = advisor.cognitiveMemory;

  const currentBelief =
    current.strongestBelief;

  const previousBelief =
    previous?.strongestBelief ??
    null;

  const previousConfidence =
    previousBelief?.confidence ??
    null;

  const confidenceChange =
    previousConfidence === null
      ? null
      : currentBelief.confidence -
        previousConfidence;

  return {
    strongestBelief:
      currentBelief.statement,

    confidence:
      normalizeConfidence(
        currentBelief.confidence,
      ),

    status:
      currentBelief.status,

    revisionCount:
      revisions.length,

    previousBelief:
      previousBelief?.statement ??
      null,

    previousConfidence:
      previousConfidence === null
        ? null
        : normalizeConfidence(
            previousConfidence,
          ),

    confidenceChange:
      confidenceChange === null
        ? null
        : normalizeDelta(
            confidenceChange,
          ),

    lastRevision:
      revisions.at(-1) ?? null,
  };
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

function normalizeDelta(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return Math.max(
    -1,
    Math.min(
      normalized,
      1,
    ),
  );
}