import type {
  ReasoningResult,
} from "../reasoning";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

export function validateReasoning(
  reasoning: ReasoningResult,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateGraph(
    reasoning,
    issues,
  );

  validateWeights(
    reasoning,
    issues,
  );

  validateHypotheses(
    reasoning,
    issues,
  );

  validateInterpretation(
    reasoning,
    issues,
  );

  validateRecommendations(
    reasoning,
    issues,
  );

  validateEvaluation(
    reasoning,
    issues,
  );

  validateTrace(
    reasoning,
    issues,
  );

  return {
    valid:
      !issues.some(
        (issue) =>
          issue.severity ===
          "error",
      ),

    issues,
  };
}

function validateGraph(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  const nodeIds =
    new Set<string>();

  for (
    const node
    of reasoning.graph.nodes
  ) {
    if (!node.id.trim()) {
      issues.push({
        code:
          "reasoning.node.missing-id",

        severity:
          "error",

        message:
          "A reasoning graph node is missing an identifier.",
      });
    }

    if (
      node.id.trim() &&
      nodeIds.has(
        node.id,
      )
    ) {
      issues.push({
        code:
          "reasoning.node.duplicate-id",

        severity:
          "error",

        message:
          `Reasoning node ID "${node.id}" appears more than once.`,
      });
    }

    nodeIds.add(
      node.id,
    );

    validateNormalizedScore(
      node.weight,
      "reasoning.node.invalid-weight",
      `Reasoning node "${node.id}" has weight outside the 0–1 range.`,
      issues,
    );

    validateNormalizedScore(
      node.support,
      "reasoning.node.invalid-support",
      `Reasoning node "${node.id}" has support outside the 0–1 range.`,
      issues,
    );
  }

  for (
    const edge
    of reasoning.graph.edges
  ) {
    if (
      !nodeIds.has(
        edge.from,
      ) ||
      !nodeIds.has(
        edge.to,
      )
    ) {
      issues.push({
        code:
          "reasoning.edge.unknown-node",

        severity:
          "error",

        message:
          `Reasoning edge "${edge.id}" references a node that does not exist.`,
      });
    }

    validateNormalizedScore(
      edge.strength,
      "reasoning.edge.invalid-strength",
      `Reasoning edge "${edge.id}" has strength outside the 0–1 range.`,
      issues,
    );
  }
}

function validateWeights(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  const nodeEvidenceIds =
    new Set(
      reasoning.graph.nodes.map(
        (node) =>
          node.evidence.id,
      ),
    );

  for (
    const weight
    of reasoning.weights
  ) {
    if (
      !nodeEvidenceIds.has(
        weight.evidenceId,
      )
    ) {
      issues.push({
        code:
          "reasoning.weight.unknown-evidence",

        severity:
          "error",

        message:
          `Weight for evidence "${weight.evidenceId}" has no matching graph node.`,
      });
    }

    validateNormalizedScore(
      weight.baseScore,
      "reasoning.weight.invalid-base-score",
      `Evidence "${weight.evidenceId}" has an invalid base score.`,
      issues,
    );

    validateNormalizedScore(
      weight.adjustedScore,
      "reasoning.weight.invalid-adjusted-score",
      `Evidence "${weight.evidenceId}" has an invalid adjusted score.`,
      issues,
    );
  }
}

function validateHypotheses(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  const evidenceIds =
    new Set(
      reasoning.graph.nodes.map(
        (node) =>
          node.evidence.id,
      ),
    );

  const hypothesisIds =
    new Set<string>();

  for (
    const hypothesis
    of reasoning.hypotheses
  ) {
    if (!hypothesis.id.trim()) {
      issues.push({
        code:
          "reasoning.hypothesis.missing-id",

        severity:
          "error",

        message:
          "A hypothesis is missing an identifier.",
      });
    }

    if (
      hypothesisIds.has(
        hypothesis.id,
      )
    ) {
      issues.push({
        code:
          "reasoning.hypothesis.duplicate-id",

        severity:
          "error",

        message:
          `Hypothesis ID "${hypothesis.id}" appears more than once.`,
      });
    }

    hypothesisIds.add(
      hypothesis.id,
    );

    if (
      !hypothesis.title.trim() ||
      !hypothesis.description.trim()
    ) {
      issues.push({
        code:
          "reasoning.hypothesis.missing-content",

        severity:
          "error",

        message:
          `Hypothesis "${hypothesis.id}" is missing a title or description.`,
      });
    }

    validateNormalizedScore(
      hypothesis.confidence,
      "reasoning.hypothesis.invalid-confidence",
      `Hypothesis "${hypothesis.id}" has confidence outside the 0–1 range.`,
      issues,
    );

    validateEvidenceReferences(
      [
        ...hypothesis.supportingEvidence,
        ...hypothesis.conflictingEvidence,
      ],
      evidenceIds,
      `Hypothesis "${hypothesis.id}"`,
      issues,
    );
  }
}

