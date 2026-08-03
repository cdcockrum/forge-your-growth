import type {
  ExecutiveJudgment,
  SituationAssessment,
} from "../executive-judgment";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

const VALID_SITUATIONS =
  new Set<SituationAssessment>([
    "building",
    "accelerating",
    "plateauing",
    "recovering",
    "uncertain",
  ]);

const VALID_URGENCIES =
  new Set<
    ExecutiveJudgment["urgency"]
  >([
    "low",
    "medium",
    "high",
  ]);

export function validateJudgment(
  judgment: ExecutiveJudgment,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateContent(
    judgment,
    issues,
  );

  validateClassification(
    judgment,
    issues,
  );

  validateConfidence(
    judgment,
    issues,
  );

  validateRationale(
    judgment,
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

function validateContent(
  judgment: ExecutiveJudgment,
  issues: ValidationIssue[],
): void {
  if (!judgment.headline.trim()) {
    issues.push({
      code:
        "judgment.missing-headline",

      severity:
        "error",

      message:
        "Executive judgment is missing a headline.",
    });
  }

  if (!judgment.summary.trim()) {
    issues.push({
      code:
        "judgment.missing-summary",

      severity:
        "error",

      message:
        "Executive judgment is missing a summary.",
    });
  }
}

function validateClassification(
  judgment: ExecutiveJudgment,
  issues: ValidationIssue[],
): void {
  if (
    !VALID_SITUATIONS.has(
      judgment.situation,
    )
  ) {
    issues.push({
      code:
        "judgment.invalid-situation",

      severity:
        "error",

      message:
        `Executive judgment has an unsupported situation: "${judgment.situation}".`,
    });
  }

  if (
    !VALID_URGENCIES.has(
      judgment.urgency,
    )
  ) {
    issues.push({
      code:
        "judgment.invalid-urgency",

      severity:
        "error",

      message:
        `Executive judgment has an unsupported urgency: "${judgment.urgency}".`,
    });
  }
}

function validateConfidence(
  judgment: ExecutiveJudgment,
  issues: ValidationIssue[],
): void {
  if (
    !isNormalizedScore(
      judgment.confidence,
    )
  ) {
    issues.push({
      code:
        "judgment.invalid-confidence",

      severity:
        "error",

      message:
        "Executive judgment confidence is outside the 0–1 range.",
    });
  }

  if (
    judgment.situation ===
      "uncertain" &&
    judgment.confidence > 0.75
  ) {
    issues.push({
      code:
        "judgment.uncertain-high-confidence",

      severity:
        "warning",

      message:
        "The judgment is classified as uncertain but has unusually high confidence.",
    });
  }
}

function validateRationale(
  judgment: ExecutiveJudgment,
  issues: ValidationIssue[],
): void {
  const normalizedRationale =
    judgment.rationale
      .map(
        (statement) =>
          statement.trim(),
      )
      .filter(Boolean);

  if (
    judgment.rationale.some(
      (statement) =>
        statement.trim().length === 0,
    )
  ) {
    issues.push({
      code:
        "judgment.empty-rationale",

      severity:
        "warning",

      message:
        "Executive judgment contains an empty rationale statement.",
    });
  }

  if (
    new Set(
      normalizedRationale,
    ).size !==
    normalizedRationale.length
  ) {
    issues.push({
      code:
        "judgment.duplicate-rationale",

      severity:
        "warning",

      message:
        "Executive judgment contains duplicate rationale statements.",
    });
  }

  if (
    judgment.situation !==
      "uncertain" &&
    normalizedRationale.length === 0
  ) {
    issues.push({
      code:
        "judgment.missing-rationale",

      severity:
        "warning",

      message:
        "A definitive executive judgment has no supporting rationale.",
    });
  }
}

function isNormalizedScore(
  value: number,
): boolean {
  return (
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}