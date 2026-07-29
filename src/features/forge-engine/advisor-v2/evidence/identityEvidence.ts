import type {
  IdentityEngineResult,
  IdentityProgress,
} from "../../identity";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function buildIdentityProgressEvidence(
  progress: IdentityProgress,
): AdvisorEvidence {
  return {
    id: `identity-${progress.identity.key}`,
    category: "identity",
    source: progress.identity.name,
    statement:
      `${progress.identity.name} is Level ${progress.level} with ${Math.round(
        progress.xp,
      )} XP earned across ${progress.completedSessions} completed sessions.`,
    confidence: 0.95,
    impact: 0.9,
    polarity: "positive",
    tags: [
      "identity",
      progress.identity.key,
      progress.identity.name,
      "growth",
      "xp",
      "level",
    ],
  };
}

export function buildIdentityEvidence(
  identity: IdentityEngineResult,
): AdvisorEvidence[] {
  const evidence: AdvisorEvidence[] = [];

  for (const progress of identity.identities) {
    evidence.push(
      buildIdentityProgressEvidence(progress),
    );
  }

  if (identity.strongestIdentity) {
    evidence.push({
      id: "identity-strongest",
      category: "identity",
      source: "strongestIdentity",
      statement:
        `The strongest emerging identity is ${identity.strongestIdentity.identity.name}.`,
      confidence: 0.95,
      impact: 0.95,
      polarity: "positive",
      tags: [
        "identity",
        "strongest",
      ],
    });
  }

  if (identity.fastestDevelopingIdentity) {
    evidence.push({
      id: "identity-fastest",
      category: "identity",
      source: "fastestDevelopingIdentity",
      statement:
        `${identity.fastestDevelopingIdentity.identity.name} is currently developing the fastest.`,
      confidence: 0.9,
      impact: 0.9,
      polarity: "positive",
      tags: [
        "identity",
        "growth",
        "trajectory",
      ],
    });
  }

  return evidence;
}