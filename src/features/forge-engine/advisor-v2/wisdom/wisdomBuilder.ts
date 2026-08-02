import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  LearningResult,
} from "../learning";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  Simulation,
} from "../simulation";

import type {
  Wisdom,
  WisdomInsight,
} from "./wisdom.types";

export function buildWisdom(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
  simulation: Simulation,
  learning: LearningResult | null = null,
): Wisdom {
  const insights =
    buildInsights(
      reasoning,
      judgment,
    );

  return {
    narrative:
      buildWisdomNarrative(
        judgment,
        reflection,
        simulation,
      ),

    insights,

    longTermThemes:
      buildLongTermThemes(
        reasoning,
        judgment,
      ),

    emergingIdentity:
      buildEmergingIdentity(
        reasoning,
      ),

    cautions:
      buildCautions(
        reflection,
        simulation,
      ),

    opportunities:
      buildOpportunities(
        judgment,
        simulation,
        learning,
      ),

    confidence:
      normalizeConfidence(
        judgment.confidence,
      ),
  };
}

function buildInsights(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): WisdomInsight[] {
  const strongest =
    reasoning.interpretation.strongest;

  if (!strongest) {
    return [];
  }

  return [
    {
      id:
        `wisdom-${strongest.id}`,

      title:
        strongest.title,

      explanation:
        strongest.description,

      confidence:
        normalizeConfidence(
          strongest.confidence,
        ),

      evidenceIds: [
        ...strongest.supportingEvidence,
      ],
    },
    {
      id:
        "wisdom-executive-judgment",

      title:
        judgment.headline,

      explanation:
        judgment.summary,

      confidence:
        normalizeConfidence(
          judgment.confidence,
        ),

      evidenceIds: [
        ...reasoning.interpretation
          .supportingEvidence,
      ],
    },
  ];
}

function buildWisdomNarrative(
  judgment: ExecutiveJudgment,
  reflection: Reflection,
  simulation: Simulation,
): string {
  const expected =
    simulation.expectedCase;

  const uncertainty =
    reflection.uncertainties[0];

  const parts = [
    judgment.summary,
    expected.description,
    uncertainty
      ? `The main uncertainty is that ${lowercaseFirst(
          uncertainty,
        )}`
      : "",
  ];

  return uniqueStrings(
    parts,
  ).join(" ");
}

function buildLongTermThemes(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): string[] {
  const themes = [
    judgment.situation === "accelerating"
      ? "Current growth appears to be gaining strength."
      : "",

    judgment.situation === "recovering"
      ? "The present direction reflects recovery after interruption."
      : "",

    judgment.situation === "plateauing"
      ? "Progress may be stabilizing without clear acceleration."
      : "",

    ...reasoning.analysis.agreements.map(
      (agreement) =>
        agreement.explanation,
    ),
  ];

  return uniqueStrings(
    themes,
  ).slice(0, 5);
}

function buildEmergingIdentity(
  reasoning: ReasoningResult,
): string[] {
  const identityEvidence =
    reasoning.graph.nodes
      .map(
        (node) =>
          node.evidence,
      )
      .filter(
        (evidence) =>
          evidence.category ===
          "identity",
      )
      .sort(
        (left, right) =>
          evidenceScore(right) -
          evidenceScore(left),
      )
      .slice(0, 4)
      .map(
        (evidence) =>
          evidence.statement,
      );

  return uniqueStrings(
    identityEvidence,
  );
}

function buildCautions(
  reflection: Reflection,
  simulation: Simulation,
): string[] {
  return uniqueStrings([
    ...reflection.uncertainties,

    ...reflection.additionalEvidenceNeeded,

    simulation.worstCase.description,
  ]).slice(0, 5);
}

function buildOpportunities(
  judgment: ExecutiveJudgment,
  simulation: Simulation,
  learning: LearningResult | null,
): string[] {
  const learnedOpportunities =
    learning?.effectiveness
      .filter(
        (item) =>
          item.effectivenessScore >=
          0.65,
      )
      .map(
        (item) =>
          `Recommendation ${item.recommendationId} has produced encouraging results over time.`,
      ) ?? [];

  return uniqueStrings([
    simulation.bestCase.description,

    ...simulation.bestCase
      .recommendations,

    judgment.situation ===
    "accelerating"
      ? "Protect the behaviors currently supporting acceleration."
      : "",

    ...learnedOpportunities,
  ]).slice(0, 5);
}

function evidenceScore(
  evidence: ReasoningResult[
    "graph"
  ]["nodes"][number]["evidence"],
): number {
  return (
    normalizeConfidence(
      evidence.confidence,
    ) *
    evidence.impact
  );
}

function uniqueStrings(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim(),
        )
        .filter(
          (value) =>
            value.length > 0,
        ),
    ),
  );
}

function lowercaseFirst(
  value: string,
): string {
  if (!value) {
    return value;
  }

  return (
    value.charAt(0).toLowerCase() +
    value.slice(1)
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