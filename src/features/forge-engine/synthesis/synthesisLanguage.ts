import type {
  SynthesisInput,
} from "./synthesis.types";

export type SynthesisLanguage = {
  headline: string;
  summaryLead: string;
};

export function buildSynthesisLanguage(
  input: SynthesisInput,
): SynthesisLanguage {
  const identityName =
    input.identity.strongestIdentity
      ?.identity.name;

  if (
    input.momentum.burnoutRisk === "high"
  ) {
    return {
      headline:
        "The fire needs room to breathe.",
      summaryLead:
        "Your effort is real, but the present rhythm may be asking for more recovery than it allows.",
    };
  }

  if (
    input.progress.completionRate >= 80 &&
    input.momentum.score >= 80 &&
    identityName
  ) {
    return {
      headline:
        "The forge is glowing.",
      summaryLead: `Your recent actions are reinforcing your ${identityName} identity with unusual consistency.`,
    };
  }

  if (
    input.progress.completionRate >= 80
  ) {
    return {
      headline:
        "The rhythm is holding.",
      summaryLead:
        "You are following through on the commitments you made to yourself.",
    };
  }

  if (
    input.progress.completionRate >= 50
  ) {
    return {
      headline:
        "The shape is beginning to emerge.",
      summaryLead:
        "Your week contains meaningful progress, though a few adjustments could make the rhythm more dependable.",
    };
  }

  if (
    input.progress.completedSessions > 0
  ) {
    return {
      headline:
        "The fire is still alive.",
      summaryLead:
        "You have taken deliberate action, even if the larger rhythm has not settled yet.",
    };
  }

  return {
    headline:
      "Return to the anvil.",
    summaryLead:
      "There is not enough completed practice yet to form a strong pattern, but one deliberate session can restart the rhythm.",
  };
}