import type {
  CognitiveDomain,
  CognitiveStateMeta,
  ForgeCognitiveState,
} from "./cognitiveState.types";

export type BuildCognitiveStateInput = Omit<
  ForgeCognitiveState,
  "meta"
> & {
  generatedAt?: string;
};

const DOMAIN_KEYS = [
  "progress",
  "momentum",
  "identity",
  "narrative",
  "memory",
  "history",
  "evidence",
  "intelligence",
  "contradictions",
  "predictions",
  "advisor",
  "vision",
  "trendAnalysis",
] as const satisfies readonly CognitiveDomain[];

function getAvailableDomains(
  input: BuildCognitiveStateInput,
): CognitiveDomain[] {
  return DOMAIN_KEYS.filter(
    (key) => input[key] !== null,
  );
}

function getMissingDomains(
  availableDomains: CognitiveDomain[],
): CognitiveDomain[] {
  return DOMAIN_KEYS.filter(
    (key) =>
      !availableDomains.includes(key),
  );
}

function calculateStateConfidence(
  availableDomains: CognitiveDomain[],
): number {
  return (
    availableDomains.length /
    DOMAIN_KEYS.length
  );
}

function determineStatus(
  availableDomains: CognitiveDomain[],
): CognitiveStateMeta["status"] {
  if (availableDomains.length === 0) {
    return "insufficient-data";
  }

  if (
    availableDomains.length ===
    DOMAIN_KEYS.length
  ) {
    return "active";
  }

  return "limited";
}

export function buildCognitiveState(
  input: BuildCognitiveStateInput,
): ForgeCognitiveState {
  const availableDomains =
    getAvailableDomains(input);

  const missingDomains =
    getMissingDomains(
      availableDomains,
    );

  return {
    progress:
      input.progress,

    momentum:
      input.momentum,

    identity:
      input.identity,

    narrative:
      input.narrative,

    memory:
      input.memory,

    history:
      input.history,

    evidence:
      input.evidence,

    intelligence:
      input.intelligence,

    contradictions:
      input.contradictions,

    predictions:
      input.predictions,

    advisor:
      input.advisor,

    vision:
      input.vision,

    trendAnalysis:
      input.trendAnalysis,

    meta: {
      generatedAt:
        input.generatedAt ??
        new Date().toISOString(),

      status:
        determineStatus(
          availableDomains,
        ),

      availableDomains,

      missingDomains,

      confidence:
        calculateStateConfidence(
          availableDomains,
        ),
    },
  };
}