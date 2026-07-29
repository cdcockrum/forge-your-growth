import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  EvidenceGraph,
  ReasoningEdge,
  ReasoningEdgeType,
  ReasoningNode,
} from "./reasoning.types";

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(1, value),
  );
}

function normalizeValue(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function getNormalizedTags(
  evidence: AdvisorEvidence,
): Set<string> {
  return new Set(
    evidence.tags
      .map(normalizeValue)
      .filter(
        (tag) => tag.length > 0,
      ),
  );
}

function getSharedTags(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
): string[] {
  const firstTags =
    getNormalizedTags(first);

  const secondTags =
    getNormalizedTags(second);

  return Array.from(
    firstTags,
  ).filter((tag) =>
    secondTags.has(tag),
  );
}

function calculateInitialWeight(
  evidence: AdvisorEvidence,
): number {
  const confidence =
    clamp01(evidence.confidence);

  const impact =
    clamp01(evidence.impact);

  return clamp01(
    confidence * 0.6 +
      impact * 0.4,
  );
}

function calculateInitialSupport(
  evidence: AdvisorEvidence,
): number {
  const confidence =
    clamp01(evidence.confidence);

  const impact =
    clamp01(evidence.impact);

  return clamp01(
    confidence * impact,
  );
}

function buildReasoningNode(
  evidence: AdvisorEvidence,
): ReasoningNode {
  return {
    id: `reasoning-node-${evidence.id}`,

    evidence,

    weight:
      calculateInitialWeight(
        evidence,
      ),

    support:
      calculateInitialSupport(
        evidence,
      ),
  };
}

function determineEdgeType(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
): ReasoningEdgeType {
  if (
    first.polarity ===
      second.polarity &&
    first.category !==
      second.category
  ) {
    return "reinforces";
  }

  if (
    first.category ===
      "prediction" ||
    second.category ===
      "prediction"
  ) {
    return "predicts";
  }

  if (
    first.polarity !==
      second.polarity &&
    first.polarity !== "neutral" &&
    second.polarity !== "neutral"
  ) {
    return "conflicts";
  }

  return "related";
}

function calculateEdgeStrength(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): number {
  let strength = 0;

  if (
    first.category ===
    second.category
  ) {
    strength += 0.3;
  }

  if (
    normalizeValue(first.source) ===
    normalizeValue(second.source)
  ) {
    strength += 0.25;
  }

  strength += Math.min(
    sharedTags.length * 0.15,
    0.3,
  );

  const confidenceAverage =
    (
      clamp01(first.confidence) +
      clamp01(second.confidence)
    ) / 2;

  strength +=
    confidenceAverage * 0.15;

  return clamp01(strength);
}

function buildEdgeReasons(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): string[] {
  const reasons: string[] = [];

  if (
    first.category ===
    second.category
  ) {
    reasons.push(
      `Both evidence items belong to the ${first.category} category.`,
    );
  }

  if (
    normalizeValue(first.source) ===
    normalizeValue(second.source)
  ) {
    reasons.push(
      `Both evidence items come from the ${first.source} source.`,
    );
  }

  if (sharedTags.length > 0) {
    reasons.push(
      `Shared tags: ${sharedTags.join(", ")}.`,
    );
  }

  if (
    first.polarity ===
    second.polarity
  ) {
    reasons.push(
      `Both evidence items have ${first.polarity} polarity.`,
    );
  }

  return reasons;
}

function shouldCreateEdge(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): boolean {
  return (
    first.category ===
      second.category ||
    normalizeValue(first.source) ===
      normalizeValue(second.source) ||
    sharedTags.length > 0
  );
}

function buildReasoningEdge(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
): ReasoningEdge | null {
  const sharedTags =
    getSharedTags(
      first,
      second,
    );

  if (
    !shouldCreateEdge(
      first,
      second,
      sharedTags,
    )
  ) {
    return null;
  }

  const type =
    determineEdgeType(
      first,
      second,
    );

  return {
    id:
      `reasoning-edge-${first.id}-${second.id}`,

    from: first.id,

    to: second.id,

    type,

    strength:
      calculateEdgeStrength(
        first,
        second,
        sharedTags,
      ),

    reasons:
      buildEdgeReasons(
        first,
        second,
        sharedTags,
      ),
  };
}

function buildReasoningEdges(
  evidence: AdvisorEvidence[],
): ReasoningEdge[] {
  const edges: ReasoningEdge[] = [];

  for (
    let firstIndex = 0;
    firstIndex <
    evidence.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex <
      evidence.length;
      secondIndex += 1
    ) {
      const edge =
        buildReasoningEdge(
          evidence[firstIndex],
          evidence[secondIndex],
        );

      if (edge) {
        edges.push(edge);
      }
    }
  }

  return edges;
}

export function buildEvidenceGraph(
  evidence: AdvisorEvidence[],
): EvidenceGraph {
  return {
    nodes: evidence.map(
      buildReasoningNode,
    ),

    edges:
      buildReasoningEdges(
        evidence,
      ),
  };
}