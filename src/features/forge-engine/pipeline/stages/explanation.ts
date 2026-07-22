import {
  buildEvidenceNodes,
  createEvidenceGraph,
} from "../../evidence";

import type {
  FoundationStage,
} from "./foundation";

import type {
  InterpretationStage,
} from "./interpretation";

import type {
  ReasoningStage,
} from "./reasoning";

export type ExplanationStage = {
  evidence: ReturnType<
    typeof createEvidenceGraph
  >;
};

type ExplanationOptions = {
  foundation: FoundationStage;
  interpretation: InterpretationStage;
  reasoning: ReasoningStage;
};

export function buildExplanationStage({
  foundation,
  interpretation,
  reasoning,
}: ExplanationOptions): ExplanationStage {
  const evidence = createEvidenceGraph(
    buildEvidenceNodes({
      progress: foundation.progress,
      identity: interpretation.identity,
      advisor: reasoning.advisor,
    }),
  );

  return {
    evidence,
  };
}