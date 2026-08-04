import type {
  AdvisorLearningDirection,
  AdvisorLearningSignal,
  AdvisorOutcomeStatus,
  AdvisorRecommendationOutcome,
  AdvisorRecommendationResponse,
} from "./adaptiveLearning.types";

export type OutcomeAnalyzerOptions = {
  recommendationId: string;

  recommendationTitle: string;

  recommendationConfidence: number;

  recommendationAccepted: boolean;

  completedPracticeCount: number;

  plannedPracticeCount: number;

  momentumBefore: number;

  momentumAfter: number;

  progressBefore: number;

  progressAfter: number;

  reflectionQuality: number;

  achievementUnlocked: boolean;

  recommendedAt: string;

  evaluatedAt: string;
};

export function analyzeOutcome(
  options: OutcomeAnalyzerOptions,
): AdvisorRecommendationOutcome {
  const completionScore =
    calculateCompletionScore(
      options.completedPracticeCount,
      options.plannedPracticeCount,
    );

  const momentumScore =
    calculateChangeScore(
      options.momentumBefore,
      options.momentumAfter,
    );

  const progressScore =
    calculateChangeScore(
      options.progressBefore,
      options.progressAfter,
    );

  const reflectionScore =
    normalizeScore(
      options.reflectionQuality,
    );

  const achievementScore =
    options.achievementUnlocked
      ? 1
      : 0;

  const outcomeScore =
    clampScore(
      completionScore * 0.4 +
        momentumScore * 0.25 +
        progressScore * 0.2 +
        reflectionScore * 0.1 +
        achievementScore * 0.05,
    );

  const response =
    determineRecommendationResponse(
      options.recommendationAccepted,
      completionScore,
    );

  const status =
    determineOutcomeStatus(
      outcomeScore,
      response,
    );

  const signals =
    buildLearningSignals({
      ...options,
      completionScore,
      momentumScore,
      progressScore,
      reflectionScore,
      achievementScore,
    });

  return {
    id:
      createOutcomeId(
        options.recommendationId,
        options.evaluatedAt,
      ),

    recommendationId:
      options.recommendationId,

    recommendationTitle:
      options.recommendationTitle,

    recommendationConfidence:
      normalizeScore(
        options.recommendationConfidence,
      ),

    response,

    status,

    signals,

    outcomeScore,

    explanation:
      buildOutcomeExplanation({
        status,
        response,
        outcomeScore,
        completionScore,
        momentumScore,
        progressScore,
        reflectionScore,
        achievementScore,
      }),

    recommendedAt:
      options.recommendedAt,

    evaluatedAt:
      options.evaluatedAt,
  };
}

type SignalBuilderOptions =
  OutcomeAnalyzerOptions & {
    completionScore: number;

    momentumScore: number;

    progressScore: number;

    reflectionScore: number;

    achievementScore: number;
  };

