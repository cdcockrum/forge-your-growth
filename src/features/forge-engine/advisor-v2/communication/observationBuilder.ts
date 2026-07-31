import type {
  ForgeCommunicationInput,
} from "./communication.types";

import type {
  Observation,
} from "./observation.types";

type CommunicationEvidence =
  ForgeCommunicationInput["evidence"];

type EvidenceItem =
  CommunicationEvidence[number];

interface EvidenceAssessment {
  evidence: CommunicationEvidence;

  positiveWeight: number;

  negativeWeight: number;

  totalWeight: number;

  direction: EvidenceDirection;

  confidence: number;
}

type EvidenceDirection =
  | "strengthening"
  | "slowing"
  | "stable"
  | "mixed"
  | "unknown";

export function buildObservations(
  input: ForgeCommunicationInput,
): Observation[] {
  if (input.evidence.length === 0) {
    return [];
  }

  const identity =
    assessEvidence(
      getIdentityEvidence(
        input.evidence,
      ),
    );

  const momentum =
    assessEvidence(
      getMomentumEvidence(
        input.evidence,
      ),
    );

  const vision =
    assessEvidence(
      getVisionEvidence(
        input.evidence,
      ),
    );

  const observations: Observation[] =
    [];

  const slowdownObservation =
    buildSlowdownObservation(
      momentum,
      identity,
      vision,
    );

  if (slowdownObservation) {
    observations.push(
      slowdownObservation,
    );
  }

  const strengtheningObservation =
    buildStrengtheningObservation(
      momentum,
      identity,
    );

  if (
    strengtheningObservation
  ) {
    observations.push(
      strengtheningObservation,
    );
  }

  const alignmentObservation =
    buildAlignmentObservation(
      vision,
      identity,
    );

  if (alignmentObservation) {
    observations.push(
      alignmentObservation,
    );
  }

  const mixedObservation =
    buildMixedObservation(
      input.evidence,
      identity,
      momentum,
      vision,
    );

  if (mixedObservation) {
    observations.push(
      mixedObservation,
    );
  }

  return observations.sort(
    (left, right) =>
      right.importance -
      left.importance,
  );
}

