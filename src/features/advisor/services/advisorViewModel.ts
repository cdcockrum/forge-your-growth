import type {
  ForgeState,
} from "@/features/forge-engine";

import {
  composeExecutiveNarrative,
} from "@/features/forge-engine/reasoning-composer";

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
  const assessment =
    composeExecutiveNarrative({
      advisor:
        forge.advisor,

      beliefs:
        forge.beliefs,

      contradictions:
        forge.contradictions,

      patterns:
        forge.patterns,

      predictions:
        forge.predictions,
    });

  const strongestPattern =
    forge.patterns.strongestPattern;

  const strongestPrediction =
    forge.predictions.strongest;

  return {
    greeting:
      greeting(),

    summary:
      forge.advisor.message,

    assessment:
      assessment.summary,

    recommendation: {
      title:
        forge.advisor.title,

      explanation:
        forge.advisor.message,

      priority:
        mapAdvisorPriority(
          forge.advisor.priority,
        ),
    },

    actions:
      forge.advisor.actions,



    evidence:
      forge.evidence.strongest.map(
        (node) =>
          node.statement,
      ),

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
      forge.evidence.supporting
        .filter(
          (node) =>
            node.source !==
            "advisor",
        )
        .slice(0, 3)
        .map(
          (node) =>
            node.statement,
        ),

    risks:
      forge.evidence.contradicting
        .slice(0, 3)
        .map(
          (node) =>
            node.statement,
        ),

    reasoning:
      forge.advisor.reasoning,

    confidenceReasoning:
      forge.advisor.confidence,

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
      Math.round(
        assessment.confidence,
      ),
  };
}

function mapAdvisorPriority(
  priority:
    ForgeState["advisor"]["priority"],
): AdvisorViewModel[
  "recommendation"
]["priority"] {
  switch (priority) {
    case "recovery":
      return "high";

    case "consistency":
      return "high";

    case "focus":
      return "medium";

    case "identity":
      return "medium";

    case "vision":
      return "low";

    default:
      return "medium";
  }
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