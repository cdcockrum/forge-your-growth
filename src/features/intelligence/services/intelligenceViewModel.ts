import type {
  ForgeState,
} from "@/features/forge-engine";

export type IntelligenceViewModel = {
  hero: {
    title: string;
    summary: string;
    confidence: number;
  };

  evidence: {
    nodes: ForgeState["evidence"]["nodes"];
  };

  reasoning: {
    items: string[];
  };

  recommendation: {
    title: string;
    text: string;
  };
};

export function buildIntelligenceViewModel(
  forge: ForgeState,
): IntelligenceViewModel {
  return {
    hero: {
      title: forge.intelligence.title,
      summary: forge.intelligence.summary,
      confidence:
        forge.intelligence.confidence,
    },

    evidence: {
      nodes: forge.evidence.nodes,
    },

    reasoning: {
      items:
        forge.intelligence.reasoning,
    },

    recommendation: {
      title: "What to do next",
      text:
        forge.intelligence.recommendation,
    },
  };
}