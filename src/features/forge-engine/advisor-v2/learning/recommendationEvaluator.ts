import type {
  RecommendationEffectiveness,
  RecommendationHistory,
} from "./learning.types";

export function evaluateRecommendations(
  history: RecommendationHistory[],
): RecommendationEffectiveness[] {
  const grouped =
    groupByRecommendationId(
      history,
    );

  return Array.from(
    grouped.entries(),
  )
    .map(
      ([
        recommendationId,
        records,
      ]) =>
        evaluateRecommendation(
          recommendationId,
          records,
        ),
    )
    .sort(
      (left, right) =>
        right.effectivenessScore -
        left.effectivenessScore,
    );
}

function evaluateRecommendation(
  recommendationId: string,
  records: RecommendationHistory[],
): RecommendationEffectiveness {
  const followed =
    records.filter(
      (record) =>
        record.followed,
    );

  const successful =
    followed.filter(
      (record) =>
        record.outcome ===
        "successful",
    );

  const averageMomentumGain =
    average(
      followed.map(
        (record) =>
          record.momentumChange,
      ),
    );

  const averageProgressGain =
    average(
      followed.map(
        (record) =>
          record.progressChange,
      ),
    );

  const averageConfidenceGain =
    average(
      followed.map(
        (record) =>
          record.confidenceChange,
      ),
    );

  const averageIdentityGain =
    average(
      followed.map(
        (record) =>
          record.identityChange,
      ),
    );

  const successRate =
    followed.length === 0
      ? 0
      : successful.length /
        followed.length;

  const averageGain =
    (
      averageMomentumGain +
      averageProgressGain +
      averageConfidenceGain +
      averageIdentityGain
    ) / 4;

  const followThroughRate =
    records.length === 0
      ? 0
      : followed.length /
        records.length;

  const effectivenessScore =
    clamp01(
      successRate * 0.5 +
      normalizeGain(
        averageGain,
      ) * 0.3 +
      followThroughRate * 0.2,
    );

  return {
    recommendationId,

    totalRecommendations:
      records.length,

    followedCount:
      followed.length,

    successRate,

    averageMomentumGain,

    averageProgressGain,

    averageConfidenceGain,

    averageIdentityGain,

    effectivenessScore,
  };
}

function groupByRecommendationId(
  history: RecommendationHistory[],
): Map<
  string,
  RecommendationHistory[]
> {
  const grouped =
    new Map<
      string,
      RecommendationHistory[]
    >();

  for (const record of history) {
    const records =
      grouped.get(
        record.recommendationId,
      ) ?? [];

    records.push(
      record,
    );

    grouped.set(
      record.recommendationId,
      records,
    );
  }

  return grouped;
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

function normalizeGain(
  gain: number,
): number {
  return clamp01(
    (gain + 1) / 2,
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