function buildSlowdownObservation(
  momentum: EvidenceAssessment,
  identity: EvidenceAssessment,
  vision: EvidenceAssessment,
): Observation | null {
  if (
    momentum.direction !==
    "slowing"
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueEvidence([
      ...momentum.evidence,
      ...identity.evidence,
      ...vision.evidence,
    ]);

  const broaderDirectionStable =
    identity.direction ===
      "stable" ||
    identity.direction ===
      "strengthening" ||
    vision.direction ===
      "stable" ||
    vision.direction ===
      "strengthening";

  if (
    broaderDirectionStable
  ) {
    return {
      id:
        "momentum-slowing-direction-stable",

      pattern:
        "momentum_slowing",

      interpretation:
        "Recent consistency is less visible than it was previously, while the broader direction remains supported by the available evidence.",

      evidence:
        supportingEvidence,

      implications: [
        "The recent change may reflect an interruption in rhythm rather than a change in direction.",
        "A smaller repeatable action may be enough to make momentum visible again.",
      ],

      recommendations: [
        "Choose one manageable action that can be repeated consistently before increasing the level of effort.",
      ],

      confidence:
        averageConfidence([
          momentum,
          identity,
          vision,
        ]),

      importance:
        calculateImportance(
          supportingEvidence,
          0.9,
        ),
    };
  }

  return {
    id:
      "momentum-slowing",

    pattern:
      "momentum_slowing",

    interpretation:
      "Recent activity suggests that the current rhythm has become harder to maintain.",

    evidence:
      momentum.evidence,

    implications: [
      "The current plan may benefit from being made easier to repeat.",
      "More evidence is needed before drawing conclusions about the longer-term direction.",
    ],

    recommendations: [
      "Reduce the size or frequency of the next planned action and observe whether consistency becomes easier.",
    ],

    confidence:
      momentum.confidence,

    importance:
      calculateImportance(
        momentum.evidence,
        0.8,
      ),
  };
}

function buildStrengtheningObservation(
  momentum: EvidenceAssessment,
  identity: EvidenceAssessment,
): Observation | null {
  if (
    momentum.direction !==
      "strengthening" ||
    identity.direction ===
      "slowing"
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueEvidence([
      ...momentum.evidence,
      ...identity.evidence,
    ]);

  const identitySupported =
    identity.direction ===
      "strengthening" ||
    identity.direction ===
      "stable";

  return {
    id:
      identitySupported
        ? "momentum-and-identity-strengthening"
        : "momentum-strengthening",

    pattern:
      identity.direction ===
      "strengthening"
        ? "practice_compounding"
        : "momentum_strengthening",

    interpretation:
      identitySupported
        ? "Recent actions are becoming more consistent with the broader pattern of growth already taking shape."
        : "Recent activity suggests that momentum is becoming more consistent.",

    evidence:
      supportingEvidence,

    implications: [
      identitySupported
        ? "Repeated action is beginning to reinforce the direction the user has chosen."
        : "The current rhythm appears easier to sustain than the earlier pattern.",
      "Protecting the repeatable structure may be more useful than increasing intensity.",
    ],

    recommendations: [
      "Continue the current rhythm long enough to confirm that it remains sustainable.",
    ],

    confidence:
      averageConfidence([
        momentum,
        identity,
      ]),

    importance:
      calculateImportance(
        supportingEvidence,
        0.85,
      ),
  };
}

function buildAlignmentObservation(
  vision: EvidenceAssessment,
  identity: EvidenceAssessment,
): Observation | null {
  if (
    vision.direction !==
      "strengthening" &&
    vision.direction !==
      "stable"
  ) {
    return null;
  }

  if (
    identity.direction ===
    "slowing"
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueEvidence([
      ...vision.evidence,
      ...identity.evidence,
    ]);

  if (
    supportingEvidence.length ===
    0
  ) {
    return null;
  }

  return {
    id:
      "vision-alignment",

    pattern:
      "vision_alignment",

    interpretation:
      "The available evidence remains consistent with the longer-term direction the user has chosen.",

    evidence:
      supportingEvidence,

    implications: [
      "Recent actions continue to support the broader developmental direction.",
      "Maintaining alignment may be more important than accelerating progress.",
    ],

    recommendations: [
      "Continue choosing actions that clearly connect with the longer-term direction.",
    ],

    confidence:
      averageConfidence([
        vision,
        identity,
      ]),

    importance:
      calculateImportance(
        supportingEvidence,
        0.7,
      ),
  };
}

function buildMixedObservation(
  allEvidence: CommunicationEvidence,
  identity: EvidenceAssessment,
  momentum: EvidenceAssessment,
  vision: EvidenceAssessment,
): Observation | null {
  const assessments = [
    identity,
    momentum,
    vision,
  ].filter(
    (assessment) =>
      assessment.evidence.length >
      0,
  );

  const hasMixedDirection =
    assessments.some(
      (assessment) =>
        assessment.direction ===
        "mixed",
    );

  const hasConflictingDirections =
    assessments.some(
      (assessment) =>
        assessment.direction ===
        "strengthening",
    ) &&
    assessments.some(
      (assessment) =>
        assessment.direction ===
        "slowing",
    );

  if (
    !hasMixedDirection &&
    !hasConflictingDirections
  ) {
    return null;
  }

  return {
    id:
      "evidence-mixed",

    pattern:
      "evidence_mixed",

    interpretation:
      "The recent evidence points in more than one direction, so a single conclusion would be premature.",

    evidence:
      allEvidence,

    implications: [
      "Different parts of the user's growth may be changing at different rates.",
      "Additional activity or reflection may clarify whether a stronger pattern is emerging.",
    ],

    recommendations: [
      "Continue observing the current pattern before making a major adjustment.",
    ],

    confidence:
      averageConfidence(
        assessments,
      ),

    importance:
      calculateImportance(
        allEvidence,
        0.6,
      ),
  };
}

function assessEvidence(
  evidence: CommunicationEvidence,
): EvidenceAssessment {
  if (evidence.length === 0) {
    return {
      evidence,

      positiveWeight:
        0,

      negativeWeight:
        0,

      totalWeight:
        0,

      direction:
        "unknown",

      confidence:
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
    evidence,

    positiveWeight,

    negativeWeight,

    totalWeight,

    direction:
      determineDirection(
        positiveWeight,
        negativeWeight,
      ),

    confidence:
      average(
        evidence.map(
          (item) =>
            normalizeScore(
              item.confidence,
            ),
        ),
      ),
  };
}

function determineDirection(
  positiveWeight: number,
  negativeWeight: number,
): EvidenceDirection {
  const total =
    positiveWeight +
    negativeWeight;

  if (total === 0) {
    return "unknown";
  }

  const difference =
    positiveWeight -
    negativeWeight;

  const relativeDifference =
    difference / total;

  if (
    Math.abs(
      relativeDifference,
    ) < 0.15
  ) {
    return "mixed";
  }

  if (
    relativeDifference >=
    0.35
  ) {
    return "strengthening";
  }

  if (
    relativeDifference <=
    -0.35
  ) {
    return "slowing";
  }

  return "stable";
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
  item: EvidenceItem,
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

function calculateImportance(
  evidence: CommunicationEvidence,
  patternWeight: number,
): number {
  if (evidence.length === 0) {
    return 0;
  }

  const evidenceStrength =
    average(
      evidence.map(
        evidenceWeight,
      ),
    );

  return normalizeScore(
    evidenceStrength *
      patternWeight,
  );
}

function averageConfidence(
  assessments: EvidenceAssessment[],
): number {
  const available =
    assessments.filter(
      (assessment) =>
        assessment.evidence.length >
        0,
    );

  if (available.length === 0) {
    return 0;
  }

  return average(
    available.map(
      (assessment) =>
        assessment.confidence,
    ),
  );
}

function uniqueEvidence(
  evidence: CommunicationEvidence,
): CommunicationEvidence {
  return Array.from(
    new Map(
      evidence.map(
        (item, index) => [
          getEvidenceKey(
            item,
            index,
          ),
          item,
        ],
      ),
    ).values(),
  );
}

function getEvidenceKey(
  item: EvidenceItem,
  index: number,
): string {
  const candidate =
    item as EvidenceItem & {
      id?: string;
    };

  return (
    candidate.id ??
    [
      item.category,
      item.polarity,
      item.confidence,
      item.impact,
      index,
    ].join(":")
  );
}

function average(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (total, value) =>
        total + value,
      0,
    ) / values.length
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