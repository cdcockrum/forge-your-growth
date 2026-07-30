import type {
  Observation,
} from "./observation.types";

export interface ValidationResult {
  valid: boolean;

  issues: string[];
}

const prohibitedTerms = [
  "always",
  "never",
  "lazy",
  "failure",
  "undisciplined",
] as const;

export function validateObservation(
  observation: Observation,
): ValidationResult {
  const issues: string[] = [];

  if (observation.evidence.length === 0) {
    issues.push(
      "An observation must contain supporting evidence.",
    );
  }

  if (
    observation.confidence < 0 ||
    observation.confidence > 1
  ) {
    issues.push(
      "Observation confidence must be between 0 and 1.",
    );
  }

  if (
    observation.importance < 0 ||
    observation.importance > 1
  ) {
    issues.push(
      "Observation importance must be between 0 and 1.",
    );
  }

  if (
    observation.confidence > 0.6 &&
    observation.recommendations.length === 0
  ) {
    issues.push(
      "A high-confidence observation should include at least one constructive recommendation.",
    );
  }

  const textToCheck = [
    observation.interpretation,
    ...observation.implications,
    ...observation.recommendations,
  ]
    .join(" ")
    .toLowerCase();

  for (const term of prohibitedTerms) {
    if (
      textToCheck.includes(
        term,
      )
    ) {
      issues.push(
        `Observation contains prohibited language: "${term}".`,
      );
    }
  }

  return {
    valid:
      issues.length === 0,

    issues,
  };
}