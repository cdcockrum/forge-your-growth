import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  EvidenceGraph,
  EvidenceWeight,
  ReasoningEdge,
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

function getConnectedEdges(
  evidenceId: string,
  edges: ReasoningEdge[],
): ReasoningEdge[] {
  return edges.filter(
    (edge) =>
      edge.from === evidenceId ||
      edge.to === evidenceId,
  );
}

function getConnectedEvidenceId(
  evidenceId: string,
  edge: ReasoningEdge,
): string {
  return edge.from === evidenceId
    ? edge.to
    : edge.from;
}

function findEvidence(
  evidenceId: string,
  nodes: ReasoningNode[],
): AdvisorEvidence | null {
  return (
    nodes.find(
      (node) =>
        node.evidence.id === evidenceId,
    )?.evidence ?? null
  );
}

function calculateBaseScore(
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

function calculateConnectionBonus(
  connectedEdges: ReasoningEdge[],
): number {
  if (connectedEdges.length === 0) {
    return 0;
  }

  const totalStrength =
    connectedEdges.reduce(
      (sum, edge) =>
        sum + clamp01(edge.strength),
      0,
    );

  const averageStrength =
    totalStrength /
    connectedEdges.length;

  const densityBonus =
    Math.min(
      connectedEdges.length * 0.015,
      0.12,
    );

  return clamp01(
    averageStrength * 0.1 +
      densityBonus,
  );
}

function calculateCorroborationBonus(
  evidence: AdvisorEvidence,
  connectedEdges: ReasoningEdge[],
  nodes: ReasoningNode[],
): number {
  const corroboratingCategories =
    new Set<string>();

  for (const edge of connectedEdges) {
    if (
      edge.type !== "reinforces" &&
      edge.type !== "supports"
    ) {
      continue;
    }

    const connectedEvidenceId =
      getConnectedEvidenceId(
        evidence.id,
        edge,
      );

    const connectedEvidence =
      findEvidence(
        connectedEvidenceId,
        nodes,
      );

    if (
      !connectedEvidence ||
      connectedEvidence.category ===
        evidence.category
    ) {
      continue;
    }

    corroboratingCategories.add(
      connectedEvidence.category,
    );
  }

  return Math.min(
    corroboratingCategories.size *
      0.04,
    0.16,
  );
}

function calculateConflictPenalty(
  connectedEdges: ReasoningEdge[],
): number {
  const conflictStrength =
    connectedEdges
      .filter(
        (edge) =>
          edge.type === "conflicts",
      )
      .reduce(
        (sum, edge) =>
          sum +
          clamp01(edge.strength),
        0,
      );

  return Math.min(
    conflictStrength * 0.08,
    0.2,
  );
}

function calculateSourceQualityBonus(
  evidence: AdvisorEvidence,
): number {
  switch (evidence.category) {
    case "vision":
      return 0.06;

    case "history":
      return 0.05;

    case "progress":
      return 0.05;

    case "momentum":
      return 0.04;

    case "identity":
      return 0.04;

    case "memory":
      return 0.03;

    case "pattern":
      return 0.03;

    case "belief":
      return 0.02;

    case "trend":
      return 0.02;

    case "prediction":
      return 0;

    default:
      return 0;
  }
}

function calculatePolarityAdjustment(
  evidence: AdvisorEvidence,
): number {
  if (evidence.polarity === "neutral") {
    return -0.01;
  }

  return 0;
}

function buildWeightReasons(
  evidence: AdvisorEvidence,
  baseScore: number,
  connectionBonus: number,
  corroborationBonus: number,
  conflictPenalty: number,
  sourceQualityBonus: number,
): string[] {
  const reasons: string[] = [
    `Base score ${baseScore.toFixed(
      2,
    )} from confidence and impact.`,
  ];

  if (connectionBonus > 0) {
    reasons.push(
      `Graph relationships added ${connectionBonus.toFixed(
        2,
      )}.`,
    );
  }

  if (corroborationBonus > 0) {
    reasons.push(
      `Cross-category corroboration added ${corroborationBonus.toFixed(
        2,
      )}.`,
    );
  }

  if (sourceQualityBonus > 0) {
    reasons.push(
      `${evidence.category} evidence received a source-quality adjustment of ${sourceQualityBonus.toFixed(
        2,
      )}.`,
    );
  }

  if (conflictPenalty > 0) {
    reasons.push(
      `Conflicting relationships reduced the score by ${conflictPenalty.toFixed(
        2,
      )}.`,
    );
  }

  if (
    evidence.polarity === "neutral"
  ) {
    reasons.push(
      "Neutral evidence received a small weighting adjustment.",
    );
  }

  return reasons;
}

function calculateEvidenceWeight(
  node: ReasoningNode,
  graph: EvidenceGraph,
): EvidenceWeight {
  const evidence = node.evidence;

  const connectedEdges =
    getConnectedEdges(
      evidence.id,
      graph.edges,
    );

  const baseScore =
    calculateBaseScore(
      evidence,
    );

  const connectionBonus =
    calculateConnectionBonus(
      connectedEdges,
    );

  const corroborationBonus =
    calculateCorroborationBonus(
      evidence,
      connectedEdges,
      graph.nodes,
    );

  const conflictPenalty =
    calculateConflictPenalty(
      connectedEdges,
    );

  const sourceQualityBonus =
    calculateSourceQualityBonus(
      evidence,
    );

  const polarityAdjustment =
    calculatePolarityAdjustment(
      evidence,
    );

  const adjustedScore =
    clamp01(
      baseScore +
        connectionBonus +
        corroborationBonus +
        sourceQualityBonus +
        polarityAdjustment -
        conflictPenalty,
    );

  return {
    evidenceId: evidence.id,

    baseScore,

    adjustedScore,

    reasons:
      buildWeightReasons(
        evidence,
        baseScore,
        connectionBonus,
        corroborationBonus,
        conflictPenalty,
        sourceQualityBonus,
      ),
  };
}

export function calculateEvidenceWeights(
  graph: EvidenceGraph,
): EvidenceWeight[] {
  return graph.nodes.map(
    (node) =>
      calculateEvidenceWeight(
        node,
        graph,
      ),
  );
}

export function applyEvidenceWeights(
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): EvidenceGraph {
  const weightByEvidenceId =
    new Map(
      weights.map(
        (weight) => [
          weight.evidenceId,
          weight.adjustedScore,
        ],
      ),
    );

  return {
    ...graph,

    nodes: graph.nodes.map(
      (node) => ({
        ...node,

        weight:
          weightByEvidenceId.get(
            node.evidence.id,
          ) ?? node.weight,
      }),
    ),
  };
}

export function weightEvidenceGraph(
  graph: EvidenceGraph,
): {
  graph: EvidenceGraph;
  weights: EvidenceWeight[];
} {
  const weights =
    calculateEvidenceWeights(
      graph,
    );

  return {
    graph:
      applyEvidenceWeights(
        graph,
        weights,
      ),

    weights,
  };
}