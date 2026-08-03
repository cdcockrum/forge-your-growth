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
  AdvisorExecutiveBriefing,
  AdvisorReasoningPanel,
  AdvisorSimulationPanel,
  AdvisorWisdomPanel,
  AssessmentNarrative,
  BeliefsCard,
  ContradictionCard,
  EvidenceCard,
  PatternCard,
  PredictionCard,
  useAdvisor,
} from "@/features/advisor";

export const Route = createFileRoute(
  "/_authenticated/advisor",
)({
  component:
    AdvisorPage,
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
  const advisor =
    useAdvisor();

  return (
    <div className="space-y-10">
      <AdvisorExecutiveBriefing
        greeting={
          advisor.greeting
        }
        summary={
          advisor.summary
        }
        recommendation={{
          title:
            advisor.recommendation
              .title,

          explanation:
            advisor.recommendation
              .explanation,

          priority:
            advisor.recommendation
              .priority,

          confidence:
            advisor.recommendation
              .confidence,
        }}
      />

      <AdvisorActionsCard
        actions={
          advisor.actions
        }
      />

      <AdvisorReasoningPanel
        confidence={
          advisor.confidenceReasoning
        }
        evidence={
          advisor.evidence
        }
        reasoning={
          advisor.reasoning
        }
      />

      <AdvisorSimulationPanel
        bestCase={
          advisor.simulation
            .bestCase
        }
        expectedCase={
          advisor.simulation
            .expectedCase
        }
        worstCase={
          advisor.simulation
            .worstCase
        }
      />

      <AssessmentNarrative
        narrative={
          advisor.assessment
        }
      />

      <AdvisorWisdomPanel
        narrative={
          advisor.wisdom
            .narrative
        }
        insights={
          advisor.wisdom
            .insights
        }
        longTermThemes={
          advisor.wisdom
            .longTermThemes
        }
        emergingIdentity={
          advisor.wisdom
            .emergingIdentity
        }
        cautions={
          advisor.wisdom
            .cautions
        }
        opportunities={
          advisor.wisdom
            .opportunities
        }
        confidence={
          advisor.wisdom
            .confidence
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
            These are Forge’s strongest current
            conclusions, tensions, recurring signals,
            and likely outcomes.
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
              advisor
                .strongestContradiction
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
      <div className="h-128 animate-pulse rounded-4xl bg-muted motion-reduce:animate-none" />

      <div className="h-48 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

      <div className="h-64 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

      <div className="h-72 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

      <div className="h-48 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

        <div className="h-64 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

        <div className="h-64 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />

        <div className="h-64 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none" />
      </div>
    </div>
  );
}