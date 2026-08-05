import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  Scenario,
} from "./simulation.types";

export function generateScenarios(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): Scenario[] {
  const confidence =
    normalizeConfidence(
      judgment.confidence,
    );

  const strongestRecommendation =
    reasoning.recommendations[0] ??
    null;

  return [
    buildBestCase(
      confidence,
      strongestRecommendation
        ?.title,
    ),

    buildExpectedCase(
      judgment,
      confidence,
    ),

    buildWorstCase(
      confidence,
      reflection,
    ),
  ];
}

function buildBestCase(
  confidence: number,
  recommendationTitle:
    | string
    | undefined,
): Scenario {
  const action =
    recommendationTitle
      ? cleanAction(
          recommendationTitle,
        )
      : "repeat the practices that support this direction";

  return {
    id: "best-case",

    title:
      "Consistency begins to compound",

    description:
      "If you continue showing up in small, repeatable ways, this direction is more likely to become established and easier to sustain.",

    probability:
      confidence,

    projectedConfidence:
      confidence,

    trajectory:
      "accelerating",

    recommendations: [
      `Keep the next step simple: ${action}.`,
    ],
  };
}

function buildExpectedCase(
  judgment: ExecutiveJudgment,
  confidence: number,
): Scenario {
  return {
    id: "expected-case",

    title:
      expectedTitle(
        judgment.situation,
      ),

    description:
      expectedDescription(
        judgment.situation,
      ),

    probability:
      confidence,

    projectedConfidence:
      confidence,

    trajectory:
      determineExpectedTrajectory(
        judgment,
      ),

    recommendations: [
      expectedRecommendation(
        judgment.situation,
      ),
    ],
  };
}

function buildWorstCase(
  confidence: number,
  reflection: Reflection,
): Scenario {
  const uncertainty =
    cleanUncertainty(
      reflection.uncertainties[0] ??
        "",
    );

  return {
    id: "worst-case",

    title:
      "The pattern loses support",

    description:
      uncertainty ||
      "If practice remains inconsistent, this direction may continue to feel meaningful without becoming part of your lived routine.",

    probability:
      1 - confidence,

    projectedConfidence:
      1 - confidence,

    trajectory:
      "declining",

    recommendations: [
      "If consistency breaks, restart with one small practice instead of trying to recover everything at once.",
    ],
  };
}

function expectedTitle(
  situation:
    ExecutiveJudgment["situation"],
): string {
  switch (situation) {
    case "accelerating":
      return "Momentum continues at its current pace";

    case "recovering":
      return "Consistency continues to return";

    case "building":
      return "The foundation grows gradually";

    case "plateauing":
      return "Progress remains steady";

    case "uncertain":
    default:
      return "The direction remains open";
  }
}

function expectedDescription(
  situation:
    ExecutiveJudgment["situation"],
): string {
  switch (situation) {
    case "accelerating":
      return "If your current rhythm continues, progress should remain visible without requiring a dramatic increase in effort.";

    case "recovering":
      return "If you continue returning to the work, consistency should rebuild gradually even if progress still feels uneven.";

    case "building":
      return "If your current behavior continues, the foundation should become stronger, though meaningful change will remain gradual.";

    case "plateauing":
      return "If nothing changes, you are likely to maintain your current position without gaining or losing much momentum.";

    case "uncertain":
    default:
      return "If the current pattern continues, Forge will need more completed practices and reflections before the direction becomes clear.";
  }
}

function expectedRecommendation(
  situation:
    ExecutiveJudgment["situation"],
): string {
  switch (situation) {
    case "accelerating":
      return "Protect the rhythm that is already working before adding more difficulty.";

    case "recovering":
      return "Favor regular return over intensity while consistency rebuilds.";

    case "building":
      return "Keep the practice small enough to repeat and allow the foundation to develop.";

    case "plateauing":
      return "Make one modest adjustment and observe whether it creates renewed movement.";

    case "uncertain":
    default:
      return "Complete one meaningful practice and reflect on what helped or interfered.";
  }
}

function cleanAction(
  value: string,
): string {
  const cleaned =
    value
      .trim()
      .replace(
        /[.!?]+$/,
        "",
      )
      .replace(
        /^continue\s+/i,
        "",
      )
      .replace(
        /^maintain\s+/i,
        "maintain ",
      );

  if (!cleaned) {
    return "repeat one supportive practice";
  }

  return lowercaseFirst(
    cleaned,
  );
}

function cleanUncertainty(
  value: string,
): string {
  const lower =
    value
      .trim()
      .toLowerCase();

  if (!lower) {
    return "";
  }

  if (
    lower.includes(
      "opposing conclusions",
    )
  ) {
    return "If recent signals continue pointing in different directions, it may remain difficult to know which pattern deserves your trust.";
  }

  if (
    lower.includes(
      "insufficient",
    ) ||
    lower.includes(
      "not enough",
    )
  ) {
    return "If there is not enough consistent practice to evaluate, this direction may remain more aspirational than established.";
  }

  if (
    lower.includes(
      "identity",
    )
  ) {
    return "If recent behavior continues to diverge from the identity you value, that identity may begin to feel less supported.";
  }

  return "If the current pattern becomes less consistent, progress may weaken before Forge has enough evidence to understand why.";
}

function determineExpectedTrajectory(
  judgment: ExecutiveJudgment,
): Scenario["trajectory"] {
  switch (judgment.situation) {
    case "accelerating":
      return "accelerating";

    case "plateauing":
      return "plateau";

    case "recovering":
    case "building":
      return "steady";

    case "uncertain":
    default:
      return "uncertain";
  }
}

function lowercaseFirst(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  return (
    trimmed.charAt(0)
      .toLowerCase() +
    trimmed.slice(1)
  );
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}