import type {
  Reflection,
} from "../reflection";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

export function validateReflection(
  reflection: Reflection,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateConfidenceStatement(
    reflection,
    issues,
  );

  validateCollection(
    reflection.assumptions,
    "assumptions",
    issues,
  );

  validateCollection(
    reflection.uncertainties,
    "uncertainties",
    issues,
  );

  validateCollection(
    reflection.alternativeInterpretations,
    "alternative-interpretations",
    issues,
  );

  validateCollection(
    reflection.additionalEvidenceNeeded,
    "additional-evidence-needed",
    issues,
  );

  validateLogicalConsistency(
    reflection,
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

function validateConfidenceStatement(
  reflection: Reflection,
  issues: ValidationIssue[],
): void {
  if (
    !reflection.confidenceStatement
      .trim()
  ) {
    issues.push({
      code:
        "reflection.missing-confidence-statement",

      severity:
        "error",

      message:
        "Reflection is missing its confidence statement.",
    });
  }
}

function validateCollection(
  values: string[],
  collectionName: string,
  issues: ValidationIssue[],
): void {
  const trimmedValues =
    values.map(
      (value) =>
        value.trim(),
    );

  if (
    trimmedValues.some(
      (value) =>
        value.length === 0,
    )
  ) {
    issues.push({
      code:
        `reflection.${collectionName}.empty-value`,

      severity:
        "warning",

      message:
        `Reflection ${formatName(
          collectionName,
        )} contains an empty statement.`,
    });
  }

  const populatedValues =
    trimmedValues.filter(
      (value) =>
        value.length > 0,
    );

  if (
    new Set(
      populatedValues,
    ).size !==
    populatedValues.length
  ) {
    issues.push({
      code:
        `reflection.${collectionName}.duplicate-value`,

      severity:
        "warning",

      message:
        `Reflection ${formatName(
          collectionName,
        )} contains duplicate statements.`,
    });
  }
}

function validateLogicalConsistency(
  reflection: Reflection,
  issues: ValidationIssue[],
): void {
  const confidenceStatement =
    reflection.confidenceStatement
      .toLowerCase();

  const indicatesInsufficientEvidence =
    confidenceStatement.includes(
      "not enough evidence",
    ) ||
    confidenceStatement.includes(
      "insufficient evidence",
    ) ||
    confidenceStatement.includes(
      "does not yet have enough",
    );

  if (
    indicatesInsufficientEvidence &&
    reflection
      .additionalEvidenceNeeded
      .length === 0
  ) {
    issues.push({
      code:
        "reflection.insufficient-evidence-without-needs",

      severity:
        "warning",

      message:
        "Reflection reports insufficient evidence but does not explain what additional evidence is needed.",
    });
  }

  if (
    reflection.uncertainties.length ===
      0 &&
    reflection
      .alternativeInterpretations
      .length > 0
  ) {
    issues.push({
      code:
        "reflection.alternatives-without-uncertainty",

      severity:
        "warning",

      message:
        "Reflection contains alternative interpretations without identifying any uncertainty.",
    });
  }

  if (
    reflection.assumptions.length ===
      0 &&
    reflection.uncertainties.length ===
      0 &&
    reflection
      .alternativeInterpretations
      .length === 0 &&
    reflection
      .additionalEvidenceNeeded
      .length === 0
  ) {
    issues.push({
      code:
        "reflection.empty",

      severity:
        "warning",

      message:
        "Reflection contains no structured self-review.",
    });
  }
}

function formatName(
  value: string,
): string {
  return value.replaceAll(
    "-",
    " ",
  );
}