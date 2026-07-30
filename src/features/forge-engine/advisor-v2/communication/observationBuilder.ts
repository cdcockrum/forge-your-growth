import {
  detectPatterns,
} from "./patternEngine";

import type {
  ForgeCommunicationInput,
} from "./communication.types";

import type {
  Observation,
  ObservationPattern,
} from "./observation.types";

import type {
  DetectedPattern,
  PatternId,
} from "./pattern.types";

export function buildObservations(
  input: ForgeCommunicationInput,
): Observation[] {
  const patterns =
    detectPatterns(
      input.evidence,
    );

  if (patterns.length === 0) {
    return [];
  }

  const observations =
    buildCompositeObservations(
      patterns,
    );

  return observations.sort(
    (left, right) =>
      right.importance -
      left.importance,
  );
}

function buildCompositeObservations(
  patterns: DetectedPattern[],
): Observation[] {
  const observations: Observation[] =
    [];

  const slowdown =
    findPattern(
      patterns,
      "momentum_slowing",
    );

  const strengthening =
    findPattern(
      patterns,
      "momentum_strengthening",
    );

  const directionStable =
    findPattern(
      patterns,
      "direction_stable",
    );

  const visionAlignment =
    findPattern(
      patterns,
      "vision_alignment",
    );

  const compounding =
    findPattern(
      patterns,
      "practice_compounding",
    );

  const recovery =
    findPattern(
      patterns,
      "recovery_beginning",
    );

  const mixed =
    findPattern(
      patterns,
      "evidence_mixed",
    );

  if (
    slowdown &&
    directionStable
  ) {
    observations.push(
      createObservation({
        id:
          "momentum-slowing-direction-stable",

        pattern:
          "momentum_slowing",

        interpretation:
          "Recent consistency is less visible than it was previously, while the broader direction remains supported by the available evidence.",

        implications: [
          "The current change may reflect an interruption in rhythm rather than a change in direction.",
          "A smaller repeatable action may be enough to make momentum visible again.",
        ],

        recommendations: [
          "Choose one manageable action that can be repeated consistently before increasing the level of effort.",
        ],

        sourcePatterns: [
          slowdown,
          directionStable,
        ],

        importanceModifier:
          0.95,
      }),
    );
  } else if (slowdown) {
    observations.push(
      createObservation({
        id:
          "momentum-slowing",

        pattern:
          "momentum_slowing",

        interpretation:
          "Recent activity suggests that the current rhythm has become harder to maintain.",

        implications: [
          "The current plan may benefit from being made easier to repeat.",
          "More evidence is needed before drawing conclusions about the longer-term direction.",
        ],

        recommendations: [
          "Reduce the size or frequency of the next planned action and observe whether consistency becomes easier.",
        ],

        sourcePatterns: [
          slowdown,
        ],

        importanceModifier:
          0.85,
      }),
    );
  }

  if (compounding) {
    observations.push(
      createObservation({
        id:
          "practice-compounding",

        pattern:
          "practice_compounding",

        interpretation:
          "Recent actions are becoming more consistent with the broader pattern of growth already taking shape.",

        implications: [
          "Repeated action is beginning to reinforce the direction the user has chosen.",
          "Protecting the repeatable structure may be more useful than increasing intensity.",
        ],

        recommendations: [
          "Continue the current rhythm long enough to confirm that it remains sustainable.",
        ],

        sourcePatterns: [
          compounding,
        ],

        importanceModifier:
          1,
      }),
    );
  } else if (strengthening) {
    observations.push(
      createObservation({
        id:
          "momentum-strengthening",

        pattern:
          "momentum_strengthening",

        interpretation:
          "Recent activity suggests that momentum is becoming more consistent.",

        implications: [
          "The current rhythm appears easier to sustain than the earlier pattern.",
          "Maintaining the repeatable structure may be more useful than increasing intensity.",
        ],

        recommendations: [
          "Continue the current rhythm and observe whether it remains sustainable.",
        ],

        sourcePatterns: [
          strengthening,
        ],

        importanceModifier:
          0.9,
      }),
    );
  }

  if (recovery) {
    observations.push(
      createObservation({
        id:
          "recovery-beginning",

        pattern:
          "recovery_beginning",

        interpretation:
          "Recent evidence suggests that consistency may be beginning to return after a period of interruption.",

        implications: [
          "The earlier interruption may not represent a lasting change in direction.",
          "Protecting the first signs of renewed consistency may be more useful than accelerating immediately.",
        ],

        recommendations: [
          "Repeat the action that has recently become manageable before expanding the plan.",
        ],

        sourcePatterns: [
          recovery,
        ],

        importanceModifier:
          0.9,
      }),
    );
  }

  if (
    visionAlignment &&
    !containsObservation(
      observations,
      "practice_compounding",
    )
  ) {
    observations.push(
      createObservation({
        id:
          "vision-alignment",

        pattern:
          "vision_alignment",

        interpretation:
          "The available evidence remains consistent with the longer-term direction the user has chosen.",

        implications: [
          "Recent actions continue to support the broader developmental direction.",
          "Maintaining alignment may be more important than accelerating progress.",
        ],

        recommendations: [
          "Continue choosing actions that clearly connect with the longer-term direction.",
        ],

        sourcePatterns: [
          visionAlignment,
        ],

        importanceModifier:
          0.75,
      }),
    );
  }

  if (mixed) {
    observations.push(
      createObservation({
        id:
          "evidence-mixed",

        pattern:
          "evidence_mixed",

        interpretation:
          "The recent evidence points in more than one direction, so a single conclusion would be premature.",

        implications: [
          "Different parts of the user's growth may be changing at different rates.",
          "Additional activity or reflection may clarify whether a stronger pattern is emerging.",
        ],

        recommendations: [
          "Continue observing the current pattern before making a major adjustment.",
        ],

        sourcePatterns: [
          mixed,
        ],

        importanceModifier:
          0.7,
      }),
    );
  }

  if (
    observations.length === 0
  ) {
    observations.push(
      createFallbackObservation(
        patterns,
      ),
    );
  }

  return removeDuplicateObservations(
    observations,
  );
}

