import type {
  ForgeState,
} from "@/features/forge-engine";

import {
  buildAdvisorCognitiveViewModel,
} from "@/features/forge-engine/advisor-v2";

import {
  buildAdvisorAnalysis,
} from "@/features/forge-engine/advisor-v2/advisorEngine";

import type {
  AdvisorResult,
} from "@/features/forge-engine/advisor-v2/advisor.types";

import {
  runCommunicationPipeline,
} from "@/features/forge-engine/advisor-v2/communication";

import type {
  AdvisorAdaptiveLearning,
} from "@/features/forge-engine/advisor-v2";

import {
  runCognitionPipeline,
} from "@/features/forge-engine/cognition";

import type {
  ForgeCognitionSummary,
} from "@/features/forge-engine/cognition";

import {
  buildAdvisorNarrative,
} from "./buildAdvisorNarrative";

import type {
  AdvisorNarrativeResult,
} from "./buildAdvisorNarrative";

type ReadableRecommendationProvenance = {
  explanation: string;

  evidence: string[];

  hypotheses: string[];

  conflicts: string[];

  gaps: string[];
};

type AdvisorSimulationScenario = {
  title: string;

  description: string;

  probability: number;

  trajectory: string;

  recommendations: string[];
};

type AdvisorWisdomInsight = {
  id: string;

  title: string;

  explanation: string;

  confidence: number;
};

type AdvisorCognitiveResult =
  ReturnType<
    typeof buildAdvisorCognitiveViewModel
  >;

