import type {
  AdvisorEvidence,
} from "../advisor.types";

import type {
  EvidenceAgreement,
  EvidenceContradiction,
  EvidenceGap,
  EvidenceGraph,
  EvidenceTension,
  EvidenceWeight,
  Hypothesis,
  ReasoningAnalysis,
  ReasoningNode,
} from "./reasoning.types";

const MAX_HYPOTHESES = 8;

function clamp01(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(1, value),
  );
}

function getEvidenceById(
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

function getWeightByEvidenceId(
  evidenceId: string,
  weights: EvidenceWeight[],
): number {
  return (
    weights.find(
      (weight) =>
        weight.evidenceId === evidenceId,
    )?.adjustedScore ?? 0
  );
}

function getAverageEvidenceWeight(
  evidenceIds: string[],
  weights: EvidenceWeight[],
): number {
  if (evidenceIds.length === 0) {
    return 0;
  }

  const total =
    evidenceIds.reduce(
      (sum, evidenceId) =>
        sum +
        getWeightByEvidenceId(
          evidenceId,
          weights,
        ),
      0,
    );

  return clamp01(
    total / evidenceIds.length,
  );
}

function getEvidenceStatements(
  evidenceIds: string[],
  graph: EvidenceGraph,
): string[] {
  return evidenceIds
    .map(
      (evidenceId) =>
        getEvidenceById(
          evidenceId,
          graph.nodes,
        ),
    )
    .filter(
      (
        evidence,
      ): evidence is AdvisorEvidence =>
        evidence !== null,
    )
    .map(
      (evidence) =>
        evidence.statement,
    );
}

function getCategoriesFromEvidence(
  evidenceIds: string[],
  graph: EvidenceGraph,
): string[] {
  return Array.from(
    new Set(
      evidenceIds
        .map(
          (evidenceId) =>
            getEvidenceById(
              evidenceId,
              graph.nodes,
            )?.category,
        )
        .filter(
          (
            category,
          ): category is AdvisorEvidence["category"] =>
            category !== undefined,
        ),
    ),
  );
}

function formatCategories(
  categories: string[],
): string {
  if (categories.length === 0) {
    return "multiple evidence sources";
  }

  if (categories.length === 1) {
    return `${categories[0]} evidence`;
  }

  if (categories.length === 2) {
    return (
      `${categories[0]} and ` +
      `${categories[1]} evidence`
    );
  }

  return (
    `${categories
      .slice(0, -1)
      .join(", ")}, and ` +
    `${categories.at(-1)} evidence`
  );
}

function buildAgreementHypothesis(
  agreement: EvidenceAgreement,
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): Hypothesis {
  const categories =
    getCategoriesFromEvidence(
      agreement.evidenceIds,
      graph,
    );

  const averageWeight =
    getAverageEvidenceWeight(
      agreement.evidenceIds,
      weights,
    );

  const confidence =
    clamp01(
      agreement.strength * 0.55 +
        averageWeight * 0.45,
    );

  const topic =
    agreement.sharedTags.length > 0
      ? agreement.sharedTags.join(", ")
      : "the user's current development";

  return {
    id:
      `hypothesis-agreement-${agreement.id}`,

    title:
      `Evidence indicates alignment around ${topic}`,

    description:
      `${formatCategories(
        categories,
      )} converge on a consistent interpretation of ${topic}.`,

    supportingEvidence: [
      ...agreement.evidenceIds,
    ],

    conflictingEvidence: [],

    confidence,

    rationale: [
      agreement.explanation,
      `The supporting evidence has an average adjusted weight of ${averageWeight.toFixed(
        2,
      )}.`,
      `The detected relationship strength is ${agreement.strength.toFixed(
        2,
      )}.`,
    ],
  };
}

function buildTensionHypothesis(
  tension: EvidenceTension,
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): Hypothesis {
  const categories =
    getCategoriesFromEvidence(
      tension.evidenceIds,
      graph,
    );

  const averageWeight =
    getAverageEvidenceWeight(
      tension.evidenceIds,
      weights,
    );

  const confidence =
    clamp01(
      tension.severity * 0.45 +
        averageWeight * 0.35 +
        0.1,
    );

  const topic =
    tension.sharedTags.length > 0
      ? tension.sharedTags.join(", ")
      : "the current situation";

  return {
    id:
      `hypothesis-tension-${tension.id}`,

    title:
      `The evidence may reflect incomplete alignment around ${topic}`,

    description:
      `${formatCategories(
        categories,
      )} suggest that different parts of the user's current experience are not fully aligned.`,

    supportingEvidence: [
      ...tension.evidenceIds,
    ],

    conflictingEvidence: [
      ...tension.evidenceIds,
    ],

    confidence,

    rationale: [
      tension.explanation,
      `The tension severity is ${tension.severity.toFixed(
        2,
      )}.`,
      `The involved evidence has an average adjusted weight of ${averageWeight.toFixed(
        2,
      )}.`,
      "This is treated as a possible explanation rather than a confirmed contradiction.",
    ],
  };
}

function buildContradictionHypothesis(
  contradiction: EvidenceContradiction,
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): Hypothesis {
  const categories =
    getCategoriesFromEvidence(
      contradiction.evidenceIds,
      graph,
    );

  const averageWeight =
    getAverageEvidenceWeight(
      contradiction.evidenceIds,
      weights,
    );

  const confidence =
    clamp01(
      contradiction.severity * 0.55 +
        averageWeight * 0.4,
    );

  const topic =
    contradiction.sharedTags.length > 0
      ? contradiction.sharedTags.join(", ")
      : "the same area of development";

  return {
    id:
      `hypothesis-contradiction-${contradiction.id}`,

    title:
      `The available evidence contains a meaningful contradiction around ${topic}`,

    description:
      `${formatCategories(
        categories,
      )} support opposing interpretations, suggesting that the current picture may be unstable, context-dependent, or incomplete.`,

    supportingEvidence: [
      ...contradiction.evidenceIds,
    ],

    conflictingEvidence: [
      ...contradiction.evidenceIds,
    ],

    confidence,

    rationale: [
      contradiction.explanation,
      `The contradiction severity is ${contradiction.severity.toFixed(
        2,
      )}.`,
      `The involved evidence has an average adjusted weight of ${averageWeight.toFixed(
        2,
      )}.`,
    ],
  };
}

function buildGapHypothesis(
  gap: EvidenceGap,
): Hypothesis {
  return {
    id:
      `hypothesis-gap-${gap.id}`,

    title:
      `The current interpretation is limited by missing ${gap.category} evidence`,

    description:
      gap.explanation,

    supportingEvidence: [],

    conflictingEvidence: [],

    confidence:
      clamp01(
        gap.importance * 0.65,
      ),

    rationale: [
      `The missing evidence category has an importance score of ${gap.importance.toFixed(
        2,
      )}.`,
      "This hypothesis describes an uncertainty in the analysis rather than a conclusion about the user.",
    ],
  };
}

function buildDominantEvidenceHypothesis(
  node: ReasoningNode,
  weights: EvidenceWeight[],
): Hypothesis {
  const evidence = node.evidence;

  const adjustedWeight =
    getWeightByEvidenceId(
      evidence.id,
      weights,
    );

  return {
    id:
      `hypothesis-dominant-${evidence.id}`,

    title:
      `The strongest available signal comes from ${evidence.category} evidence`,

    description:
      evidence.statement,

    supportingEvidence: [
      evidence.id,
    ],

    conflictingEvidence: [],

    confidence:
      clamp01(
        adjustedWeight * 0.85,
      ),

    rationale: [
      `This evidence has an adjusted weight of ${adjustedWeight.toFixed(
        2,
      )}.`,
      `Its confidence is ${clamp01(
        evidence.confidence,
      ).toFixed(2)} and its impact is ${clamp01(
        evidence.impact,
      ).toFixed(2)}.`,
    ],
  };
}

function getStrongestNode(
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): ReasoningNode | null {
  return (
    [...graph.nodes]
      .sort(
        (first, second) =>
          getWeightByEvidenceId(
            second.evidence.id,
            weights,
          ) -
          getWeightByEvidenceId(
            first.evidence.id,
            weights,
          ),
      )
      .at(0) ?? null
  );
}

function deduplicateHypotheses(
  hypotheses: Hypothesis[],
): Hypothesis[] {
  const seenEvidenceSets =
    new Set<string>();

  return hypotheses.filter(
    (hypothesis) => {
      const evidenceKey = [
        ...new Set([
          ...hypothesis.supportingEvidence,
          ...hypothesis.conflictingEvidence,
        ]),
      ]
        .sort()
        .join("|");

      const key =
        evidenceKey.length > 0
          ? evidenceKey
          : hypothesis.id;

      if (
        seenEvidenceSets.has(key)
      ) {
        return false;
      }

      seenEvidenceSets.add(key);

      return true;
    },
  );
}

function sortHypotheses(
  hypotheses: Hypothesis[],
): Hypothesis[] {
  return [...hypotheses].sort(
    (first, second) =>
      second.confidence -
      first.confidence,
  );
}

export function generateHypotheses(
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
  analysis: ReasoningAnalysis,
): Hypothesis[] {
  const hypotheses: Hypothesis[] = [];

  for (
    const agreement
    of analysis.agreements
  ) {
    hypotheses.push(
      buildAgreementHypothesis(
        agreement,
        graph,
        weights,
      ),
    );
  }

  for (
    const contradiction
    of analysis.contradictions
  ) {
    hypotheses.push(
      buildContradictionHypothesis(
        contradiction,
        graph,
        weights,
      ),
    );
  }

  for (
    const tension
    of analysis.tensions
  ) {
    hypotheses.push(
      buildTensionHypothesis(
        tension,
        graph,
        weights,
      ),
    );
  }

  for (
    const gap
    of analysis.gaps
  ) {
    hypotheses.push(
      buildGapHypothesis(
        gap,
      ),
    );
  }

  const strongestNode =
    getStrongestNode(
      graph,
      weights,
    );

  if (strongestNode) {
    hypotheses.push(
      buildDominantEvidenceHypothesis(
        strongestNode,
        weights,
      ),
    );
  }

  return sortHypotheses(
    deduplicateHypotheses(
      hypotheses,
    ),
  ).slice(
    0,
    MAX_HYPOTHESES,
  );
}