interface ObservationInput {
  id: string;

  pattern: ObservationPattern;

  interpretation: string;

  implications: string[];

  recommendations: string[];

  sourcePatterns: DetectedPattern[];

  importanceModifier: number;
}

function createObservation(
  input: ObservationInput,
): Observation {
  return {
    id:
      input.id,

    pattern:
      input.pattern,

    interpretation:
      input.interpretation,

    evidence:
      uniqueEvidence(
        input.sourcePatterns.flatMap(
          (pattern) =>
            pattern.evidence,
        ),
      ),

    implications:
      input.implications,

    recommendations:
      input.recommendations,

    confidence:
      weightedAverage(
        input.sourcePatterns.map(
          (pattern) => ({
            value:
              pattern.confidence,

            weight:
              Math.max(
                pattern.importance,
                0.01,
              ),
          }),
        ),
      ),

    importance:
      normalizeScore(
        weightedAverage(
          input.sourcePatterns.map(
            (pattern) => ({
              value:
                pattern.importance,

              weight:
                Math.max(
                  pattern.confidence,
                  0.01,
                ),
            }),
          ),
        ) *
          input.importanceModifier,
      ),
  };
}

function createFallbackObservation(
  patterns: DetectedPattern[],
): Observation {
  const primary =
    patterns[0];

  return {
    id:
      `pattern-${primary.id}`,

    pattern:
      mapPatternId(
        primary.id,
      ),

    interpretation:
      interpretationForPattern(
        primary.id,
      ),

    evidence:
      primary.evidence,

    implications: [
      "The available evidence supports a developing pattern, although more context may refine the interpretation.",
    ],

    recommendations: [
      "Continue observing the pattern before making a large adjustment.",
    ],

    confidence:
      primary.confidence,

    importance:
      primary.importance,
  };
}

function interpretationForPattern(
  id: PatternId,
): string {
  switch (id) {
    case "momentum_slowing":
      return "Recent activity suggests that the current rhythm has become less consistent.";

    case "momentum_strengthening":
      return "Recent activity suggests that momentum is becoming more consistent.";

    case "direction_stable":
      return "The broader direction remains supported by the available evidence.";

    case "vision_alignment":
      return "Recent activity remains consistent with the longer-term direction the user has chosen.";

    case "practice_compounding":
      return "Repeated action appears to be reinforcing the broader pattern of growth.";

    case "recovery_beginning":
      return "Recent evidence suggests that consistency may be beginning to return.";

    case "evidence_mixed":
      return "The available evidence currently supports more than one interpretation.";

    case "insufficient_evidence":
      return "There is not yet enough evidence to support a reliable interpretation.";
  }
}

function mapPatternId(
  id: PatternId,
): ObservationPattern {
  switch (id) {
    case "momentum_slowing":
      return "momentum_slowing";

    case "momentum_strengthening":
      return "momentum_strengthening";

    case "direction_stable":
      return "identity_stable";

    case "vision_alignment":
      return "vision_alignment";

    case "practice_compounding":
      return "practice_compounding";

    case "recovery_beginning":
      return "recovery_beginning";

    case "evidence_mixed":
      return "evidence_mixed";

    case "insufficient_evidence":
      return "insufficient_evidence";
  }
}

function findPattern(
  patterns: DetectedPattern[],
  id: PatternId,
): DetectedPattern | undefined {
  return patterns.find(
    (pattern) =>
      pattern.id === id,
  );
}

function containsObservation(
  observations: Observation[],
  pattern: ObservationPattern,
): boolean {
  return observations.some(
    (observation) =>
      observation.pattern ===
      pattern,
  );
}

function removeDuplicateObservations(
  observations: Observation[],
): Observation[] {
  return Array.from(
    new Map(
      observations.map(
        (observation) => [
          observation.id,
          observation,
        ],
      ),
    ).values(),
  );
}

function uniqueEvidence(
  evidence: Observation["evidence"],
): Observation["evidence"] {
  return Array.from(
    new Set(
      evidence,
    ),
  );
}

interface WeightedValue {
  value: number;

  weight: number;
}

function weightedAverage(
  values: WeightedValue[],
): number {
  if (values.length === 0) {
    return 0;
  }

  const totalWeight =
    values.reduce(
      (total, item) =>
        total + item.weight,
      0,
    );

  if (totalWeight === 0) {
    return 0;
  }

  return (
    values.reduce(
      (total, item) =>
        total +
        item.value *
          item.weight,
      0,
    ) / totalWeight
  );
}

function normalizeScore(
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