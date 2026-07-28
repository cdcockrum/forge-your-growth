import type {
  EvidenceGraph,
  EvidenceNode,
} from "./evidence.types";

export function createEvidenceGraph(
  nodes: EvidenceNode[],
): EvidenceGraph {
  const ranked = [...nodes].sort(
    (first, second) =>
      evidenceScore(second) -
      evidenceScore(first),
  );

  const supporting = ranked.filter(
    (node) =>
      node.polarity ===
      "supporting",
  );

  const contradicting = ranked.filter(
    (node) =>
      node.polarity ===
      "contradicting",
  );

  return {
    nodes: ranked,

    supporting,

    contradicting,

    strongest:
      ranked.slice(0, 5),

    confidence:
      calculateGraphConfidence(
        ranked,
      ),
  };
}

function evidenceScore(
  node: EvidenceNode,
): number {
  return (
    node.weight * 0.6 +
    node.confidence * 0.4
  );
}

function calculateGraphConfidence(
  nodes: EvidenceNode[],
): number {
  if (nodes.length === 0) {
    return 0;
  }

  const weightedTotal =
    nodes.reduce(
      (total, node) =>
        total +
        node.confidence *
          node.weight,
      0,
    );

  const totalWeight =
    nodes.reduce(
      (total, node) =>
        total + node.weight,
      0,
    );

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round(
    weightedTotal /
      totalWeight,
  );
}