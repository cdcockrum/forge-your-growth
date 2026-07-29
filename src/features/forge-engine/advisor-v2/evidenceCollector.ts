// src/features/forge-engine/advisor-v2/evidenceCollector.ts

import type {
  AdvisorEvidence,
  BuildAdvisorAnalysisInput,
} from "./advisor.types";

import {
  buildBeliefEvidence,
  buildIdentityEvidence,
  buildMemoryEvidence,
  buildMomentumEvidence,
  buildPatternEvidence,
  buildPredictionEvidence,
  buildProgressEvidence,
  buildTrendEvidence,
  buildVisionEvidence,
  buildHistoryEvidence,
} from "./evidence";

export function collectEvidence(
  input: BuildAdvisorAnalysisInput,
): AdvisorEvidence[] {
  const evidence: AdvisorEvidence[] = [];

  evidence.push(
    ...buildProgressEvidence(
      input.progress,
    ),
  );

  evidence.push(
    ...buildMemoryEvidence(
      input.memory,
    ),
  );

  evidence.push(
    ...buildMomentumEvidence(
      input.momentum,
    ),
  );

  evidence.push(
    ...buildHistoryEvidence(
      input.history,
    ),
  );


  evidence.push(
    ...buildBeliefEvidence(
      input.beliefs,
    ),
  );

 evidence.push(
    ...buildPredictionEvidence(
      input.predictions,
    ),
  );

evidence.push(
  ...buildTrendEvidence(
    input.trendAnalysis,
  ),
);

  evidence.push(
    ...buildIdentityEvidence(
      input.identity,
    ),
  );

  evidence.push(
    ...buildPatternEvidence(
      input.patterns,
    ),
  );

  evidence.push(
    ...buildVisionEvidence(
      input.vision,
    ),
  );

  return evidence;
}