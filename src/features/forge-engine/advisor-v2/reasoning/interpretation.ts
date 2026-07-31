import type {
  Hypothesis,
  Interpretation,
  ReasoningAnalysis,
} from "./reasoning.types";

import type {
  EvaluationResult,
} from "./evaluation";

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(1, value),
  );
}

function uniqueValues(
  values: string[],
): string[] {
  return Array.from(
    new Set(values),
  );
}

function calculateConflictPenalty(
  hypothesis: Hypothesis,
  analysis: ReasoningAnalysis,
): number {
  if (
    hypothesis.conflictingEvidence.length === 0
  ) {
    return 0;
  }

  const conflictingEvidence =
    new Set(
      hypothesis.conflictingEvidence,
    );

  const contradictionSeverity =
    analysis.contradictions.reduce(
      (total, contradiction) => {
        const overlaps =
          contradiction.evidenceIds.some(
            (evidenceId) =>
              conflictingEvidence.has(
                evidenceId,
              ),
          );

        return overlaps
          ? total +
              contradiction.severity
          : total;
      },
      0,
    );

  const tensionSeverity =
    analysis.tensions.reduce(
      (total, tension) => {
        const overlaps =
          tension.evidenceIds.some(
            (evidenceId) =>
              conflictingEvidence.has(
                evidenceId,
              ),
          );

        return overlaps
          ? total +
              tension.severity
          : total;
      },
      0,
    );

  return Math.min(
    contradictionSeverity * 0.12 +
      tensionSeverity * 0.06,
    0.3,
  );
}

function calculateEvidenceBreadthBonus(
  hypothesis: Hypothesis,
): number {
  const totalEvidence =
    uniqueValues([
      ...hypothesis.supportingEvidence,
      ...hypothesis.conflictingEvidence,
    ]).length;

  if (totalEvidence <= 1) {
    return 0;
  }

  return Math.min(
    (totalEvidence - 1) * 0.025,
    0.1,
  );
}

function calculateSupportRatio(
  hypothesis: Hypothesis,
): number {
  const supportingCount =
    uniqueValues(
      hypothesis.supportingEvidence,
    ).length;

  const conflictingCount =
    uniqueValues(
      hypothesis.conflictingEvidence,
    ).length;

  const total =
    supportingCount +
    conflictingCount;

  if (total === 0) {
    return 0;
  }

  return supportingCount / total;
}

function calculateHypothesisScore(
  hypothesis: Hypothesis,
  analysis: ReasoningAnalysis,
): number {
  const confidence =
    clamp01(
      hypothesis.confidence,
    );

  const breadthBonus =
    calculateEvidenceBreadthBonus(
      hypothesis,
    );

  const supportRatio =
    calculateSupportRatio(
      hypothesis,
    );

  const supportAdjustment =
    supportRatio * 0.08;

  const conflictPenalty =
    calculateConflictPenalty(
      hypothesis,
      analysis,
    );

  return clamp01(
    confidence +
      breadthBonus +
      supportAdjustment -
      conflictPenalty,
  );
}

function rankHypotheses(
  hypotheses: Hypothesis[],
  analysis: ReasoningAnalysis,
): Hypothesis[] {
  return [...hypotheses].sort(
    (first, second) =>
      calculateHypothesisScore(
        second,
        analysis,
      ) -
      calculateHypothesisScore(
        first,
        analysis,
      ),
  );
}

function buildInterpretationSummary(
  strongest: Hypothesis | null,
  evaluation: EvaluationResult,
): string {
  if (!strongest) {
    return (
      "There is not yet enough evidence to form " +
      "a supported interpretation."
    );
  }

  const competingCount =
    evaluation.competingHypotheses.length;

  if (
    evaluation.contradictions.length > 0
  ) {
    return (
      `${strongest.description} ` +
      "However, meaningful contradictory evidence remains, " +
      "so this interpretation should be treated cautiously."
    );
  }

  if (competingCount > 0) {
    return (
      `${strongest.description} ` +
      `${competingCount === 1
        ? "A credible alternative explanation remains"
        : `${competingCount} credible alternative explanations remain`
      }, so the current conclusion should remain provisional.`
    );
  }

  if (
    evaluation.tensions.length > 0
  ) {
    return (
      `${strongest.description} ` +
      "Some evidence remains in tension with this interpretation, " +
      "but the overall pattern currently supports it."
    );
  }

  if (
    evaluation.gaps.length > 0
  ) {
    return (
      `${strongest.description} ` +
      "This is the strongest current interpretation, although " +
      "missing evidence limits certainty."
    );
  }

  return (
    `${strongest.description} ` +
    "The available evidence is broadly consistent with this interpretation."
  );
}

