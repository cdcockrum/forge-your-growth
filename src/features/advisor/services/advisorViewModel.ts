import type {
  ForgeState,
} from "@/features/forge-engine";

import {
  buildAdvisorAnalysis,
} from "@/features/forge-engine/advisor-v2/advisorEngine";

import type {
  AdvisorResult,
} from "@/features/forge-engine/advisor-v2/advisor.types";

import {
  runCommunicationPipeline,
} from "@/features/forge-engine/advisor-v2/communication";

type ReadableRecommendationProvenance = {
  explanation: string;

  evidence: string[];

  hypotheses: string[];

  conflicts: string[];

  gaps: string[];
};

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

    confidence: number;

    provenance:
      ReadableRecommendationProvenance | null;
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

export function buildAdvisorAnalysisFromForge(
  forge: ForgeState,
): AdvisorResult {
  return buildAdvisorAnalysis({
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
}

export function buildAdvisorViewModel(
  forge: ForgeState,
): AdvisorViewModel {
  const advisor =
    buildAdvisorAnalysisFromForge(
      forge,
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

  const strongestPattern =
    forge.patterns.strongestPattern;

  const strongestPrediction =
    forge.predictions.strongest;

  const primaryRecommendation =
    advisor.reasoning
      .recommendations[0] ?? null;

  const readableProvenance =
    buildReadableProvenance(
      advisor,
    );

  return {
    greeting:
      greeting(),

    summary:
      communication.summary,

    assessment:
      communication.assessment,

    recommendation: {
      title:
        communication.recommendation.title,

      explanation:
        communication.recommendation.explanation,

      priority:
        communication.recommendation.priority,

      confidence:
        primaryRecommendation?.confidence ??
        advisor.confidence.score,

      provenance:
        readableProvenance,
    },

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

function buildReadableProvenance(
  advisor: AdvisorResult,
): AdvisorViewModel[
  "recommendation"
]["provenance"] {
  const recommendation =
    advisor.reasoning
      .recommendations[0] ?? null;

  if (!recommendation) {
    return null;
  }

  const {
    provenance,
  } = recommendation;

  const evidenceById =
    new Map<string, string>(
      advisor.reasoning.graph.nodes.map(
        (node) => [
          node.evidence.id,
          node.evidence.statement,
        ],
      ),
    );

  const hypothesisById =
    new Map<string, string>(
      advisor.reasoning.hypotheses.map(
        (hypothesis) => [
          hypothesis.id,
          hypothesis.title,
        ],
      ),
    );

  const contradictionById =
    new Map<string, string>(
      advisor.reasoning.evaluation
        .contradictions.map(
          (contradiction) => [
            contradiction.id,
            contradiction.explanation,
          ],
        ),
    );

  const gapById =
    new Map<string, string>(
      advisor.reasoning.evaluation
        .gaps.map(
          (gap) => [
            gap.id,
            gap.explanation,
          ],
        ),
    );

  return {
    explanation:
      provenance.explanation,

    evidence:
      resolveReferences(
        provenance.evidenceIds,
        evidenceById,
      ),

    hypotheses:
      resolveReferences(
        provenance.hypothesisIds,
        hypothesisById,
      ),

    conflicts:
      resolveReferences(
        provenance.conflictIds,
        contradictionById,
      ),

    gaps:
      resolveReferences(
        provenance.gapIds,
        gapById,
      ),
  };
}

function resolveReferences(
  ids: string[],
  references: ReadonlyMap<
    string,
    string
  >,
): string[] {
  return Array.from(
    new Set(
      ids
        .map(
          (id) =>
            references.get(id),
        )
        .filter(
          (
            value,
          ): value is string =>
            Boolean(
              value?.trim(),
            ),
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