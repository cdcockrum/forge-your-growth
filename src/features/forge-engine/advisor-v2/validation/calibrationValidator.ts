import type {
  CalibrationResult,
} from "../calibration";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

const VALID_CALIBRATIONS =
  new Set<
    CalibrationResult[
      "confidence"
    ]["calibration"]
    >([
      "insufficient-evidence",
      "underconfident",
      "well-calibrated",
      "overconfident",
    ]);

const VALID_RELIABILITY_LEVELS =
  new Set<
    CalibrationResult[
      "reliability"
    ]["evidenceReliability"]
  >([
    "low",
    "medium",
    "high",
  ]);

export function validateCalibration(
  calibration: CalibrationResult,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validatePredictions(
    calibration,
    issues,
  );

  validateConfidenceMetrics(
    calibration,
    issues,
  );

  validateReliabilityMetrics(
    calibration,
    issues,
  );

  validateRecommendation(
    calibration,
    issues,
  );

  validateLogicalConsistency(
    calibration,
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

function validatePredictions(
  calibration: CalibrationResult,
  issues: ValidationIssue[],
): void {
  const ids =
    new Set<string>();

  for (
    const prediction
    of calibration.predictions
  ) {
    if (!prediction.id.trim()) {
      issues.push({
        code:
          "calibration.prediction.missing-id",

        severity:
          "error",

        message:
          "A calibration prediction is missing an identifier.",
      });
    }

    if (ids.has(prediction.id)) {
      issues.push({
        code:
          "calibration.prediction.duplicate-id",

        severity:
          "error",

        message:
          `Prediction ID "${prediction.id}" appears more than once.`,
      });
    }

    ids.add(
      prediction.id,
    );

    if (
      !prediction.prediction.trim()
    ) {
      issues.push({
        code:
          "calibration.prediction.missing-description",

        severity:
          "error",

        message:
          `Prediction "${prediction.id}" is missing its description.`,
      });
    }

    validateScore(
      prediction.confidence,
      "calibration.prediction.invalid-confidence",
      `Prediction "${prediction.id}" has confidence outside the 0–1 range.`,
      issues,
    );

    if (
      prediction.outcome ===
        "unknown" &&
      prediction.resolvedAt !== null
    ) {
      issues.push({
        code:
          "calibration.prediction.unresolved-with-date",

        severity:
          "warning",

        message:
          `Prediction "${prediction.id}" is unresolved but has a resolution date.`,
      });
    }

    if (
      prediction.outcome !==
        "unknown" &&
      prediction.resolvedAt === null
    ) {
      issues.push({
        code:
          "calibration.prediction.resolved-without-date",

        severity:
          "warning",

        message:
          `Prediction "${prediction.id}" has an outcome but no resolution date.`,
      });
    }
  }
}

function validateConfidenceMetrics(
  calibration: CalibrationResult,
  issues: ValidationIssue[],
): void {
  const {
    confidence,
  } = calibration;

  validateScore(
    confidence.averageConfidence,
    "calibration.confidence.invalid-average-confidence",
    "Average confidence is outside the 0–1 range.",
    issues,
  );

  validateScore(
    confidence.averageAccuracy,
    "calibration.confidence.invalid-average-accuracy",
    "Average accuracy is outside the 0–1 range.",
    issues,
  );

  validateScore(
    confidence.overconfidenceBias,
    "calibration.confidence.invalid-overconfidence-bias",
    "Overconfidence bias is outside the 0–1 range.",
    issues,
  );

  validateScore(
    confidence.underconfidenceBias,
    "calibration.confidence.invalid-underconfidence-bias",
    "Underconfidence bias is outside the 0–1 range.",
    issues,
  );

  if (
    !VALID_CALIBRATIONS.has(
      confidence.calibration,
    )
  ) {
    issues.push({
      code:
        "calibration.confidence.invalid-classification",

      severity:
        "error",

      message:
        `Unsupported confidence calibration: "${confidence.calibration}".`,
    });
  }

  if (
    confidence.overconfidenceBias > 0 &&
    confidence.underconfidenceBias > 0
  ) {
    issues.push({
      code:
        "calibration.confidence.conflicting-biases",

      severity:
        "error",

      message:
        "Calibration cannot be both overconfident and underconfident at the same time.",
    });
  }
}

function validateReliabilityMetrics(
  calibration: CalibrationResult,
  issues: ValidationIssue[],
): void {
  const {
    reliability,
  } = calibration;

  if (
    !VALID_RELIABILITY_LEVELS.has(
      reliability.evidenceReliability,
    )
  ) {
    issues.push({
      code:
        "calibration.reliability.invalid-classification",

      severity:
        "error",

      message:
        `Unsupported evidence reliability: "${reliability.evidenceReliability}".`,
    });
  }

  validateScore(
    reliability.contradictionRate,
    "calibration.reliability.invalid-contradiction-rate",
    "Contradiction rate is outside the 0–1 range.",
    issues,
  );

  validateScore(
    reliability.revisionRate,
    "calibration.reliability.invalid-revision-rate",
    "Revision rate is outside the 0–1 range.",
    issues,
  );

  validateScore(
    reliability.evidenceCoverage,
    "calibration.reliability.invalid-evidence-coverage",
    "Evidence coverage is outside the 0–1 range.",
    issues,
  );
}

function validateRecommendation(
  calibration: CalibrationResult,
  issues: ValidationIssue[],
): void {
  if (
    !calibration.recommendation
      .trim()
  ) {
    issues.push({
      code:
        "calibration.missing-recommendation",

      severity:
        "error",

      message:
        "Calibration is missing its recommendation.",
    });
  }
}

function validateLogicalConsistency(
  calibration: CalibrationResult,
  issues: ValidationIssue[],
): void {
  const {
    confidence,
    reliability,
    predictions,
  } = calibration;

  const resolvedCount =
    predictions.filter(
      (prediction) =>
        prediction.outcome !==
        "unknown",
    ).length;

  if (
    resolvedCount === 0 &&
    (
      confidence.averageAccuracy !== 0 ||
      confidence.averageConfidence !== 0
    )
  ) {
    issues.push({
      code:
        "calibration.metrics-without-resolved-predictions",

      severity:
        "warning",

      message:
        "Calibration reports confidence or accuracy metrics without resolved predictions.",
    });
  }

  if (
    confidence.calibration ===
      "well-calibrated" &&
    Math.abs(
      confidence.averageConfidence -
      confidence.averageAccuracy,
    ) > 0.1
  ) {
    issues.push({
      code:
        "calibration.inconsistent-well-calibrated-status",

      severity:
        "warning",

      message:
        "Calibration is marked well calibrated despite a substantial confidence-accuracy gap.",
    });
  }

  if (
    reliability.evidenceReliability ===
      "high" &&
    reliability.evidenceCoverage <
      0.5
  ) {
    issues.push({
      code:
        "calibration.high-reliability-low-coverage",

      severity:
        "warning",

      message:
        "Evidence reliability is high despite limited evidence coverage.",
    });
  }
}

function validateScore(
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