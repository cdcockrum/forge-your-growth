import type {
  CommunicationEvidence,
  DetectedPattern,
  PatternDefinition,
} from "./pattern.types";

type EvidenceItem =
  CommunicationEvidence[number];

type EvidenceDirection =
  | "strengthening"
  | "slowing"
  | "stable"
  | "mixed"
  | "unknown";

interface EvidenceAssessment {
  evidence: CommunicationEvidence;

  direction: EvidenceDirection;

  confidence: number;

  strength: number;
}

export const patternLibrary:
  readonly PatternDefinition[] = [
    {
      id:
        "momentum_slowing",

      description:
        "Recent momentum evidence has become less positive or more interrupted.",

      detect:
        detectMomentumSlowing,
    },

    {
      id:
        "momentum_strengthening",

      description:
        "Recent momentum evidence suggests increasing consistency or progress.",

      detect:
        detectMomentumStrengthening,
    },

    {
      id:
        "direction_stable",

      description:
        "Identity or vision evidence remains stable despite short-term variation.",

      detect:
        detectDirectionStable,
    },

    {
      id:
        "vision_alignment",

      description:
        "Recent behavior remains consistent with the user's longer-term direction.",

      detect:
        detectVisionAlignment,
    },

    {
      id:
        "practice_compounding",

      description:
        "Momentum and identity evidence are strengthening together.",

      detect:
        detectPracticeCompounding,
    },

    {
      id:
        "recovery_beginning",

      description:
        "Momentum is improving after evidence of interruption or decline.",

      detect:
        detectRecoveryBeginning,
    },

    {
      id:
        "evidence_mixed",

      description:
        "Current evidence supports more than one meaningful interpretation.",

      detect:
        detectMixedEvidence,
    },
  ];

function detectMomentumSlowing(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const assessment =
    assessEvidence(
      getMomentumEvidence(
        evidence,
      ),
    );

  if (
    assessment.direction !==
    "slowing"
  ) {
    return null;
  }

  return {
    id:
      "momentum_slowing",

    direction:
      "caution",

    evidence:
      assessment.evidence,

    confidence:
      assessment.confidence,

    importance:
      normalizeScore(
        assessment.strength *
          0.9,
      ),

    context: {
      momentumSlowing:
        true,
    },
  };
}

function detectMomentumStrengthening(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const assessment =
    assessEvidence(
      getMomentumEvidence(
        evidence,
      ),
    );

  if (
    assessment.direction !==
    "strengthening"
  ) {
    return null;
  }

  return {
    id:
      "momentum_strengthening",

    direction:
      "positive",

    evidence:
      assessment.evidence,

    confidence:
      assessment.confidence,

    importance:
      normalizeScore(
        assessment.strength *
          0.85,
      ),

    context: {
      momentumStrengthening:
        true,
    },
  };
}

function detectDirectionStable(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const identity =
    assessEvidence(
      getIdentityEvidence(
        evidence,
      ),
    );

  const vision =
    assessEvidence(
      getVisionEvidence(
        evidence,
      ),
    );

  const stable =
    [
      identity.direction,
      vision.direction,
    ].some(
      (direction) =>
        direction ===
          "stable" ||
        direction ===
          "strengthening",
    );

  if (!stable) {
    return null;
  }

  const supportingEvidence =
    uniqueEvidence([
      ...identity.evidence,
      ...vision.evidence,
    ]);

  return {
    id:
      "direction_stable",

    direction:
      "positive",

    evidence:
      supportingEvidence,

    confidence:
      average([
        identity.confidence,
        vision.confidence,
      ]),

    importance:
      calculateImportance(
        supportingEvidence,
        0.75,
      ),

    context: {
      broaderDirectionStable:
        true,
    },
  };
}

function detectVisionAlignment(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const vision =
    assessEvidence(
      getVisionEvidence(
        evidence,
      ),
    );

  if (
    vision.direction !==
      "stable" &&
    vision.direction !==
      "strengthening"
  ) {
    return null;
  }

  return {
    id:
      "vision_alignment",

    direction:
      "positive",

    evidence:
      vision.evidence,

    confidence:
      vision.confidence,

    importance:
      calculateImportance(
        vision.evidence,
        0.7,
      ),

    context: {
      visionAligned:
        true,
    },
  };
}

