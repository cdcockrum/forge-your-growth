import type {
  PracticeSession,
} from "@/features/forge/types";

import type {
  ReflectionEntry,
} from "../reflection";

import {
  detectReflectionPatterns,
  detectSessionPatterns,
} from "./PatternDetector";

import {
  consolidatePatterns,
} from "./PatternRepository";

import {
  sortPatterns,
} from "./PatternScorer";

import type {
  PatternSummary,
} from "./pattern.types";

export function buildPatternSummary(
  reflections: ReflectionEntry[],
  sessions: PracticeSession[],
): PatternSummary {
  const detectedPatterns = [
    ...detectReflectionPatterns(
      reflections,
    ),

    ...detectSessionPatterns(
      sessions,
    ),
  ];

  const patterns =
    sortPatterns(
      consolidatePatterns(
        detectedPatterns,
      ),
    );

  return {
    patterns,

    strongestPattern:
      patterns[0] ??
      null,
  };
}