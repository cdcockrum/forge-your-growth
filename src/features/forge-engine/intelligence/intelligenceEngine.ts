import type {
  IntelligenceConclusion,
  IntelligenceInput,
} from "./intelligence.types";

export function buildIntelligenceConclusion(
  input: IntelligenceInput,
): IntelligenceConclusion {
  return {
    title:
      input.advisor.title,

    summary:
      input.advisor.message,

    confidence:
      input.advisor.confidence,

    evidence: buildEvidence(input),

    reasoning: buildReasoning(input),

    recommendation:
      input.insight.recommendation,
  };
}

function buildEvidence(
  input: IntelligenceInput,
): string[] {
  const evidence: string[] = [];

  if (input.identity.strongestIdentity) {
    evidence.push(
      "Identity Engine",
    );
  }

  if (
    input.memory.memories.length > 0
  ) {
    evidence.push(
      "Memory Engine",
    );
  }

  if (
    input.history.events.length > 0
  ) {
    evidence.push(
      "History Engine",
    );
  }

  evidence.push(
    "Narrative Engine",
  );

  evidence.push(
    "Advisor Engine",
  );

  return evidence;
}

function buildReasoning(
  input: IntelligenceInput,
): string[] {
  const reasoning: string[] = [];

  reasoning.push(
    `Completion rate: ${input.progress.completionRate}%`,
  );

  reasoning.push(
    `Momentum score: ${input.momentum.score}`,
  );

  if (
    input.identity.strongestIdentity
  ) {
    reasoning.push(
      `${input.identity.strongestIdentity.identity.name} has become your strongest identity.`
    );
  }

  if (
    input.memory.strongest[0]
  ) {
    reasoning.push(
      input.memory.strongest[0].statement,
    );
  }

  return reasoning;
}