import type {
  ForgeState,
} from "@/features/forge-engine";

import {
  buildAdvisorAnalysis,
} from "@/features/forge-engine/advisor-v2/advisorEngine";

import {
  runCommunicationPipeline,
} from "@/features/forge-engine/advisor-v2/communication";

export type AdvisorViewModel = {
  greeting: string;

  summary: string;

  assessment: string;

  recommendation: {
    title: string;
    explanation: string;
    priority:
      | "low"
      | "medium"
      | "high";
  };

  evidence: string[];

  beliefs: {
    id: string;
    statement: string;
    confidence: number;
  }[];

  opportunities: string[];

  risks: string[];

  strongestContradiction:
    ForgeState["contradictions"]["strongest"];

  pattern: {
    title: string;
    description: string;
    confidence:
      | "low"
      | "medium"
      | "high";
    recommendation?: string;
  } | null;

  prediction: {
    title: string;
    description: string;
    confidence: number;
    recommendation: string;
  } | null;

  reasoning: string[];

  actions: string[];

  confidenceReasoning: number;

  memories: {
    title: string;
    summary: string;
  }[];

  longTermDirection: string;

  confidence: number;
};

export function buildAdvisorViewModel(
  forge: ForgeState,
): AdvisorViewModel {
  const advisor =
    buildAdvisorAnalysis({
      progress:
        forge.progress,

      momentum:
        forge.momentum,

      identity:
        forge.identity,

      memory:
        forge.memory,

      history:
        forge.history,

      patterns:
        forge.patterns,

      beliefs:
        forge.beliefs,

      predictions:
        forge.predictions,

      trendAnalysis:
        forge.trendAnalysis,

      vision:
        forge.vision,
    });

  const strongestPattern =
    forge.patterns.strongestPattern;

  const strongestPrediction =
    forge.predictions.strongest;

  const primaryRecommendation =
    advisor.reasoning.recommendations[0] ??
    null;

  const recommendationItem =
    advisor.brief.items.find(
      (item) =>
        item.section ===
        "recommendation",
    ) ?? null;

  const opportunityItem =
    advisor.brief.items.find(
      (item) =>
        item.section ===
        "opportunity",
    ) ?? null;

  const assessment =
    advisor.brief.items
      .flatMap(
        (item) =>
          item.body,
      )
      .filter(
        (statement) =>
          statement.trim().length > 0,
      )
      .join(" ");

  const reasoning =
    uniqueStrings([
      ...(
        advisor.reasoning
          .interpretation
          .strongest
          ?.rationale ?? []
      ),

      ...advisor.confidence.reasons.map(
        (reason) =>
          reason.message,
      ),
    ]);

  const actions =
    uniqueStrings(
      advisor.reasoning
        .recommendations
        .flatMap(
          (recommendation) => [
            recommendation.description,
            ...recommendation.rationale,
          ],
        )
        .slice(0, 4),
    );



  const communication =
  runCommunicationPipeline({
    evidence:
      advisor.evidence,

    reasoning:
      advisor.reasoning,

    confidence:
      advisor.confidence,

    brief:
      advisor.brief,
  });

  return {
    greeting:
      greeting(),

    summary:
      communication.summary,

    assessment:
      communication.assessment,


    recommendation:
      communication.recommendation,
        actions:
          

      communication.actions.length > 0
        ? communication.actions
        : forge.advisor.actions,

    evidence:
      communication.evidence,

    beliefs:
      forge.beliefs.strongest.map(
        (belief) => ({
          id:
            belief.id,

          statement:
            belief.statement,

          confidence:
            belief.confidence,
        }),
      ),

    opportunities:
      communication.opportunities,

    risks:
      communication.risks,

    reasoning:
      communication.reasoning,

    
    confidenceReasoning:
      advisor.confidence.score,

    strongestContradiction:
      forge.contradictions.strongest,

    pattern:
      strongestPattern
        ? {
            title:
              strongestPattern.title,

            description:
              strongestPattern.description,

            confidence:
              strongestPattern.confidence,

            recommendation:
              strongestPattern.recommendation,
          }
        : null,

    prediction:
      strongestPrediction
        ? {
            title:
              strongestPrediction.title,

            description:
              strongestPrediction.description,

            confidence:
              strongestPrediction.confidence,

            recommendation:
              strongestPrediction.recommendation,
          }
        : null,

    memories:
      forge.memory.strongest.map(
        (memory) => ({
          title:
            memory.title,

          summary:
            memory.summary,
        }),
      ),

    longTermDirection:
      forge.vision?.north_star
        ?.trim() ||
      "Continue becoming the person you described in your vision.",

    confidence:
      advisor.confidence.score,
  };
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

function greeting(): string {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning.";
  }

  if (hour < 18) {
    return "Good afternoon.";
  }

  return "Good evening.";
}