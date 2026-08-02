export interface LearnedBelief {
  id: string;

  statement: string;

  confidence: number;

  supportingEvidence: number;

  contradictoryEvidence: number;
}

export function updateBeliefs(
  beliefs: LearnedBelief[],
): LearnedBelief[] {
  return beliefs.map(
    updateBelief,
  );
}

function updateBelief(
  belief: LearnedBelief,
): LearnedBelief {
  const support =
    belief.supportingEvidence;

  const contradiction =
    belief.contradictoryEvidence;

  const total =
    support +
    contradiction;

  if (total === 0) {
    return belief;
  }

  const evidenceRatio =
    support / total;

  const updatedConfidence =
    blendConfidence(
      belief.confidence,
      evidenceRatio,
    );

  return {
    ...belief,

    confidence:
      updatedConfidence,
  };
}

function blendConfidence(
  current: number,
  observed: number,
): number {
  const normalizedCurrent =
    normalize(
      current,
    );

  const normalizedObserved =
    normalize(
      observed,
    );

  const learningRate =
    0.15;

  return clamp01(
    normalizedCurrent +
      (
        normalizedObserved -
        normalizedCurrent
      ) * learningRate,
  );
}

function normalize(
  value: number,
): number {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return clamp01(
    normalized,
  );
}

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      value,
      1,
    ),
  );
}