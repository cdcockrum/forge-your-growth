import {
  Suspense,
} from "react";

import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  ForgePage,
} from "@/components/forge";

import {
  AdvisorActionsCard,
  AdvisorExecutiveSummary,
  AdvisorReasoningPanel,
  AssessmentNarrative,
  BeliefsCard,
  ContradictionCard,
  EvidenceCard,
  PatternCard,
  PredictionCard,
  RecommendationCard,
  useAdvisor,
} from "@/features/advisor";

export const Route = createFileRoute(
  "/_authenticated/advisor",
)({
  component: AdvisorPage,
});

function AdvisorPage() {
  return (
    <ForgePage>
      <Suspense
        fallback={
          <AdvisorLoadingState />
        }
      >
        <AdvisorContent />
      </Suspense>
    </ForgePage>
  );
}

function AdvisorContent() {
  const advisor = useAdvisor();

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Personal Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
          Advisor
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          A focused briefing based on your current direction,
          behavior, identity, patterns, and evidence.
        </p>
      </header>

      <AdvisorExecutiveSummary
        greeting={advisor.greeting}
        summary={advisor.summary}
        confidence={advisor.confidence}
      />

      <RecommendationCard
        title={
          advisor.recommendation.title
        }
        explanation={
          advisor.recommendation.explanation
        }
        priority={
          advisor.recommendation.priority
        }
        confidence={
          advisor.recommendation.confidence
        }
        provenance={
          advisor.recommendation.provenance
        }
      />

      <AdvisorActionsCard
        actions={
          advisor.actions
        }
      />

      <AdvisorReasoningPanel
        confidence={advisor.confidenceReasoning}
        evidence={advisor.evidence}
        reasoning={advisor.reasoning}
      />

    

      <AssessmentNarrative
        narrative={
          advisor.assessment
        }
      />

      <section className="space-y-6">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Strategic Assessment
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            What Forge understands
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            These are Forge’s strongest current conclusions,
            tensions, recurring signals, and likely outcomes.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <BeliefsCard
            beliefs={
              advisor.beliefs
            }
          />

          <ContradictionCard
            contradiction={
              advisor.strongestContradiction
            }
          />

          <PatternCard
            pattern={
              advisor.pattern
            }
          />

          <PredictionCard
            prediction={
              advisor.prediction
            }
          />
        </div>
      </section>

      <EvidenceCard
        evidence={
          advisor.evidence
        }
      />
    </div>
  );
}

function AdvisorLoadingState() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />

        <div className="h-12 w-64 animate-pulse rounded-2xl bg-muted" />

        <div className="h-6 max-w-2xl animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="h-64 animate-pulse rounded-3xl bg-muted" />

      <div className="h-56 animate-pulse rounded-3xl bg-muted" />

      <div className="h-48 animate-pulse rounded-3xl bg-muted" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-muted" />

        <div className="h-64 animate-pulse rounded-3xl bg-muted" />

        <div className="h-64 animate-pulse rounded-3xl bg-muted" />

        <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
    </div>
  );
}