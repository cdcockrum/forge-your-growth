import type {
  AdvisorBriefing,
} from "../advisor";

import type {
  EvidenceGraph,
} from "../evidence";

import type {
  IdentityEngineResult,
} from "../identity";

import type {
  MemoryResult,
} from "../memory";

import type {
  BeliefResult,
  ForgeBelief,
} from "./belief.types";

type BuildBeliefsInput = {
  advisor: AdvisorBriefing;

  identity: IdentityEngineResult;

  evidence: EvidenceGraph;

  memory: MemoryResult;
};

export function buildBeliefs({
  advisor,
  identity,
  evidence,
  memory,
}: BuildBeliefsInput): BeliefResult {

  const beliefs: ForgeBelief[] = [];

  if (identity.strongestIdentity) {

    beliefs.push({

      id: "identity",

      statement:
        `You are becoming a ${identity.strongestIdentity.identity.name}.`,

      confidence: Math.min(
        100,
        identity.strongestIdentity.completedSessions * 10,
        ),

      supportingEvidence:
        evidence.strongest.map(
          node => node.statement,
        ),

      contradictingEvidence:
        evidence.contradicting.map(
          node => node.statement,
        ),

      lastUpdated:
        new Date().toISOString(),

    });

  }

  beliefs.push({

    id: "advisor",

    statement:
      advisor.title,

    confidence:
      advisor.confidence,

    supportingEvidence:
      advisor.reasoning,

    contradictingEvidence: [],

    lastUpdated:
      new Date().toISOString(),

  });

  return {

    beliefs,

    strongest:
      beliefs
        .slice()
        .sort(
          (a,b)=>
            b.confidence-a.confidence,
        )
        .slice(0,3),

    confidence:
      beliefs.length
        ? Math.round(
            beliefs.reduce(
              (sum,b)=>
                sum+b.confidence,
              0,
            )/beliefs.length,
          )
        : 0,

  };

}
