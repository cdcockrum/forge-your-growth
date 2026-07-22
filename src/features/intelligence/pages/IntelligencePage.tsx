import { Suspense } from "react";

import { ForgePage } from "@/components/forge";

import {
  EvidenceTimeline,
  IntelligenceHero,
  ReasoningSummary,
  RecommendationCard,
} from "@/features/intelligence/components";

import {
  useIntelligence,
} from "@/features/intelligence/hooks";

export function IntelligencePage() {
  return (
    <ForgePage>
      <Suspense fallback={<IntelligenceLoadingState />}>
        <IntelligenceContent />
      </Suspense>
    </ForgePage>
  );
}

function IntelligenceLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-36 animate-pulse rounded-3xl bg-muted" />
      <div className="h-56 animate-pulse rounded-2xl bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function IntelligenceContent() {
  const {
    firstName,
    model,
    highlightedNodeId,
    focusEvidenceNode,
  } = useIntelligence();

  return (
    <div className="space-y-10">
      <IntelligenceHero
        firstName={firstName}
        model={model.hero}
      />

      <EvidenceTimeline
        model={model.evidence}
        highlightedNodeId={highlightedNodeId}
        onSelectRelated={focusEvidenceNode}
      />

      <ReasoningSummary
        model={model.reasoning}
      />

      <RecommendationCard
        model={model.recommendation}
      />
    </div>
  );
}