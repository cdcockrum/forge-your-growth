import type {
  AdvisorEvidence,
} from "../advisor.types";

import {
  analyzeEvidenceRelationships,
} from "./reasoningAnalyzer";

import {
  buildEvidenceGraph,
} from "./evidenceGraph";

import {
  generateHypotheses,
} from "./hypotheses";

import {
  buildInterpretation,
} from "./interpretation";

import {
  buildRecommendations,
} from "./recommendations";

import type {
  ReasoningResult,
} from "./reasoning.types";

import {
  weightEvidenceGraph,
} from "./weighting";


import {
  evaluateReasoning,
} from "./evaluation";

import {
  buildReasoningTrace,
} from "./trace";

export function runReasoningPipeline(
  evidence: AdvisorEvidence[],
): ReasoningResult {
  const initialGraph =
    buildEvidenceGraph(
      evidence,
    );

  const weighted =
    weightEvidenceGraph(
      initialGraph,
    );

  const analysis =
    analyzeEvidenceRelationships(
      weighted.graph,
      weighted.weights,
    );

  const hypotheses =
    generateHypotheses(
      weighted.graph,
      weighted.weights,
      analysis,
    );

  const evaluation =
  evaluateReasoning(
    analysis,
    hypotheses,
  );

  const interpretation =
  buildInterpretation(
    hypotheses,
    analysis,
    evaluation,
  );

  const recommendations =
  buildRecommendations(
    interpretation,
    evaluation,
  );

  const trace =
  buildReasoningTrace(
    interpretation,
    analysis,
    evaluation,
  );

  return {
    graph:
      weighted.graph,

    weights:
      weighted.weights,

    analysis,

    conflicts: [],

    hypotheses,

    interpretation,

    evaluation,

    recommendations,

    trace,
  };
}