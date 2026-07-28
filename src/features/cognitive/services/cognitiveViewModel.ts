import type {
  ForgeState,
} from "@/features/forge-engine";

export type CognitiveViewModel = {
  status:
    ForgeState["cognitiveState"]["meta"]["status"];

  confidence: number;

  currentFocus: string;

  identity: {
    name: string;
    statement: string;
  } | null;

  recommendation: {
    title: string;
    message: string;
  };

  contradictions:
    ForgeState["contradictions"]["contradictions"];

  evidence: string[];

  memories: {
    title: string;
    summary: string;
  }[];

  activeDomains: string[];

  missingDomains: string[];
};

export function buildCognitiveViewModel(
  forge: ForgeState,
): CognitiveViewModel {
  const strongestIdentity =
    forge.identity.strongestIdentity;

  return {
    status:
      forge.cognitiveState.meta.status,

    confidence: Math.round(
      forge.cognitiveState.meta.confidence *
        100,
    ),

    currentFocus:
      forge.advisor.title ||
      "Continue gathering meaningful evidence.",

    identity: strongestIdentity
      ? {
          name:
            strongestIdentity.identity.name,

          statement:
            `${strongestIdentity.identity.name} currently has the strongest identity support.`,
        }
      : null,

    recommendation: {
      title:
        forge.advisor.title,

      message:
        forge.advisor.message,
    },

    contradictions:
      forge.contradictions.contradictions,

    evidence:
      forge.evidence.strongest.map(
        (node) => node.statement,
      ),

    memories:
      forge.memory.strongest.map(
        (memory) => ({
          title: memory.title,
          summary: memory.summary,
        }),
      ),

    activeDomains:
      forge.cognitiveState.meta.availableDomains,

    missingDomains:
      forge.cognitiveState.meta.missingDomains,
  };
}