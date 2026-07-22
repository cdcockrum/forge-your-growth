import type {
  AdvisorBriefing,
  AdvisorInput,
  AdvisorPriority,
} from "./advisor.types";

export function buildAdvisorBriefing(
  input: AdvisorInput,
): AdvisorBriefing {
  const priority = selectPriority(input);

  return {
    title: buildTitle(input, priority),
    message: buildMessage(input, priority),
    priority,
    confidence: calculateAdvisorConfidence(input),
    actions: buildActions(input, priority).slice(0, 3),
    reasoning: buildReasoning(input, priority).slice(0, 3),
  };
}

function selectPriority(
  input: AdvisorInput,
): AdvisorPriority {
  if (input.momentum.burnoutRisk === "high") {
    return "recovery";
  }

  if (input.progress.completionRate < 50) {
    return "consistency";
  }

  if (
    input.progress.neglectedSkill &&
    input.progress.neglectedSkill.daysSincePracticed !== null &&
    input.progress.neglectedSkill.daysSincePracticed >= 7
  ) {
    return "focus";
  }

  if (input.identity.strongestIdentity) {
    return "identity";
  }

  if (input.vision?.north_star?.trim()) {
    return "vision";
  }

  return "focus";
}

function buildTitle(
  input: AdvisorInput,
  priority: AdvisorPriority,
): string {
  switch (priority) {
    case "recovery":
      return "Protect recovery before increasing effort.";

    case "consistency":
      return "Make the plan easier to keep.";

    case "focus":
      return input.progress.neglectedSkill
        ? `Return to ${input.progress.neglectedSkill.name}.`
        : "Choose the one practice that matters most.";

    case "identity": {
      const identityName =
        input.identity.strongestIdentity?.identity.name;

      return identityName
        ? `Keep strengthening your ${identityName} identity.`
        : "Let your actions reinforce who you are becoming.";
    }

    case "vision":
      return "Let your North Star decide what matters.";

    default:
      return "Choose the next deliberate action.";
  }
}

function buildMessage(
  input: AdvisorInput,
  priority: AdvisorPriority,
): string {
  switch (priority) {
    case "recovery":
      return "Your direction remains sound, but your present rhythm may be demanding more energy than it restores. Reduce the load before adding more commitments.";

    case "consistency":
      return `You completed ${input.progress.completionRate}% of your planned practices. The most useful adjustment is not greater intensity, but a smaller plan you can reliably complete.`;

    case "focus":
      if (
        input.progress.neglectedSkill &&
        input.progress.neglectedSkill.daysSincePracticed !== null
      ) {
        return `${input.progress.neglectedSkill.name} has been outside your active rhythm for ${input.progress.neglectedSkill.daysSincePracticed} days. One manageable session is enough to bring it back into view.`;
      }

      return input.insight.recommendation;

    case "identity": {
      const strongest =
        input.identity.strongestIdentity;

      if (strongest) {
        return `Your recent actions most strongly support your ${strongest.identity.name} identity. Protect the practices providing that evidence rather than expanding the plan too quickly.`;
      }

      return input.narrative.opening;
    }

    case "vision": {
      const northStar =
        input.vision?.north_star?.trim();

      return northStar
        ? `Use “${northStar}” as the filter for today. Keep the commitments that support it and release the ones that do not.`
        : input.insight.summary;
    }

    default:
      return input.insight.summary;
  }
}

function buildActions(
  input: AdvisorInput,
  priority: AdvisorPriority,
): string[] {
  const actions: string[] = [];

  switch (priority) {
    case "recovery":
      actions.push(
        "Shorten or remove one demanding session.",
        "Protect one block of genuine recovery.",
        "Keep only the most meaningful practice today.",
      );
      break;

    case "consistency":
      actions.push(
        "Reduce next week’s total commitments.",
        "Complete one small session today.",
      );

      if (input.progress.strongestSkill) {
        actions.push(
          `Protect ${input.progress.strongestSkill.name} as the anchor practice.`,
        );
      }
      break;

    case "focus":
      if (input.progress.neglectedSkill) {
        actions.push(
          `Schedule one ${input.progress.neglectedSkill.name} session.`,
        );
      }

      actions.push(
        "Choose one priority before adding anything else.",
        "Remove one low-value commitment.",
      );
      break;

    case "identity": {
      const identityName =
        input.identity.strongestIdentity?.identity.name;

      if (identityName) {
        actions.push(
          `Complete one practice that supports your ${identityName} identity.`,
        );
      }

      if (input.progress.strongestSkill) {
        actions.push(
          `Protect your rhythm around ${input.progress.strongestSkill.name}.`,
        );
      }

      actions.push(
        "Record a short reflection after practice.",
      );
      break;
    }

    case "vision":
      actions.push(
        "Review your North Star before planning.",
        "Keep one commitment that directly supports it.",
        "Remove one commitment that does not.",
      );
      break;
  }

  return unique(actions);
}

function buildReasoning(
  input: AdvisorInput,
  priority: AdvisorPriority,
): string[] {
  const reasoning: string[] = [];

  reasoning.push(
    `Weekly completion is ${input.progress.completionRate}%.`,
  );

  reasoning.push(
    `Momentum is ${input.momentum.score} with ${input.momentum.burnoutRisk} burnout risk.`,
  );

  if (input.memory.strongest[0]) {
    reasoning.push(
      `Forge remembers: ${input.memory.strongest[0].statement}`,
    );
  }

  if (
    priority === "identity" &&
    input.identity.strongestIdentity
  ) {
    reasoning.push(
      `${input.identity.strongestIdentity.identity.name} currently has the strongest identity evidence.`,
    );
  }

  return unique(reasoning);
}

function calculateAdvisorConfidence(
  input: AdvisorInput,
): number {
  const evidence = [
    input.progress.totalSessions > 0,
    input.progress.completedSessions > 0,
    input.memory.memories.length > 0,
    input.history.events.length > 0,
    Boolean(input.identity.strongestIdentity),
    Boolean(input.vision),
  ].filter(Boolean).length;

  return Math.min(
    100,
    Math.round(
      input.insight.confidence * 0.65 +
        evidence * 6,
    ),
  );
}

function unique(
  values: string[],
): string[] {
  return [...new Set(values)];
}