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

    evidence:
      buildEvidence(input),

    reasoning:
      buildReasoning(input),

    recommendation:
      input.insight.recommendation,
  };
}

function buildEvidence(
  input: IntelligenceInput,
): string[] {
  const evidence: string[] = [];

  const memories =
    input.memory?.memories ?? [];

  const historyEvents =
    input.history?.events ?? [];

  if (
    input.identity
      ?.strongestIdentity
  ) {
    evidence.push(
      "Identity Engine",
    );
  }

  if (
    memories.length > 0
  ) {
    evidence.push(
      "Memory Engine",
    );
  }

  if (
    historyEvents.length > 0
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
    `Completion rate: ${
      input.progress
        ?.completionRate ?? 0
    }%`,
  );

  reasoning.push(
    `Momentum score: ${
      input.momentum
        ?.score ?? 0
    }`,
  );

  const strongestIdentity =
    input.identity
      ?.strongestIdentity;

  if (
    strongestIdentity
  ) {
    reasoning.push(
      `${strongestIdentity.identity.name} has become your strongest identity.`,
    );
  }

  const strongestMemory =
    input.memory
      ?.strongest?.[0];

  if (
    strongestMemory
  ) {
    reasoning.push(
      strongestMemory.statement,
    );
  }

  return reasoning;
}