function buildLearningSignals(
  options: SignalBuilderOptions,
): AdvisorLearningSignal[] {
  const signals:
    AdvisorLearningSignal[] = [];

  signals.push({
    id:
      `${options.recommendationId}:completion`,

    type:
      "completion",

    direction:
      scoreDirection(
        options.completionScore,
      ),

    strength:
      options.completionScore,

    confidence:
      completionConfidence(
        options.plannedPracticeCount,
      ),

    description:
      completionDescription(
        options.completedPracticeCount,
        options.plannedPracticeCount,
      ),

    observedAt:
      options.evaluatedAt,

    sourceId:
      null,
  });

  signals.push({
    id:
      `${options.recommendationId}:momentum`,

    type:
      "momentum",

    direction:
      changeDirection(
        options.momentumBefore,
        options.momentumAfter,
      ),

    strength:
      changeStrength(
        options.momentumBefore,
        options.momentumAfter,
      ),

    confidence:
      0.8,

    description:
      changeDescription(
        "Momentum",
        options.momentumBefore,
        options.momentumAfter,
      ),

    observedAt:
      options.evaluatedAt,

    sourceId:
      null,
  });

  signals.push({
    id:
      `${options.recommendationId}:progress`,

    type:
      "progress",

    direction:
      changeDirection(
        options.progressBefore,
        options.progressAfter,
      ),

    strength:
      changeStrength(
        options.progressBefore,
        options.progressAfter,
      ),

    confidence:
      0.8,

    description:
      changeDescription(
        "Progress",
        options.progressBefore,
        options.progressAfter,
      ),

    observedAt:
      options.evaluatedAt,

    sourceId:
      null,
  });

  signals.push({
    id:
      `${options.recommendationId}:reflection`,

    type:
      "reflection",

    direction:
      scoreDirection(
        options.reflectionScore,
      ),

    strength:
      options.reflectionScore,

    confidence:
      options.reflectionScore > 0
        ? 0.75
        : 0.4,

    description:
      reflectionDescription(
        options.reflectionScore,
      ),

    observedAt:
      options.evaluatedAt,

    sourceId:
      null,
  });

  if (
    options.achievementUnlocked
  ) {
    signals.push({
      id:
        `${options.recommendationId}:achievement`,

      type:
        "progress",

      direction:
        "positive",

      strength:
        options.achievementScore,

      confidence:
        0.9,

      description:
        "A related achievement was unlocked during the evaluation period.",

      observedAt:
        options.evaluatedAt,

      sourceId:
        null,
    });
  }

  signals.push({
    id:
      `${options.recommendationId}:response`,

    type:
      "user-response",

    direction:
      options.recommendationAccepted
        ? "positive"
        : "negative",

    strength:
      options.recommendationAccepted
        ? 1
        : 0,

    confidence:
      1,

    description:
      options.recommendationAccepted
        ? "The recommendation was accepted."
        : "The recommendation was not accepted.",

    observedAt:
      options.evaluatedAt,

    sourceId:
      options.recommendationId,
  });

  return signals;
}

function calculateCompletionScore(
  completedPracticeCount: number,
  plannedPracticeCount: number,
): number {
  if (
    plannedPracticeCount <= 0
  ) {
    return completedPracticeCount > 0
      ? 1
      : 0;
  }

  return clampScore(
    completedPracticeCount /
      plannedPracticeCount,
  );
}

function calculateChangeScore(
  before: number,
  after: number,
): number {
  const normalizedBefore =
    normalizeScore(
      before,
    );

  const normalizedAfter =
    normalizeScore(
      after,
    );

  const change =
    normalizedAfter -
    normalizedBefore;

  return clampScore(
    0.5 +
      change,
  );
}

function determineRecommendationResponse(
  recommendationAccepted: boolean,
  completionScore: number,
): AdvisorRecommendationResponse {
  if (
    !recommendationAccepted &&
    completionScore === 0
  ) {
    return "ignored";
  }

  if (
    !recommendationAccepted &&
    completionScore > 0
  ) {
    return "partially-followed";
  }

  if (
    completionScore >= 0.8
  ) {
    return "accepted";
  }

  if (
    completionScore > 0
  ) {
    return "partially-followed";
  }

  return "rejected";
}

function determineOutcomeStatus(
  outcomeScore: number,
  response: AdvisorRecommendationResponse,
): AdvisorOutcomeStatus {
  if (
    response === "ignored" ||
    response === "rejected"
  ) {
    return outcomeScore >= 0.6
      ? "inconclusive"
      : "unsuccessful";
  }

  if (
    outcomeScore >= 0.75
  ) {
    return "successful";
  }

  if (
    outcomeScore >= 0.45
  ) {
    return "partially-successful";
  }

  if (
    outcomeScore >= 0.3
  ) {
    return "inconclusive";
  }

  return "unsuccessful";
}

