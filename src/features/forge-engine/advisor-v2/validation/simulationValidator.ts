import type {
  Scenario,
  Simulation,
  Trajectory,
} from "../simulation";

import type {
  ValidationIssue,
  ValidationResult,
} from "./validation.types";

const VALID_TRAJECTORIES =
  new Set<Trajectory>([
    "accelerating",
    "steady",
    "plateau",
    "declining",
    "uncertain",
  ]);

export function validateSimulation(
  simulation: Simulation,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateScenarioCollection(
    simulation,
    issues,
  );

  validateScenario(
    simulation.bestCase,
    "best-case",
    issues,
  );

  validateScenario(
    simulation.expectedCase,
    "expected-case",
    issues,
  );

  validateScenario(
    simulation.worstCase,
    "worst-case",
    issues,
  );

  validateScenarioReferences(
    simulation,
    issues,
  );

  validateScenarioOrdering(
    simulation,
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

function validateScenarioCollection(
  simulation: Simulation,
  issues: ValidationIssue[],
): void {
  if (
    simulation.scenarios.length === 0
  ) {
    issues.push({
      code:
        "simulation.missing-scenarios",

      severity:
        "error",

      message:
        "Simulation contains no scenarios.",
    });

    return;
  }

  if (
    simulation.scenarios.length < 3
  ) {
    issues.push({
      code:
        "simulation.incomplete-scenario-set",

      severity:
        "warning",

      message:
        "Simulation contains fewer than three scenarios.",
    });
  }

  const ids =
    simulation.scenarios
      .map(
        (scenario) =>
          scenario.id.trim(),
      )
      .filter(Boolean);

  if (
    new Set(
      ids,
    ).size !==
    ids.length
  ) {
    issues.push({
      code:
        "simulation.duplicate-scenario-id",

      severity:
        "error",

      message:
        "Simulation contains duplicate scenario identifiers.",
    });
  }
}

function validateScenario(
  scenario: Scenario,
  role: string,
  issues: ValidationIssue[],
): void {
  if (!scenario.id.trim()) {
    issues.push({
      code:
        `simulation.${role}.missing-id`,

      severity:
        "error",

      message:
        `${formatRole(
          role,
        )} is missing an identifier.`,
    });
  }

  if (!scenario.title.trim()) {
    issues.push({
      code:
        `simulation.${role}.missing-title`,

      severity:
        "error",

      message:
        `${formatRole(
          role,
        )} is missing a title.`,
    });
  }

  if (
    !scenario.description.trim()
  ) {
    issues.push({
      code:
        `simulation.${role}.missing-description`,

      severity:
        "error",

      message:
        `${formatRole(
          role,
        )} is missing a description.`,
    });
  }

  validateNormalizedScore(
    scenario.probability,
    `simulation.${role}.invalid-probability`,
    `${formatRole(
      role,
    )} probability is outside the 0–1 range.`,
    issues,
  );

  validateNormalizedScore(
    scenario.projectedConfidence,
    `simulation.${role}.invalid-confidence`,
    `${formatRole(
      role,
    )} projected confidence is outside the 0–1 range.`,
    issues,
  );

  if (
    !VALID_TRAJECTORIES.has(
      scenario.trajectory,
    )
  ) {
    issues.push({
      code:
        `simulation.${role}.invalid-trajectory`,

      severity:
        "error",

      message:
        `${formatRole(
          role,
        )} has an unsupported trajectory.`,
    });
  }

  validateRecommendations(
    scenario,
    role,
    issues,
  );
}

function validateRecommendations(
  scenario: Scenario,
  role: string,
  issues: ValidationIssue[],
): void {
  const recommendations =
    scenario.recommendations
      .map(
        (recommendation) =>
          recommendation.trim(),
      );

  if (
    recommendations.some(
      (recommendation) =>
        recommendation.length === 0,
    )
  ) {
    issues.push({
      code:
        `simulation.${role}.empty-recommendation`,

      severity:
        "warning",

      message:
        `${formatRole(
          role,
        )} contains an empty recommendation.`,
    });
  }

  const populated =
    recommendations.filter(Boolean);

  if (
    new Set(
      populated,
    ).size !==
    populated.length
  ) {
    issues.push({
      code:
        `simulation.${role}.duplicate-recommendation`,

      severity:
        "warning",

      message:
        `${formatRole(
          role,
        )} contains duplicate recommendations.`,
    });
  }

  if (
    populated.length === 0
  ) {
    issues.push({
      code:
        `simulation.${role}.missing-recommendation`,

      severity:
        "warning",

      message:
        `${formatRole(
          role,
        )} does not provide a supporting action.`,
    });
  }
}

function validateScenarioReferences(
  simulation: Simulation,
  issues: ValidationIssue[],
): void {
  const scenarioIds =
    new Set(
      simulation.scenarios.map(
        (scenario) =>
          scenario.id,
      ),
    );

  const references = [
    {
      role:
        "best-case",

      scenario:
        simulation.bestCase,
    },
    {
      role:
        "expected-case",

      scenario:
        simulation.expectedCase,
    },
    {
      role:
        "worst-case",

      scenario:
        simulation.worstCase,
    },
  ];

  for (
    const reference
    of references
  ) {
    if (
      !scenarioIds.has(
        reference.scenario.id,
      )
    ) {
      issues.push({
        code:
          `simulation.${reference.role}.not-in-scenarios`,

        severity:
          "error",

        message:
          `${formatRole(
            reference.role,
          )} is not present in the main scenario collection.`,
      });
    }
  }
}

function validateScenarioOrdering(
  simulation: Simulation,
  issues: ValidationIssue[],
): void {
  if (
    simulation.bestCase.probability <
    simulation.expectedCase.probability
  ) {
    issues.push({
      code:
        "simulation.best-case.lower-probability",

      severity:
        "warning",

      message:
        "Best-case likelihood is lower than expected-case likelihood.",
    });
  }

  if (
    simulation.worstCase.probability >
    simulation.expectedCase.probability
  ) {
    issues.push({
      code:
        "simulation.worst-case.higher-probability",

      severity:
        "warning",

      message:
        "Risk-case likelihood is higher than expected-case likelihood.",
    });
  }

  if (
    simulation.bestCase.id ===
      simulation.expectedCase.id ||
    simulation.bestCase.id ===
      simulation.worstCase.id ||
    simulation.expectedCase.id ===
      simulation.worstCase.id
  ) {
    issues.push({
      code:
        "simulation.duplicate-primary-scenarios",

      severity:
        "error",

      message:
        "Best, expected, and risk scenarios must reference different scenarios.",
    });
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

function formatRole(
  role: string,
): string {
  const formatted =
    role.replaceAll(
      "-",
      " ",
    );

  return (
    formatted.charAt(0).toUpperCase() +
    formatted.slice(1)
  );
}