import type {
  AdvisorEvidence,
  AdvisorEvidenceCategory,
} from "../advisor.types";

import type {
  EvidenceAgreement,
  EvidenceContradiction,
  EvidenceGap,
  EvidenceGraph,
  EvidenceTension,
  EvidenceWeight,
  ReasoningAnalysis,
  ReasoningEdge,
  ReasoningNode,
} from "./reasoning.types";

const EXPECTED_EVIDENCE_CATEGORIES: AdvisorEvidenceCategory[] = [
  "vision",
  "progress",
  "momentum",
  "identity",
  "memory",
  "pattern",
  "belief",
  "prediction",
  "history",
  "trend",
];

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

function getNormalizedTags(
  evidence: AdvisorEvidence,
): Set<string> {
  return new Set(
    evidence.tags
      .map(normalizeValue)
      .filter(
        (tag) =>
          tag.length > 0,
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
  ).filter(
    (tag) =>
      secondTags.has(tag),
  );
}

function getCategories(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
): string[] {
  return Array.from(
    new Set([
      first.category,
      second.category,
    ]),
  );
}

function getRelationshipStrength(
  edge: ReasoningEdge,
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  weights: EvidenceWeight[],
): number {
  const firstWeight =
    getWeightByEvidenceId(
      first.id,
      weights,
    );

  const secondWeight =
    getWeightByEvidenceId(
      second.id,
      weights,
    );

  const averageWeight =
    (
      firstWeight +
      secondWeight
    ) / 2;

  return clamp01(
    edge.strength * 0.55 +
      averageWeight * 0.45,
  );
}

function buildAgreementExplanation(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): string {
  const sharedContext =
    sharedTags.length > 0
      ? ` around ${sharedTags.join(", ")}`
      : "";

  return (
    `${first.category} evidence and ` +
    `${second.category} evidence reinforce one another` +
    `${sharedContext}.`
  );
}

function buildAgreement(
  edge: ReasoningEdge,
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  weights: EvidenceWeight[],
): EvidenceAgreement {
  const sharedTags =
    getSharedTags(
      first,
      second,
    );

  return {
    id: `agreement-${first.id}-${second.id}`,

    evidenceIds: [
      first.id,
      second.id,
    ],

    explanation:
      buildAgreementExplanation(
        first,
        second,
        sharedTags,
      ),

    strength:
      getRelationshipStrength(
        edge,
        first,
        second,
        weights,
      ),

    categories:
      getCategories(
        first,
        second,
      ),

    sharedTags,
  };
}

function isDirectContradiction(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): boolean {
  const polaritiesOppose =
    (
      first.polarity === "positive" &&
      second.polarity === "negative"
    ) ||
    (
      first.polarity === "negative" &&
      second.polarity === "positive"
    );

  if (!polaritiesOppose) {
    return false;
  }

  const sameSource =
    normalizeValue(first.source) ===
    normalizeValue(second.source);

  const sameCategory =
    first.category ===
    second.category;

  return (
    sharedTags.length > 0 ||
    sameSource ||
    sameCategory
  );
}

function buildContradictionExplanation(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): string {
  const subject =
    sharedTags.length > 0
      ? sharedTags.join(", ")
      : "the same area";

  return (
    `${first.category} and ${second.category} evidence ` +
    `make opposing claims about ${subject}.`
  );
}

function buildContradiction(
  edge: ReasoningEdge,
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  weights: EvidenceWeight[],
): EvidenceContradiction {
  const sharedTags =
    getSharedTags(
      first,
      second,
    );

  return {
    id:
      `contradiction-${first.id}-${second.id}`,

    evidenceIds: [
      first.id,
      second.id,
    ],

    explanation:
      buildContradictionExplanation(
        first,
        second,
        sharedTags,
      ),

    severity:
      getRelationshipStrength(
        edge,
        first,
        second,
        weights,
      ),

    categories:
      getCategories(
        first,
        second,
      ),

    sharedTags,
  };
}

function buildTensionExplanation(
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  sharedTags: string[],
): string {
  const sharedContext =
    sharedTags.length > 0
      ? ` concerning ${sharedTags.join(", ")}`
      : "";

  return (
    `${first.category} evidence and ` +
    `${second.category} evidence are not fully aligned` +
    `${sharedContext}, but the available evidence does not establish a direct contradiction.`
  );
}

function buildTension(
  edge: ReasoningEdge,
  first: AdvisorEvidence,
  second: AdvisorEvidence,
  weights: EvidenceWeight[],
): EvidenceTension {
  const sharedTags =
    getSharedTags(
      first,
      second,
    );

  return {
    id: `tension-${first.id}-${second.id}`,

    evidenceIds: [
      first.id,
      second.id,
    ],

    explanation:
      buildTensionExplanation(
        first,
        second,
        sharedTags,
      ),

    severity:
      getRelationshipStrength(
        edge,
        first,
        second,
        weights,
      ) * 0.8,

    categories:
      getCategories(
        first,
        second,
      ),

    sharedTags,
  };
}

function analyzeEdge(
  edge: ReasoningEdge,
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): {
  agreement?: EvidenceAgreement;
  tension?: EvidenceTension;
  contradiction?: EvidenceContradiction;
} {
  const first =
    getEvidenceById(
      edge.from,
      graph.nodes,
    );

  const second =
    getEvidenceById(
      edge.to,
      graph.nodes,
    );

  if (!first || !second) {
    return {};
  }

  if (
    edge.type === "reinforces" ||
    edge.type === "supports"
  ) {
    return {
      agreement:
        buildAgreement(
          edge,
          first,
          second,
          weights,
        ),
    };
  }

  if (edge.type !== "conflicts") {
    return {};
  }

  const sharedTags =
    getSharedTags(
      first,
      second,
    );

  if (
    isDirectContradiction(
      first,
      second,
      sharedTags,
    )
  ) {
    return {
      contradiction:
        buildContradiction(
          edge,
          first,
          second,
          weights,
        ),
    };
  }

  return {
    tension:
      buildTension(
        edge,
        first,
        second,
        weights,
      ),
  };
}

function calculateGapImportance(
  category: AdvisorEvidenceCategory,
): number {
  switch (category) {
    case "vision":
      return 0.9;

    case "progress":
      return 0.9;

    case "momentum":
      return 0.85;

    case "identity":
      return 0.8;

    case "history":
      return 0.75;

    case "pattern":
      return 0.7;

    case "memory":
      return 0.65;

    case "belief":
      return 0.6;

    case "trend":
      return 0.6;

    case "prediction":
      return 0.45;

    default:
      return 0.5;
  }
}

function buildGapExplanation(
  category: AdvisorEvidenceCategory,
): string {
  switch (category) {
    case "vision":
      return "No vision evidence is available, so current behavior cannot be compared with the user's declared direction.";

    case "progress":
      return "No progress evidence is available, so measurable advancement cannot be evaluated.";

    case "momentum":
      return "No momentum evidence is available, so the current direction and sustainability of effort are unclear.";

    case "identity":
      return "No identity evidence is available, so identity development cannot be evaluated.";

    case "memory":
      return "No derived memory evidence is available to provide longer-term personal context.";

    case "pattern":
      return "No recurring behavioral patterns have been identified.";

    case "belief":
      return "No belief evidence is available to compare the user's assumptions with observed behavior.";

    case "prediction":
      return "No prediction evidence is available for likely future outcomes.";

    case "history":
      return "No historical evidence is available to compare the current period with earlier behavior.";

    case "trend":
      return "No trend evidence is available, so longer-term movement cannot be established.";

    default:
      return `No ${category} evidence is available.`;
  }
}

function findEvidenceGaps(
  graph: EvidenceGraph,
): EvidenceGap[] {
  const availableCategories =
    new Set(
      graph.nodes.map(
        (node) =>
          node.evidence.category,
      ),
    );

  return EXPECTED_EVIDENCE_CATEGORIES
    .filter(
      (category) =>
        !availableCategories.has(
          category,
        ),
    )
    .map(
      (category) => ({
        id: `gap-${category}`,

        category,

        explanation:
          buildGapExplanation(
            category,
          ),

        importance:
          calculateGapImportance(
            category,
          ),
      }),
    );
}

function sortByStrength<
  T extends {
    strength: number;
  },
>(
  items: T[],
): T[] {
  return [...items].sort(
    (first, second) =>
      second.strength -
      first.strength,
  );
}

function sortBySeverity<
  T extends {
    severity: number;
  },
>(
  items: T[],
): T[] {
  return [...items].sort(
    (first, second) =>
      second.severity -
      first.severity,
  );
}

export function analyzeEvidenceRelationships(
  graph: EvidenceGraph,
  weights: EvidenceWeight[],
): ReasoningAnalysis {
  const agreements: EvidenceAgreement[] = [];
  const tensions: EvidenceTension[] = [];
  const contradictions: EvidenceContradiction[] = [];

  for (const edge of graph.edges) {
    const result =
      analyzeEdge(
        edge,
        graph,
        weights,
      );

    if (result.agreement) {
      agreements.push(
        result.agreement,
      );
    }

    if (result.tension) {
      tensions.push(
        result.tension,
      );
    }

    if (result.contradiction) {
      contradictions.push(
        result.contradiction,
      );
    }
  }

  return {
    agreements:
      sortByStrength(
        agreements,
      ),

    tensions:
      sortBySeverity(
        tensions,
      ),

    contradictions:
      sortBySeverity(
        contradictions,
      ),

    gaps:
      findEvidenceGaps(
        graph,
      ).sort(
        (first, second) =>
          second.importance -
          first.importance,
      ),
  };
}