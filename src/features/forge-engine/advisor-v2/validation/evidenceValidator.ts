import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

export function validateEvidence(
  evidence: AdvisorEvidence[],
): ValidationResult {
  const issues: ValidationIssue[] = [];

  const seenIds =
    new Set<string>();

  for (const item of evidence) {
    validateRequiredFields(
      item,
      issues,
    );

    validateScores(
      item,
      issues,
    );

    validateDuplicateId(
      item,
      seenIds,
      issues,
    );
  }

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

function validateRequiredFields(
  evidence: AdvisorEvidence,
  issues: ValidationIssue[],
): void {
  if (!evidence.id.trim()) {
    issues.push({
      code:
        "evidence.missing-id",

      severity:
        "error",

      message:
        "Evidence is missing a stable identifier.",
    });
  }

  if (!evidence.source.trim()) {
    issues.push({
      code:
        "evidence.missing-source",

      severity:
        "error",

      message:
        `Evidence ${displayId(
          evidence.id,
        )} is missing a source.`,
    });
  }

  if (!evidence.statement.trim()) {
    issues.push({
      code:
        "evidence.missing-statement",

      severity:
        "error",

      message:
        `Evidence ${displayId(
          evidence.id,
        )} is missing a readable statement.`,
    });
  }

  if (evidence.tags.length === 0) {
    issues.push({
      code:
        "evidence.missing-tags",

      severity:
        "warning",

      message:
        `Evidence ${displayId(
          evidence.id,
        )} has no searchable tags.`,
    });
  }
}

function validateScores(
  evidence: AdvisorEvidence,
  issues: ValidationIssue[],
): void {
  if (
    !isNormalizedScore(
      evidence.confidence,
    )
  ) {
    issues.push({
      code:
        "evidence.invalid-confidence",

      severity:
        "error",

      message:
        `Evidence ${displayId(
          evidence.id,
        )} has confidence outside the 0–1 range.`,
    });
  }

  if (
    !isNormalizedScore(
      evidence.impact,
    )
  ) {
    issues.push({
      code:
        "evidence.invalid-impact",

      severity:
        "error",

      message:
        `Evidence ${displayId(
          evidence.id,
        )} has impact outside the 0–1 range.`,
    });
  }
}

function validateDuplicateId(
  evidence: AdvisorEvidence,
  seenIds: Set<string>,
  issues: ValidationIssue[],
): void {
  const id =
    evidence.id.trim();

  if (!id) {
    return;
  }

  if (seenIds.has(id)) {
    issues.push({
      code:
        "evidence.duplicate-id",

      severity:
        "error",

      message:
        `Evidence ID "${id}" appears more than once.`,
    });

    return;
  }

  seenIds.add(id);
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

function displayId(
  id: string,
): string {
  return id.trim()
    ? `"${id.trim()}"`
    : "(unknown)";
}