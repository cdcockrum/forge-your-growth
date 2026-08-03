import type {
  Wisdom,
} from "../wisdom";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

export function validateWisdom(
  wisdom: Wisdom,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateNarrative(
    wisdom,
    issues,
  );

  validateInsights(
    wisdom,
    issues,
  );

  validateCollection(
    wisdom.longTermThemes,
    "long-term-themes",
    issues,
  );

  validateCollection(
    wisdom.emergingIdentity,
    "emerging-identity",
    issues,
  );

  validateCollection(
    wisdom.cautions,
    "cautions",
    issues,
  );

  validateCollection(
    wisdom.opportunities,
    "opportunities",
    issues,
  );

  validateConfidence(
    wisdom.confidence,
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

function validateNarrative(
  wisdom: Wisdom,
  issues: ValidationIssue[],
): void {
  if (
    !wisdom.narrative.trim()
  ) {
    issues.push({
      code:
        "wisdom.missing-narrative",

      severity:
        "error",

      message:
        "Wisdom is missing its narrative.",
    });
  }
}

function validateInsights(
  wisdom: Wisdom,
  issues: ValidationIssue[],
): void {
  const ids =
    new Set<string>();

  for (
    const insight
    of wisdom.insights
  ) {
    if (
      !insight.id.trim()
    ) {
      issues.push({
        code:
          "wisdom.insight.missing-id",

        severity:
          "error",

        message:
          "A wisdom insight is missing an identifier.",
      });
    }

    if (
      ids.has(
        insight.id,
      )
    ) {
      issues.push({
        code:
          "wisdom.insight.duplicate-id",

        severity:
          "error",

        message:
          `Duplicate wisdom insight "${insight.id}".`,
      });
    }

    ids.add(
      insight.id,
    );

    if (
      !insight.title.trim()
    ) {
      issues.push({
        code:
          "wisdom.insight.missing-title",

        severity:
          "error",

        message:
          `Insight "${insight.id}" is missing a title.`,
      });
    }

    if (
      !insight.explanation.trim()
    ) {
      issues.push({
        code:
          "wisdom.insight.missing-explanation",

        severity:
          "error",

        message:
          `Insight "${insight.id}" is missing an explanation.`,
      });
    }

    if (
      !isNormalized(
        insight.confidence,
      )
    ) {
      issues.push({
        code:
          "wisdom.insight.invalid-confidence",

        severity:
          "error",

        message:
          `Insight "${insight.id}" has confidence outside the 0–1 range.`,
      });
    }

    const evidenceIds =
      insight.evidenceIds.filter(
        Boolean,
      );

    if (
      evidenceIds.length === 0
    ) {
      issues.push({
        code:
          "wisdom.insight.no-evidence",

        severity:
          "warning",

        message:
          `Insight "${insight.id}" has no supporting evidence references.`,
      });
    }
  }
}

function validateCollection(
  values: string[],
  name: string,
  issues: ValidationIssue[],
): void {
  const cleaned =
    values
      .map(
        (value) =>
          value.trim(),
      )
      .filter(Boolean);

  if (
    new Set(
      cleaned,
    ).size !==
    cleaned.length
  ) {
    issues.push({
      code:
        `wisdom.${name}.duplicates`,

      severity:
        "warning",

      message:
        `${formatName(
          name,
        )} contains duplicate entries.`,
    });
  }
}

function validateConfidence(
  confidence: number,
  issues: ValidationIssue[],
): void {
  if (
    !isNormalized(
      confidence,
    )
  ) {
    issues.push({
      code:
        "wisdom.invalid-confidence",

      severity:
        "error",

      message:
        "Wisdom confidence is outside the 0–1 range.",
    });
  }
}

function isNormalized(
  value: number,
): boolean {
  return (
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

function formatName(
  value: string,
): string {
  return value.replaceAll(
    "-",
    " ",
  );
}