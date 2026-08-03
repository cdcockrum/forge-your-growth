import type {
  AdvisorResult,
} from "../advisor.types";

import {
  validateEvidence,
} from "./evidenceValidator";

import {
  validateJudgment,
} from "./judgmentValidator";

import {
  validateReasoning,
} from "./reasoningValidator";

import {
  validateReflection,
} from "./reflectionValidator";

import {
  validateSimulation,
} from "./simulationValidator";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

import {
  validateWisdom,
} from "./wisdomValidator";

import {
  validateEpistemology,
} from "./epistemologyValidator";

import {
  validateCalibration,
} from "./calibrationValidator";

export function validateAdvisor(
  advisor: AdvisorResult,
): ValidationResult {
  const results = [
    validateEvidence(
      advisor.evidence,
    ),

    validateReasoning(
      advisor.reasoning,
    ),

    validateJudgment(
      advisor.judgment,
    ),

    validateReflection(
      advisor.reflection,
    ),

    validateSimulation(
      advisor.simulation,
    ),

    validateWisdom(
      advisor.wisdom,
    ),

    validateEpistemology(
      advisor.epistemology,
    ),


    validateCalibration(
    advisor.calibration,
    ),
  ];

  const issues =
    deduplicateIssues(
      results.flatMap(
        (result) =>
          result.issues,
      ),
    );

  validateCrossStageConsistency(
    advisor,
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

function validateCrossStageConsistency(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  validateEvidenceGraphAlignment(
    advisor,
    issues,
  );

  validateJudgmentAlignment(
    advisor,
    issues,
  );

  validateReflectionAlignment(
    advisor,
    issues,
  );

  validateSimulationAlignment(
    advisor,
    issues,
  );

  validateWisdomAlignment(
    advisor,
    issues,
  );
  validateEpistemologyAlignment(
    advisor,
    issues,
  );

  validateCalibrationAlignment(
    advisor,
    issues,
  );
}

function validateEvidenceGraphAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  const collectedEvidenceIds =
    new Set(
      advisor.evidence.map(
        (evidence) =>
          evidence.id,
      ),
    );

  for (
    const node
    of advisor.reasoning.graph.nodes
  ) {
    if (
      !collectedEvidenceIds.has(
        node.evidence.id,
      )
    ) {
      issues.push({
        code:
          "advisor.reasoning.unknown-evidence",

        severity:
          "error",

        message:
          `Reasoning graph references evidence "${node.evidence.id}" that is not present in the Advisor evidence collection.`,
      });
    }
  }

  if (
    advisor.evidence.length > 0 &&
    advisor.reasoning.graph.nodes
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.reasoning.empty-graph",

      severity:
        "error",

      message:
        "Advisor collected evidence, but the reasoning graph contains no nodes.",
    });
  }
}

function validateJudgmentAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  if (
    advisor.judgment.situation ===
      "uncertain" &&
    advisor.reasoning.graph.nodes
      .length > 0 &&
    advisor.judgment.confidence >
      0.75
  ) {
    issues.push({
      code:
        "advisor.judgment.inconsistent-uncertainty",

      severity:
        "warning",

      message:
        "Advisor judgment is uncertain despite having evidence and high confidence.",
    });
  }

  if (
    advisor.reasoning.graph.nodes
      .length === 0 &&
    advisor.judgment.situation !==
      "uncertain"
  ) {
    issues.push({
      code:
        "advisor.judgment.without-evidence",

      severity:
        "error",

      message:
        "Advisor formed a definitive judgment without reasoning evidence.",
    });
  }
}

function validateReflectionAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  if (
    advisor.judgment.situation ===
      "uncertain" &&
    advisor.reflection.uncertainties
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.reflection.missing-uncertainty",

      severity:
        "warning",

      message:
        "Advisor judgment is uncertain, but the reflection contains no uncertainty statements.",
    });
  }

  if (
    advisor.reasoning.graph.nodes
      .length === 0 &&
    advisor.reflection
      .additionalEvidenceNeeded
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.reflection.missing-evidence-needs",

      severity:
        "warning",

      message:
        "Advisor has no reasoning evidence but does not identify what additional evidence is needed.",
    });
  }
}

function validateSimulationAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  if (
    advisor.judgment.situation ===
      "uncertain" &&
    advisor.simulation.expectedCase
      .trajectory !== "uncertain"
  ) {
    issues.push({
      code:
        "advisor.simulation.overconfident-trajectory",

      severity:
        "warning",

      message:
        "Advisor judgment is uncertain, but the expected simulation trajectory is definitive.",
    });
  }

  if (
    advisor.simulation.scenarios
      .length < 3
  ) {
    issues.push({
      code:
        "advisor.simulation.incomplete",

      severity:
        "warning",

      message:
        "Advisor simulation does not contain a complete best, expected, and risk scenario set.",
    });
  }
}

function validateWisdomAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  const knownEvidenceIds =
    new Set(
      advisor.evidence.map(
        (evidence) =>
          evidence.id,
      ),
    );

  for (
    const insight
    of advisor.wisdom.insights
  ) {
    for (
      const evidenceId
      of insight.evidenceIds
    ) {
      if (
        !knownEvidenceIds.has(
          evidenceId,
        )
      ) {
        issues.push({
          code:
            "advisor.wisdom.unknown-evidence",

          severity:
            "error",

          message:
            `Wisdom insight "${insight.id}" references unknown evidence "${evidenceId}".`,
        });
      }
    }
  }

  if (
    advisor.reasoning.graph.nodes
      .length === 0 &&
    advisor.wisdom.insights.length >
      0
  ) {
    issues.push({
      code:
        "advisor.wisdom.without-evidence",

      severity:
        "error",

      message:
        "Advisor produced wisdom insights without reasoning evidence.",
    });
  }
}

function validateEpistemologyAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  const {
    epistemology,
  } = advisor;

  if (
    epistemology.beliefStrength ===
      "stable" &&
    advisor.judgment.situation ===
      "uncertain"
  ) {
    issues.push({
      code:
        "advisor.epistemology.stable-uncertain-judgment",

      severity:
        "warning",

      message:
        "Epistemology describes the belief as stable while the executive judgment remains uncertain.",
    });
  }

  if (
    epistemology.evidenceQuality ===
      "strong" &&
    advisor.evidence.length === 0
  ) {
    issues.push({
      code:
        "advisor.epistemology.strong-without-evidence",

      severity:
        "error",

      message:
        "Epistemology reports strong evidence quality, but the Advisor contains no evidence.",
    });
  }

  if (
    epistemology.evidenceQuality ===
      "weak" &&
    epistemology.missingEvidence
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.epistemology.weak-without-missing-evidence",

      severity:
        "warning",

      message:
        "Epistemology reports weak evidence quality without identifying what evidence is missing.",
    });
  }

  if (
    advisor.reasoning.evaluation
      .contradictions.length > 0 &&
    epistemology.uncertainties
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.epistemology.missing-contradiction-uncertainty",

      severity:
        "warning",

      message:
        "Reasoning contains contradictions, but Epistemology identifies no uncertainty.",
    });
  }

  if (
    advisor.reasoning.graph.nodes
      .length === 0 &&
    epistemology.beliefStrength !==
      "tentative"
  ) {
    issues.push({
      code:
        "advisor.epistemology.confident-without-reasoning",

      severity:
        "error",

      message:
        "Epistemology formed a developing or stable belief without reasoning evidence.",
    });
  }

  if (
    epistemology.couldChangeMyMind
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.epistemology.missing-revision-conditions",

      severity:
        "warning",

      message:
        "Epistemology does not identify any conditions that would revise the current belief.",
    });
  }
}

function validateCalibrationAlignment(
  advisor: AdvisorResult,
  issues: ValidationIssue[],
): void {
  const {
    calibration,
  } = advisor;

  if (
    calibration.confidence.calibration ===
      "well-calibrated" &&
    calibration.predictions.length === 0
  ) {
    issues.push({
      code:
        "advisor.calibration.status-without-predictions",

      severity:
        "warning",

      message:
        "Calibration is marked well calibrated even though no predictions have been tracked yet.",
    });
  }

  if (
    calibration.reliability
      .evidenceReliability ===
      "high" &&
    advisor.evidence.length === 0
  ) {
    issues.push({
      code:
        "advisor.calibration.high-reliability-without-evidence",

      severity:
        "error",

      message:
        "Calibration reports high evidence reliability, but the Advisor contains no evidence.",
    });
  }

  if (
    calibration.confidence
      .overconfidenceBias > 0 &&
    advisor.epistemology
      .beliefStrength === "stable"
  ) {
    issues.push({
      code:
        "advisor.calibration.stable-belief-overconfidence",

      severity:
        "warning",

      message:
        "Forge considers the belief stable while Calibration indicates overconfidence.",
    });
  }

  if (
    calibration.reliability
      .evidenceReliability === "low" &&
    advisor.epistemology
      .evidenceQuality === "strong"
  ) {
    issues.push({
      code:
        "advisor.calibration.epistemology-reliability-conflict",

      severity:
        "warning",

      message:
        "Epistemology reports strong evidence quality while Calibration reports low evidence reliability.",
    });
  }

  if (
    calibration.reliability
      .revisionRate > 0.5 &&
    advisor.cognitiveMemory.revisions
      .length === 0
  ) {
    issues.push({
      code:
        "advisor.calibration.revision-rate-without-revisions",

      severity:
        "warning",

      message:
        "Calibration reports a high revision rate, but Cognitive Memory contains no recorded revisions.",
    });
  }
}

function deduplicateIssues(
  issues: ValidationIssue[],
): ValidationIssue[] {
  const seen =
    new Set<string>();

  return issues.filter(
    (issue) => {
      const key =
        `${issue.code}:${issue.message}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}