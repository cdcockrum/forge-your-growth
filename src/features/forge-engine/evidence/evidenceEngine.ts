import type {
  AdvisorBriefing,
  IdentityEngineResult,
  ProgressSummary,
} from "@/features/forge-engine";

import type {
  EvidenceNode,
} from "./evidence.types";

type BuildEvidenceOptions = {
  progress: ProgressSummary;
  identity: IdentityEngineResult;
  advisor: AdvisorBriefing;
  observedAt?: string;
};

export function buildEvidenceNodes({
  progress,
  identity,
  advisor,
  observedAt = new Date().toISOString(),
}: BuildEvidenceOptions): EvidenceNode[] {
  const nodes: EvidenceNode[] = [];

  const completionNodeId =
    "progress-completion";

  nodes.push({
    id: completionNodeId,
    source: "progress",
    category: "practice",
    subject: "Weekly completion",
    statement: `Completed ${progress.completedSessions} of ${progress.totalSessions} scheduled sessions.`,
    confidence: 100,
    weight: calculateCompletionWeight(
      progress.completionRate,
    ),
    polarity:
      progress.completionRate >= 60
        ? "supporting"
        : "contradicting",
    timestamp: observedAt,
    relatedIds: [],
  });

  if (progress.strongestSkill) {
    nodes.push({
      id: `progress-skill-${progress.strongestSkill.skillId}`,
      source: "progress",
      category: "practice",
      subject:
        progress.strongestSkill.name,
      statement:
        `${progress.strongestSkill.name} received your strongest investment of practice.`,
      confidence:
        calculateEvidenceConfidence(
          progress.strongestSkill
            .completedSessions,
        ),
      weight: 78,
      polarity: "supporting",
      timestamp: observedAt,
      relatedIds: [
        completionNodeId,
      ],
    });
  }

  const strongestIdentity =
    identity.strongestIdentity;

  const identityNodeId =
    strongestIdentity
      ? `identity-${strongestIdentity.identity.key}`
      : null;

  if (
    strongestIdentity &&
    identityNodeId
  ) {
    nodes.push({
      id: identityNodeId,
      source: "identity",
      category: "identity",
      subject:
        strongestIdentity.identity.name,
      statement:
        `${strongestIdentity.identity.name} is currently your strongest supported identity.`,
      confidence:
        calculateEvidenceConfidence(
          strongestIdentity
            .completedSessions,
        ),
      weight: 82,
      polarity: "supporting",
      timestamp: observedAt,
      relatedIds: [
        completionNodeId,
      ],
    });
  }

  nodes.push({
    id: "advisor-current",
    source: "advisor",
    category: "recommendation",
    subject: advisor.title,
    statement: advisor.message,
    confidence: advisor.confidence,
    weight: 90,
    polarity: "neutral",
    timestamp: observedAt,
    relatedIds: identityNodeId
      ? [
          identityNodeId,
          completionNodeId,
        ]
      : [
          completionNodeId,
        ],
  });

  return nodes;
}

function calculateEvidenceConfidence(
  evidenceCount: number,
): number {
  return Math.min(
    95,
    45 + evidenceCount * 8,
  );
}

function calculateCompletionWeight(
  completionRate: number,
): number {
  if (completionRate >= 80) {
    return 90;
  }

  if (completionRate >= 60) {
    return 75;
  }

  if (completionRate >= 40) {
    return 65;
  }

  return 85;
}