import {
  buildAdvisorAnalysis,
} from "../advisor-v2/advisorEngine";

import {
  buildAdvisorVoice,
} from "../advisor-v2/communication";

import type {
  ForgeCognitionInput,
  ForgeCognitionResult,
  ForgeCognitionSummary,
} from "./cognition.types";

export function buildCognition(
  input: ForgeCognitionInput,
): ForgeCognitionResult {
  const {
    forge,
    adaptiveLearning,
    generatedAt,
  } = input;

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

  const confidence =
    normalizeScore(
      advisor.confidence.score,
    );

  const voice =
    buildAdvisorVoice(
      confidence,
    );

  const summary =
    buildCognitionSummary({
      confidence,
      evidenceCount:
        advisor.reasoning.graph.nodes.length,

      isLearning:
        Boolean(
          adaptiveLearning &&
            adaptiveLearning.summary
              .evaluatedCount > 0,
        ),

      generatedAt,

      voice,
    });

  return {
    state: {
      forge,
      advisor,
      adaptiveLearning,
      voice,
      generatedAt,
    },

    summary,
  };
}

function buildCognitionSummary({
  confidence,
  evidenceCount,
  isLearning,
  generatedAt,
  voice,
}: {
  confidence: number;

  evidenceCount: number;

  isLearning: boolean;

  generatedAt: string;

  voice: {
    opening: string;

    transition: string;

    closing: string;
  };
}): ForgeCognitionSummary {
  const learningStatement =
    isLearning
      ? "Forge is updating its understanding from observed recommendation outcomes."
      : "Forge has not yet gathered enough recommendation outcomes to adapt its understanding.";

  return {
    confidence,

    headline:
      voice.opening,

    explanation: [
      voice.transition,
      learningStatement,
      voice.closing,
    ].join(" "),

    isLearning,

    evidenceCount,

    generatedAt,
  };
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
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