function validateInterpretation(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  const {
    interpretation,
  } = reasoning;

  if (!interpretation.summary.trim()) {
    issues.push({
      code:
        "reasoning.interpretation.missing-summary",

      severity:
        "error",

      message:
        "The reasoning interpretation is missing a summary.",
    });
  }

  validateNormalizedScore(
    interpretation.confidence,
    "reasoning.interpretation.invalid-confidence",
    "Interpretation confidence is outside the 0–1 range.",
    issues,
  );

  if (
    interpretation.strongest &&
    !reasoning.hypotheses.some(
      (hypothesis) =>
        hypothesis.id ===
        interpretation.strongest?.id,
    )
  ) {
    issues.push({
      code:
        "reasoning.interpretation.unknown-strongest",

      severity:
        "error",

      message:
        "The strongest interpretation does not match a generated hypothesis.",
    });
  }

  const evidenceIds =
    new Set(
      reasoning.graph.nodes.map(
        (node) =>
          node.evidence.id,
      ),
    );

  validateEvidenceReferences(
    [
      ...interpretation.supportingEvidence,
      ...interpretation.conflictingEvidence,
    ],
    evidenceIds,
    "Interpretation",
    issues,
  );
}

function validateRecommendations(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  const evidenceIds =
    new Set(
      reasoning.graph.nodes.map(
        (node) =>
          node.evidence.id,
      ),
    );

  for (
    const recommendation
    of reasoning.recommendations
  ) {
    if (
      !recommendation.id.trim() ||
      !recommendation.title.trim() ||
      !recommendation.description.trim()
    ) {
      issues.push({
        code:
          "reasoning.recommendation.missing-content",

        severity:
          "error",

        message:
          "A recommendation is missing required content.",
      });
    }

    validateNormalizedScore(
      recommendation.confidence,
      "reasoning.recommendation.invalid-confidence",
      `Recommendation "${recommendation.id}" has confidence outside the 0–1 range.`,
      issues,
    );

    validateEvidenceReferences(
      recommendation.supportingEvidence,
      evidenceIds,
      `Recommendation "${recommendation.id}"`,
      issues,
    );

    if (
      !recommendation.provenance
    ) {
      issues.push({
        code:
          "reasoning.recommendation.missing-provenance",

        severity:
          "error",

        message:
          `Recommendation "${recommendation.id}" is missing provenance.`,
      });
    }
  }
}

function validateEvaluation(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  validateNormalizedScore(
    reasoning.evaluation
      .consistencyScore,
    "reasoning.evaluation.invalid-consistency",
    "Evaluation consistency score is outside the 0–1 range.",
    issues,
  );

  for (
    const contradiction
    of reasoning.evaluation
      .contradictions
  ) {
    if (
      !contradiction.id.trim() ||
      !contradiction.explanation.trim()
    ) {
      issues.push({
        code:
          "reasoning.evaluation.invalid-contradiction",

        severity:
          "warning",

        message:
          "An evaluation contradiction is missing identifying content.",
      });
    }
  }

  for (
    const gap
    of reasoning.evaluation.gaps
  ) {
    if (
      !gap.id.trim() ||
      !gap.explanation.trim()
    ) {
      issues.push({
        code:
          "reasoning.evaluation.invalid-gap",

        severity:
          "warning",

        message:
          "An evaluation gap is missing identifying content.",
      });
    }
  }
}

function validateTrace(
  reasoning: ReasoningResult,
  issues: ValidationIssue[],
): void {
  if (
    !reasoning.trace.generatedAt.trim()
  ) {
    issues.push({
      code:
        "reasoning.trace.missing-timestamp",

      severity:
        "warning",

      message:
        "The reasoning trace is missing its generation timestamp.",
    });
  }

  if (
    reasoning.trace.steps.length === 0
  ) {
    issues.push({
      code:
        "reasoning.trace.empty",

      severity:
        "warning",

      message:
        "The reasoning trace contains no recorded stages.",
    });
  }
}

function validateEvidenceReferences(
  references: string[],
  knownEvidenceIds: ReadonlySet<string>,
  owner: string,
  issues: ValidationIssue[],
): void {
  for (
    const evidenceId
    of references
  ) {
    if (
      !knownEvidenceIds.has(
        evidenceId,
      )
    ) {
      issues.push({
        code:
          "reasoning.unknown-evidence-reference",

        severity:
          "error",

        message:
          `${owner} references unknown evidence "${evidenceId}".`,
      });
    }
  }
}

function validateNormalizedScore(
  value: number,
  code: string,
  message: string,
  issues: ValidationIssue[],
): void {
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1
  ) {
    issues.push({
      code,

      severity:
        "error",

      message,
    });
  }
}