export type AdvisorViewModel = {
  greeting: string;

  summary: string;

  assessment: string;

  narrative:
  AdvisorNarrativeResult;

  cognition:
    AdvisorCognitiveResult[
      "cognition"
    ];

  cognitiveRecommendation:
    AdvisorCognitiveResult[
      "recommendation"
    ];

  cognitiveAlerts:
    AdvisorCognitiveResult[
      "alerts"
    ];

  recommendation: {
  id: string | null;

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
    ForgeState[
      "contradictions"
    ][
      "strongest"
    ];

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

  wisdom: {
    narrative: string;

    insights:
      AdvisorWisdomInsight[];

    longTermThemes: string[];

    emergingIdentity: string[];

    cautions: string[];

    opportunities: string[];

    confidence: number;
  };

  reflection: {
    confidenceStatement: string;

    assumptions: string[];

    uncertainties: string[];

    alternativeInterpretations:
      string[];

    additionalEvidenceNeeded:
      string[];
  };

  simulation: {
    bestCase:
      AdvisorSimulationScenario;

    expectedCase:
      AdvisorSimulationScenario;

    worstCase:
      AdvisorSimulationScenario;
  };

  actions: string[];

  confidenceReasoning: number;

  memories: {
    title: string;

    summary: string;
  }[];

  longTermDirection: string;

  confidence: number;

  adaptiveLearning: AdvisorAdaptiveLearning | null;

  cognitionSummary:
  ForgeCognitionSummary;
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
  adaptiveLearning:
    AdvisorAdaptiveLearning | null =
      null,
): AdvisorViewModel {
  const cognition =
    runCognitionPipeline({
      forge,

      adaptiveLearning:
        adaptiveLearning,

      generatedAt:
        new Date().toISOString(),
    });

  const advisor =
    cognition.state.advisor;

  const cognitiveViewModel =
    buildAdvisorCognitiveViewModel(
      advisor,
    );

  const communication =
    runCommunicationPipeline({
      wisdom:
        advisor.wisdom,

      confidence:
        advisor.confidence,

      brief:
        advisor.brief,
    });

  const strongestPattern =
    forge.patterns
      .strongestPattern;

  const strongestPrediction =
    forge.predictions
      .strongest;

  const primaryRecommendation =
    advisor.reasoning
      .recommendations[0] ??
    null;

  const readableProvenance =
    buildReadableProvenance(
      advisor,
    );

  const advisorNarrative =
    buildAdvisorNarrative({
      greeting:
        greeting(),

      assessment:
        communication.assessment,

      recommendation: {
          
          title:
            communication
              .recommendation
              .title,

        explanation:
          communication
            .recommendation
            .explanation,

        confidence:
          primaryRecommendation
            ?.confidence ??
          advisor.confidence
            .score,
      },

      cognitionSummary:
        cognition.summary,

      strongestBelief:
        forge.beliefs
          .strongest[0]
          ? {
              statement:
                forge.beliefs
                  .strongest[0]
                  .statement,

              confidence:
                forge.beliefs
                  .strongest[0]
                  .confidence,
            }
          : null,

      strongestPattern:
        strongestPattern
          ? {
              title:
                strongestPattern
                  .title,

              description:
                strongestPattern
                  .description,
            }
          : null,

      strongestPrediction:
        strongestPrediction
          ? {
              title:
                strongestPrediction
                  .title,

              description:
                strongestPrediction
                  .description,

              confidence:
                strongestPrediction
                  .confidence,
            }
          : null,

      primaryRisk:
        communication
          .risks[0] ??
        null,

      primaryOpportunity:
        communication
          .opportunities[0] ??
        null,
    });

  return {
    
    greeting:
      greeting(),

    summary:
      communication.summary,

    assessment:
      communication.assessment,

    narrative:
      advisorNarrative,

    cognitionSummary:
      cognition.summary,

    cognition:
      cognitiveViewModel
        .cognition,

    cognitiveRecommendation:
      cognitiveViewModel
        .recommendation,

    cognitiveAlerts:
      cognitiveViewModel
        .alerts,

    recommendation: {
      id:
        primaryRecommendation
          ?.id ?? null,

      title:
        communication
          .recommendation
          .title,

      explanation:
        communication
          .recommendation
          .explanation,

      priority:
        communication
          .recommendation
          .priority,

      confidence:
        primaryRecommendation
          ?.confidence ??
        advisor.confidence
          .score,

      provenance:
        readableProvenance,
    },

    evidence:
      communication.evidence,

    beliefs:
      forge.beliefs
        .strongest
        .map(
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
      communication
        .opportunities,

    risks:
      communication.risks,

    strongestContradiction:
      forge.contradictions
        .strongest,

    pattern:
      strongestPattern
        ? {
            title:
              strongestPattern
                .title,

            description:
              strongestPattern
                .description,

            confidence:
              strongestPattern
                .confidence,

            recommendation:
              strongestPattern
                .recommendation,
          }
        : null,

    prediction:
      strongestPrediction
        ? {
            title:
              strongestPrediction
                .title,

            description:
              strongestPrediction
                .description,

            confidence:
              strongestPrediction
                .confidence,

            recommendation:
              strongestPrediction
                .recommendation,
          }
        : null,

    reasoning:
      communication.reasoning,

    wisdom: {
      narrative:
        advisor.wisdom
          .narrative,

      insights:
        advisor.wisdom
          .insights
          .map(
            (insight) => ({
              id:
                insight.id,

              title:
                insight.title,

              explanation:
                insight.explanation,

              confidence:
                insight.confidence,
            }),
          ),

      longTermThemes: [
        ...advisor.wisdom
          .longTermThemes,
      ],

      emergingIdentity: [
        ...advisor.wisdom
          .emergingIdentity,
      ],

      cautions: [
        ...advisor.wisdom
          .cautions,
      ],

      opportunities: [
        ...advisor.wisdom
          .opportunities,
      ],

      confidence:
        advisor.wisdom
          .confidence,
    },

    reflection: {
      confidenceStatement:
        advisor.reflection
          .confidenceStatement,

      assumptions: [
        ...advisor.reflection
          .assumptions,
      ],

      uncertainties: [
        ...advisor.reflection
          .uncertainties,
      ],

      alternativeInterpretations: [
        ...advisor.reflection
          .alternativeInterpretations,
      ],

      additionalEvidenceNeeded: [
        ...advisor.reflection
          .additionalEvidenceNeeded,
      ],
    },

    simulation: {
      bestCase:
        mapSimulationScenario(
          advisor.simulation
            .bestCase,
        ),

      expectedCase:
        mapSimulationScenario(
          advisor.simulation
            .expectedCase,
        ),

      worstCase:
        mapSimulationScenario(
          advisor.simulation
            .worstCase,
        ),
    },

    actions:
      communication.actions
        .length > 0
        ? communication.actions
        : forge.advisor
            .actions,

    confidenceReasoning:
      advisor.confidence
        .score,

    adaptiveLearning,

    memories:
      forge.memory
        .strongest
        .map(
          (memory) => ({
            title:
              memory.title,

            summary:
              memory.summary,
          }),
        ),

    longTermDirection:
      forge.vision
        ?.north_star
        ?.trim() ||
      "Continue becoming the person you described in your vision.",

    confidence:
      advisor.confidence
        .score,
  };
}

function mapSimulationScenario(
  scenario: AdvisorResult[
    "simulation"
  ][
    "bestCase"
  ],
): AdvisorSimulationScenario {
  return {
    title:
      scenario.title,

    description:
      scenario.description,

    probability:
      scenario.probability,

    trajectory:
      scenario.trajectory,

    recommendations: [
      ...scenario.recommendations,
    ],
  };
}

function buildReadableProvenance(
  advisor: AdvisorResult,
): AdvisorViewModel[
  "recommendation"
][
  "provenance"
] {
  const recommendation =
    advisor.reasoning
      .recommendations[0] ??
    null;

  if (!recommendation) {
    return null;
  }

  const {
    provenance,
  } = recommendation;

  const evidenceById =
    new Map<string, string>(
      advisor.reasoning
        .graph
        .nodes
        .map(
          (node) => [
            node.evidence.id,
            node.evidence.statement,
          ],
        ),
    );

  const hypothesisById =
    new Map<string, string>(
      advisor.reasoning
        .hypotheses
        .map(
          (hypothesis) => [
            hypothesis.id,
            hypothesis.title,
          ],
        ),
    );

  const contradictionById =
    new Map<string, string>(
      advisor.reasoning
        .evaluation
        .contradictions
        .map(
          (
            contradiction,
          ) => [
            contradiction.id,
            contradiction
              .explanation,
          ],
        ),
    );

  const gapById =
    new Map<string, string>(
      advisor.reasoning
        .evaluation
        .gaps
        .map(
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
        provenance
          .hypothesisIds,
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
  references:
    ReadonlyMap<
      string,
      string
    >,
): string[] {
  return Array.from(
    new Set(
      ids
        .map(
          (id) =>
            references.get(
              id,
            ),
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
    new Date()
      .getHours();

  if (hour < 12) {
    return "Good morning.";
  }

  if (hour < 18) {
    return "Good afternoon.";
  }

  return "Good evening.";
}