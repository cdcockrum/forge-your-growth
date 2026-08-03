import type {
  EpistemologyResult,
} from "../epistemology";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

const VALID_BELIEF_STRENGTHS =
  new Set<
    EpistemologyResult["beliefStrength"]
  >([
    "tentative",
    "developing",
    "stable",
  ]);

const VALID_EVIDENCE_QUALITIES =
  new Set<
    EpistemologyResult["evidenceQuality"]
  >([
    "weak",
    "moderate",
    "strong",
  ]);

export function validateEpistemology(
  epistemology: EpistemologyResult,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateCoreFields(
    epistemology,
    issues,
  );

  validateClassifications(
    epistemology,
    issues,
  );

  validateCollection(
    epistemology.assumptions,
    "assumptions",
    issues,
  );

  validateCollection(
    epistemology.uncertainties,
    "uncertainties",
    issues,
  );

  validateCollection(
    epistemology.missingEvidence,
    "missing-evidence",
    issues,
  );

  validateCollection(
    epistemology.couldChangeMyMind,
    "could-change-my-mind",
    issues,
  );

  validateLogicalConsistency(
    epistemology,
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

function validateCoreFields(
  epistemology: EpistemologyResult,
  issues: ValidationIssue[],
): void {
  if (
    !epistemology.strongestBelief
      .trim()
  ) {
    issues.push({
      code:
        "epistemology.missing-strongest-belief",

      severity:
        "error",

      message:
        "Epistemology is missing its strongest belief.",
    });
  }

  if (
    !epistemology
      .confidenceNarrative
      .trim()
  ) {
    issues.push({
      code:
        "epistemology.missing-confidence-narrative",

      severity:
        "error",

      message:
        "Epistemology is missing its confidence narrative.",
    });
  }
}

function validateClassifications(
  epistemology: EpistemologyResult,
  issues: ValidationIssue[],
): void {
  if (
    !VALID_BELIEF_STRENGTHS.has(
      epistemology.beliefStrength,
    )
  ) {
    issues.push({
      code:
        "epistemology.invalid-belief-strength",

      severity:
        "error",

      message:
        `Unsupported belief strength: "${epistemology.beliefStrength}".`,
    });
  }

  if (
    !VALID_EVIDENCE_QUALITIES.has(
      epistemology.evidenceQuality,
    )
  ) {
    issues.push({
      code:
        "epistemology.invalid-evidence-quality",

      severity:
        "error",

      message:
        `Unsupported evidence quality: "${epistemology.evidenceQuality}".`,
    });
  }
}

function validateCollection(
  values: string[],
  name: string,
  issues: ValidationIssue[],
): void {
  const trimmed =
    values.map(
      (value) =>
        value.trim(),
    );

  if (
    trimmed.some(
      (value) =>
        value.length === 0,
    )
  ) {
    issues.push({
      code:
        `epistemology.${name}.empty-value`,

      severity:
        "warning",

      message:
        `Epistemology ${formatName(
          name,
        )} contains an empty statement.`,
    });
  }

  const populated =
    trimmed.filter(Boolean);

  if (
    new Set(
      populated,
    ).size !==
    populated.length
  ) {
    issues.push({
      code:
        `epistemology.${name}.duplicate-value`,

      severity:
        "warning",

      message:
        `Epistemology ${formatName(
          name,
        )} contains duplicate statements.`,
    });
  }
}

function validateLogicalConsistency(
  epistemology: EpistemologyResult,
  issues: ValidationIssue[],
): void {
  if (
    epistemology.beliefStrength ===
      "stable" &&
    epistemology.evidenceQuality ===
      "weak"
  ) {
    issues.push({
      code:
        "epistemology.stable-belief-weak-evidence",

      severity:
        "warning",

      message:
        "A stable belief is supported by weak evidence.",
    });
  }

  if (
    epistemology.beliefStrength ===
      "stable" &&
    epistemology.uncertainties.length >
      2
  ) {
    issues.push({
      code:
        "epistemology.stable-belief-high-uncertainty",

      severity:
        "warning",

      message:
        "A stable belief still has several unresolved uncertainties.",
    });
  }

  if (
    epistemology.evidenceQuality ===
      "weak" &&
    epistemology.missingEvidence.length ===
      0
  ) {
    issues.push({
      code:
        "epistemology.weak-evidence-without-needs",

      severity:
        "warning",

      message:
        "Evidence quality is weak, but no missing evidence is identified.",
    });
  }

  if (
    epistemology.couldChangeMyMind
      .length === 0
  ) {
    issues.push({
      code:
        "epistemology.no-revision-conditions",

      severity:
        "warning",

      message:
        "Epistemology does not explain what evidence would change the current belief.",
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