function calculateInterpretationConfidence(
  strongest: Hypothesis | null,
  analysis: ReasoningAnalysis,
  evaluation: EvaluationResult,
): number {
  if (!strongest) {
    return 0;
  }

  const hypothesisScore =
    calculateHypothesisScore(
      strongest,
      analysis,
    );

  /*
   * Consistency adjusts confidence without
   * completely overriding the strength of
   * the underlying hypothesis.
   *
   * A consistency score of:
   *
   * 1.0 preserves the full score.
   * 0.5 preserves 82.5% of the score.
   * 0.0 preserves 65% of the score.
   */
  const consistencyMultiplier =
    0.65 +
    evaluation.consistencyScore * 0.35;

  const competitionPenalty =
    Math.min(
      evaluation.competingHypotheses.length *
        0.04,
      0.12,
    );

  return clamp01(
    hypothesisScore *
      consistencyMultiplier -
      competitionPenalty,
  );
}

function collectSupportingEvidence(
  strongest: Hypothesis | null,
  analysis: ReasoningAnalysis,
): string[] {
  if (!strongest) {
    return [];
  }

  const agreementEvidence =
    analysis.agreements
      .filter((agreement) =>
        agreement.evidenceIds.some(
          (evidenceId) =>
            strongest.supportingEvidence.includes(
              evidenceId,
            ),
        ),
      )
      .flatMap(
        (agreement) =>
          agreement.evidenceIds,
      );

  return uniqueValues([
    ...strongest.supportingEvidence,
    ...agreementEvidence,
  ]);
}

function collectConflictingEvidence(
  strongest: Hypothesis | null,
  analysis: ReasoningAnalysis,
): string[] {
  if (!strongest) {
    return [];
  }

  const relevantEvidence =
    new Set([
      ...strongest.supportingEvidence,
      ...strongest.conflictingEvidence,
    ]);

  const contradictionEvidence =
    analysis.contradictions
      .filter((contradiction) =>
        contradiction.evidenceIds.some(
          (evidenceId) =>
            relevantEvidence.has(
              evidenceId,
            ),
        ),
      )
      .flatMap(
        (contradiction) =>
          contradiction.evidenceIds,
      );

  const tensionEvidence =
    analysis.tensions
      .filter((tension) =>
        tension.evidenceIds.some(
          (evidenceId) =>
            relevantEvidence.has(
              evidenceId,
            ),
        ),
      )
      .flatMap(
        (tension) =>
          tension.evidenceIds,
      );

  return uniqueValues([
    ...strongest.conflictingEvidence,
    ...contradictionEvidence,
    ...tensionEvidence,
  ]);
}

export function buildInterpretation(
  hypotheses: Hypothesis[],
  analysis: ReasoningAnalysis,
  evaluation: EvaluationResult,
): Interpretation {
  const rankedHypotheses =
    rankHypotheses(
      hypotheses,
      analysis,
    );

  const strongest =
    rankedHypotheses.at(0) ??
    null;

  return {
    summary:
      buildInterpretationSummary(
        strongest,
        evaluation,
      ),

    hypotheses:
      rankedHypotheses,

    strongest,

    confidence:
      calculateInterpretationConfidence(
        strongest,
        analysis,
        evaluation,
      ),

    supportingEvidence:
      collectSupportingEvidence(
        strongest,
        analysis,
      ),

    conflictingEvidence:
      collectConflictingEvidence(
        strongest,
        analysis,
      ),
  };
}