function detectPracticeCompounding(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const momentum =
    assessEvidence(
      getMomentumEvidence(
        evidence,
      ),
    );

  const identity =
    assessEvidence(
      getIdentityEvidence(
        evidence,
      ),
    );

  if (
    momentum.direction !==
      "strengthening" ||
    identity.direction !==
      "strengthening"
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueEvidence([
      ...momentum.evidence,
      ...identity.evidence,
    ]);

  return {
    id:
      "practice_compounding",

    direction:
      "positive",

    evidence:
      supportingEvidence,

    confidence:
      average([
        momentum.confidence,
        identity.confidence,
      ]),

    importance:
      calculateImportance(
        supportingEvidence,
        0.95,
      ),

    context: {
      momentumStrengthening:
        true,

      identityStrengthening:
        true,
    },
  };
}

function detectRecoveryBeginning(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const momentumEvidence =
    getMomentumEvidence(
      evidence,
    );

  const positive =
    momentumEvidence.filter(
      (item) =>
        item.polarity ===
        "positive",
    );

  const negative =
    momentumEvidence.filter(
      (item) =>
        item.polarity ===
        "negative",
    );

  if (
    positive.length === 0 ||
    negative.length === 0
  ) {
    return null;
  }

  const positiveStrength =
    positive.reduce(
      (total, item) =>
        total +
        evidenceWeight(
          item,
        ),
      0,
    );

  const negativeStrength =
    negative.reduce(
      (total, item) =>
        total +
        evidenceWeight(
          item,
        ),
      0,
    );

  if (
    positiveStrength <
    negativeStrength * 0.75
  ) {
    return null;
  }

  const supportingEvidence =
    uniqueEvidence([
      ...positive,
      ...negative,
    ]);

  return {
    id:
      "recovery_beginning",

    direction:
      "positive",

    evidence:
      supportingEvidence,

    confidence:
      average(
        supportingEvidence.map(
          (item) =>
            normalizeScore(
              item.confidence,
            ),
        ),
      ),

    importance:
      calculateImportance(
        supportingEvidence,
        0.8,
      ),

    context: {
      positiveEvidencePresent:
        true,

      earlierFrictionPresent:
        true,
    },
  };
}

function detectMixedEvidence(
  evidence: CommunicationEvidence,
): DetectedPattern | null {
  const assessments = [
    assessEvidence(
      getIdentityEvidence(
        evidence,
      ),
    ),

    assessEvidence(
      getMomentumEvidence(
        evidence,
      ),
    ),

    assessEvidence(
      getVisionEvidence(
        evidence,
      ),
    ),
  ].filter(
    (assessment) =>
      assessment.evidence.length >
      0,
  );

  const mixed =
    assessments.some(
      (assessment) =>
        assessment.direction ===
        "mixed",
    );

  const conflicting =
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
    !mixed &&
    !conflicting
  ) {
    return null;
  }

  return {
    id:
      "evidence_mixed",

    direction:
      "mixed",

    evidence,

    confidence:
      average(
        assessments.map(
          (assessment) =>
            assessment.confidence,
        ),
      ),

    importance:
      calculateImportance(
        evidence,
        0.6,
      ),

    context: {
      evidenceConflicting:
        conflicting,

      evidenceMixed:
        mixed,
    },
  };
}

function assessEvidence(
  evidence: CommunicationEvidence,
): EvidenceAssessment {
  if (evidence.length === 0) {
    return {
      evidence,

      direction:
        "unknown",

      confidence:
        0,

      strength:
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

  const total =
    positiveWeight +
    negativeWeight;

  return {
    evidence,

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

    strength:
      total /
      Math.max(
        evidence.length,
        1,
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

  const relativeDifference =
    (
      positiveWeight -
      negativeWeight
    ) / total;

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
  multiplier: number,
): number {
  if (evidence.length === 0) {
    return 0;
  }

  return normalizeScore(
    average(
      evidence.map(
        evidenceWeight,
      ),
    ) * multiplier,
  );
}

function uniqueEvidence(
  evidence: CommunicationEvidence,
): CommunicationEvidence {
  return Array.from(
    new Set(
      evidence,
    ),
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