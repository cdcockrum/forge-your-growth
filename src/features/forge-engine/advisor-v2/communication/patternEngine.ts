import {
  patternLibrary,
} from "./patternLibrary";

import type {
  CommunicationEvidence,
  DetectedPattern,
} from "./pattern.types";

export function detectPatterns(
  evidence: CommunicationEvidence,
): DetectedPattern[] {
  if (evidence.length === 0) {
    return [];
  }

  return patternLibrary
    .map(
      (definition) =>
        definition.detect(
          evidence,
        ),
    )
    .filter(
      (
        pattern,
      ): pattern is DetectedPattern =>
        pattern !== null,
    )
    .sort(
      (left, right) =>
        right.importance -
        left.importance,
    );
}