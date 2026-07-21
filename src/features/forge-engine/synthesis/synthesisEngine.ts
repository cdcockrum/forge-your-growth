import type {
  ForgeInsight,
  SynthesisInput,
} from "./synthesis.types";

import {
  buildSynthesisLanguage,
} from "./synthesisLanguage";

export function buildForgeInsight(
  input: SynthesisInput,
): ForgeInsight {
  const strengths = buildStrengths(input);
  const opportunities = buildOpportunities(input);
  const risks = buildRisks(input);

  const recommendation =
    buildRecommendation(input);

  const language =
    buildSynthesisLanguage(input);

  return {
    headline: language.headline,
    summary: buildSummary(
    input,
    language.summaryLead,
    ),
    strengths,
    opportunities,
    risks,
    recommendation,
    confidence: calculateConfidence(input),
  };
}

function buildHeadline(
  input: SynthesisInput,
): string {
  const identityName =
    getStrongestIdentityName(input);

  if (
    identityName &&
    input.progress.completionRate >= 80
  ) {
    return `Your ${identityName} identity is gaining strength.`;
  }

  if (input.momentum.score >= 80) {
    return "Your current rhythm is working.";
  }

  if (
    input.momentum.burnoutRisk === "high"
  ) {
    return "Your progress needs more recovery.";
  }

  if (input.progress.completionRate < 50) {
    return "Simplify the plan and rebuild momentum.";
  }

  return "Your direction is becoming clearer.";
}

function buildSummary(
  input: SynthesisInput,
  summaryLead: string,
): string {
  const identityName =
    getStrongestIdentityName(input);

  const completed =
    input.progress.completedSessions;

  const completionRate =
    input.progress.completionRate;

  if (
    identityName &&
    completed > 0
  ) {
    return `${summaryLead} You completed ${completed} ${
      completed === 1
        ? "practice"
        : "practices"
    } this week at a ${completionRate}% completion rate, providing evidence of the ${identityName} you are becoming.`;
  }

  if (completed > 0) {
    return `${summaryLead} You completed ${completed} ${
      completed === 1
        ? "practice"
        : "practices"
    } this week with a ${completionRate}% completion rate.`;
  }

  return summaryLead;
}

 
function buildStrengths(
  input: SynthesisInput,
): string[] {
  const strengths: string[] = [];

  if (input.progress.completionRate >= 80) {
    strengths.push(
      `You completed ${input.progress.completionRate}% of your planned practices.`,
    );
  }

  if (input.progress.currentStreak >= 5) {
    strengths.push(
      `You maintained a ${input.progress.currentStreak}-day practice rhythm.`,
    );
  }

  if (input.momentum.score >= 80) {
    strengths.push(
      "Your overall momentum remains strong.",
    );
  }

  if (input.progress.strongestSkill) {
    strengths.push(
      `${input.progress.strongestSkill.name} received your strongest investment of focused practice.`,
    );
  }

  const identityName =
    getStrongestIdentityName(input);

  if (identityName) {
    strengths.push(
      `Your recent actions support your ${identityName} identity.`,
    );
  }

  if (
    input.forgeHealth.score >= 80
  ) {
    strengths.push(
      `Your Forge Score is ${input.forgeHealth.score}, placing you at the ${input.forgeHealth.grade} stage.`,
    );
  }

  return strengths.slice(0, 3);
}

function buildOpportunities(
  input: SynthesisInput,
): string[] {
  const opportunities: string[] = [];

  if (
    input.progress.neglectedSkill &&
    input.progress.neglectedSkill
      .daysSincePracticed !== null
  ) {
    opportunities.push(
      `${input.progress.neglectedSkill.name} has gone ${input.progress.neglectedSkill.daysSincePracticed} days without practice.`,
    );
  }

  if (
    input.forgeHealth.breakdown.reflection <
    5
  ) {
    opportunities.push(
      "More reflection would help Forge understand why your strongest practices are working.",
    );
  }

  if (
    input.forgeHealth.breakdown.balance <
    10
  ) {
    opportunities.push(
      "Your completed work is concentrated in a limited number of life areas.",
    );
  }

  if (
    input.progress.completionRate >= 50 &&
    input.progress.completionRate < 80
  ) {
    opportunities.push(
      "A small improvement in follow-through could meaningfully strengthen your weekly rhythm.",
    );
  }

  if (
    input.vision?.north_star?.trim()
  ) {
    opportunities.push(
      `Use your North Star—“${input.vision.north_star.trim()}”—to decide which commitments deserve protection next week.`,
    );
  }

  return opportunities.slice(0, 3);
}

function buildRisks(
  input: SynthesisInput,
): string[] {
  const risks: string[] = [];

  if (
    input.momentum.burnoutRisk === "high"
  ) {
    risks.push(
      "Your present workload may be demanding more recovery than your current schedule allows.",
    );
  }

  if (input.progress.completionRate < 40) {
    risks.push(
      "Low follow-through may indicate that the weekly plan is too ambitious or poorly timed.",
    );
  }

  if (
    input.progress.scheduledSessions > 0 &&
    input.progress.completedSessions === 0
  ) {
    risks.push(
      "No scheduled practices have been completed yet this week.",
    );
  }

  if (
    input.progress.neglectedSkill &&
    input.progress.neglectedSkill
      .daysSincePracticed !== null &&
    input.progress.neglectedSkill
      .daysSincePracticed >= 14
  ) {
    risks.push(
      `${input.progress.neglectedSkill.name} may be drifting out of your active practice rhythm.`,
    );
  }

  return risks.slice(0, 3);
}

function buildRecommendation(
  input: SynthesisInput,
): string {
  const coachRecommendation =
    input.coach.recommendations[0];

  if (coachRecommendation) {
    return coachRecommendation.message;
  }

  if (
    input.progress.neglectedSkill
  ) {
    return `Schedule one manageable ${input.progress.neglectedSkill.name} practice next week.`;
  }

  if (input.progress.completionRate < 50) {
    return "Reduce next week’s plan to fewer, more achievable commitments.";
  }

  if (input.progress.strongestSkill) {
    return `Protect the rhythm you have created around ${input.progress.strongestSkill.name}.`;
  }

  return "Choose one meaningful practice and complete it with intention.";
}

function calculateConfidence(
  input: SynthesisInput,
): number {
  let confidence = 35;

  confidence += Math.min(
    25,
    input.progress.totalSessions * 3,
  );

  confidence += Math.min(
    20,
    input.progress.completedSessions * 4,
  );

  if (input.vision) {
    confidence += 10;
  }

  if (
    input.identity.strongestIdentity
  ) {
    confidence += 10;
  }

  return Math.min(100, confidence);
}

function getStrongestIdentityName(
  input: SynthesisInput,
): string | null {
  const strongest =
    input.identity.strongestIdentity;

  if (!strongest) {
    return null;
  }

  return strongest.identity.name;
}