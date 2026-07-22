import { Suspense } from "react";

import {
  ForgeBadge,
  ForgeConfidence,
  ForgePage,
  ForgeSection,
} from "@/components/forge";

import {
  EvidenceCard,
} from "@/features/intelligence/components";

import {
  useIntelligence,
} from "@/features/intelligence/hooks";

export function IntelligencePage() {
  return (
    <ForgePage>
      <Suspense
        fallback={
          <IntelligenceLoadingState />
        }
      >
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

  const evidenceNodes =
    model.evidence.nodes;

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Forge Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
          What Forge understands.
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {firstName}, this conclusion
          combines your progress,
          momentum, identity, memory,
          history, narrative, advisor,
          and Vision.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ForgeBadge>
            Today&apos;s conclusion
          </ForgeBadge>

          <ForgeConfidence
            value={
              model.hero.confidence
            }
          />
        </div>

        <h2 className="mt-6 max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
          {model.hero.title}
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
          {model.hero.summary}
        </p>
      </section>

      <ForgeSection
        eyebrow="Reasoning"
        title="How Forge reached this conclusion"
        description="Each observation contributes evidence toward today’s recommendation."
      >
        {evidenceNodes.length > 0 ? (
          <div className="space-y-5">
            {evidenceNodes.map(
              (node, index) => (
                <EvidenceCard
                  key={node.id}
                  node={node}
                  nodes={evidenceNodes}
                  isLast={
                    index ===
                    evidenceNodes.length - 1
                  }
                  highlighted={
                    highlightedNodeId ===
                    node.id
                  }
                  onSelectRelated={
                    focusEvidenceNode
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-6">
            <p className="font-semibold">
              Forge needs more evidence.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Complete practices and
              continue using Forge so it
              can build a clearer
              reasoning chain.
            </p>
          </div>
        )}
      </ForgeSection>

      <ForgeSection
        eyebrow="Reasoning summary"
        title="Signals Forge considered"
      >
        <div className="space-y-3">
          {model.reasoning.items.map(
            (reason) => (
              <div
                key={reason}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <p className="text-sm leading-7 text-muted-foreground">
                  {reason}
                </p>
              </div>
            ),
          )}
        </div>
      </ForgeSection>

      <ForgeSection
        eyebrow="Recommendation"
        title={
          model.recommendation.title
        }
      >
        <div className="rounded-3xl bg-foreground p-6 text-background md:p-8">
          <p className="text-2xl font-black leading-snug tracking-tight md:text-3xl">
            {
              model.recommendation
                .text
            }
          </p>
        </div>
      </ForgeSection>
    </div>
  );
}