function buildOutcomeExplanation({
  status,
  response,
  outcomeScore,
  completionScore,
  momentumScore,
  progressScore,
  reflectionScore,
  achievementScore,
}: {
  status:
    AdvisorOutcomeStatus;

  response:
    AdvisorRecommendationResponse;

  outcomeScore:
    number;

  completionScore:
    number;

  momentumScore:
    number;

  progressScore:
    number;

  reflectionScore:
    number;

  achievementScore:
    number;
}): string {
  const strongestSignal =
    strongestOutcomeSignal({
      completionScore,
      momentumScore,
      progressScore,
      reflectionScore,
      achievementScore,
    });

  return [
    `The recommendation outcome was ${formatLabel(status)}.`,

    `The user response was ${formatLabel(response)}.`,

    `The outcome score was ${formatPercentage(outcomeScore)}.`,

    `${strongestSignal} contributed most strongly to the evaluation.`,
  ].join(" ");
}

function strongestOutcomeSignal({
  completionScore,
  momentumScore,
  progressScore,
  reflectionScore,
  achievementScore,
}: {
  completionScore: number;

  momentumScore: number;

  progressScore: number;

  reflectionScore: number;

  achievementScore: number;
}): string {
  const candidates = [
    {
      label:
        "Practice completion",

      value:
        completionScore * 0.4,
    },

    {
      label:
        "Momentum change",

      value:
        momentumScore * 0.25,
    },

    {
      label:
        "Progress change",

      value:
        progressScore * 0.2,
    },

    {
      label:
        "Reflection quality",

      value:
        reflectionScore * 0.1,
    },

    {
      label:
        "Achievement evidence",

      value:
        achievementScore * 0.05,
    },
  ];

  return candidates.reduce(
    (strongest, candidate) =>
      candidate.value >
      strongest.value
        ? candidate
        : strongest,
  ).label;
}

function completionDescription(
  completed: number,
  planned: number,
): string {
  if (
    planned <= 0
  ) {
    return completed > 0
      ? `${completed} unplanned practice sessions were completed.`
      : "No practice sessions were planned or completed.";
  }

  return `${completed} of ${planned} planned practice sessions were completed.`;
}

function reflectionDescription(
  score: number,
): string {
  if (score >= 0.75) {
    return "Reflection evidence was strong and detailed.";
  }

  if (score >= 0.4) {
    return "Reflection evidence was present but limited.";
  }

  return "Reflection evidence was weak or unavailable.";
}

function changeDescription(
  label: string,
  before: number,
  after: number,
): string {
  const difference =
    normalizeScore(after) -
    normalizeScore(before);

  if (
    Math.abs(difference) <
    0.01
  ) {
    return `${label} remained stable.`;
  }

  const direction =
    difference > 0
      ? "increased"
      : "decreased";

  return `${label} ${direction} from ${formatPercentage(
    normalizeScore(before),
  )} to ${formatPercentage(
    normalizeScore(after),
  )}.`;
}

function changeDirection(
  before: number,
  after: number,
): AdvisorLearningDirection {
  const difference =
    normalizeScore(after) -
    normalizeScore(before);

  if (
    difference > 0.01
  ) {
    return "positive";
  }

  if (
    difference < -0.01
  ) {
    return "negative";
  }

  return "neutral";
}

function scoreDirection(
  score: number,
): AdvisorLearningDirection {
  if (score >= 0.65) {
    return "positive";
  }

  if (score < 0.35) {
    return "negative";
  }

  return "neutral";
}

function changeStrength(
  before: number,
  after: number,
): number {
  return clampScore(
    Math.abs(
      normalizeScore(after) -
        normalizeScore(before),
    ),
  );
}

function completionConfidence(
  plannedPracticeCount: number,
): number {
  if (
    plannedPracticeCount <= 0
  ) {
    return 0.5;
  }

  return clampScore(
    0.6 +
      Math.min(
        plannedPracticeCount,
        5,
      ) * 0.08,
  );
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return clampScore(
    normalized,
  );
}

function clampScore(
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

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    clampScore(value) * 100,
  )}%`;
}

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll(
      "-",
      " ",
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function createOutcomeId(
  recommendationId: string,
  evaluatedAt: string,
): string {
  return [
    "advisor-outcome",
    recommendationId,
    evaluatedAt,
  ].join(":");
}