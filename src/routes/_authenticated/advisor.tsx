import {
  Suspense,
  useEffect,
  useRef,
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
  AdvisorNarrative,
  AdvisorReasoningPanel,
  AdvisorLearningPanel,
  AdvisorSimulationPanel,
  AdvisorWisdomPanel,
  AssessmentNarrative,
  BeliefsCard,
  ContradictionCard,
  EvidenceCard,
  PatternCard,
  PredictionCard,
  RecommendationCard,
  useAdvisor,
} from "@/features/advisor";

import {
  useDismissAdvisorRecommendation,
  useLatestAdvisorRecommendation,
  useEvaluateDueAdvisorRecommendations,
  useStartAdvisorRecommendation,
} from "@/features/advisor-learning";

import {
  todayIso,
} from "@/features/forge/queries";

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
  const advisor =
    useAdvisor();

  const recommendationId =
    advisor.recommendation.id;

  const latestRecommendation =
    useLatestAdvisorRecommendation(
      recommendationId,
    );

  const startRecommendation =
    useStartAdvisorRecommendation();

  const dismissRecommendation =
    useDismissAdvisorRecommendation();

  const responding =
    startRecommendation.isPending ||
    dismissRecommendation.isPending;

  const responseError =
    mutationErrorMessage(
      startRecommendation.error,
    ) ??
    mutationErrorMessage(
      dismissRecommendation.error,
    );

  const evaluateDueRecommendations =
  useEvaluateDueAdvisorRecommendations();

  const evaluationStarted =
    useRef(false);

  useEffect(() => {
    if (
      evaluationStarted.current
    ) {
      return;
    }

    evaluationStarted.current =
      true;

    void evaluateDueRecommendations
      .mutateAsync({
        currentBeliefs:
          advisor.beliefs.map(
            (belief) => ({
              key:
                belief.id,

              statement:
                belief.statement,

              confidence:
                belief.confidence,
            }),
          ),
      })
      .catch(
        () => {
          // The evaluation will be attempted again
          // the next time Advisor is opened.
        },
      );
  }, [
    advisor.beliefs,
    evaluateDueRecommendations,
  ]);

  async function handleTryRecommendation() {
    if (!recommendationId) {
      return;
    }

    await startRecommendation.mutateAsync({
      recommendationKey:
        recommendationId,

      title:
        advisor.recommendation
          .title,

      explanation:
        advisor.recommendation
          .explanation,

      confidence:
        advisor.recommendation
          .confidence,

      priority:
        advisor.recommendation
          .priority,

      baselineSnapshotDate:
        todayIso(),

      belief:
  advisor.beliefs[0]
    ? {
        key:
          advisor.beliefs[0].id,

        statement:
          advisor.beliefs[0]
            .statement,

        confidence:
          advisor.beliefs[0]
            .confidence,
      }
    : null,
    });
  }

  async function handleDismissRecommendation() {
    if (!recommendationId) {
      return;
    }

    await dismissRecommendation.mutateAsync({
      recommendationKey:
        recommendationId,

      title:
        advisor.recommendation
          .title,

      explanation:
        advisor.recommendation
          .explanation,

      confidence:
        advisor.recommendation
          .confidence,

      priority:
        advisor.recommendation
          .priority,

      baselineSnapshotDate:
        todayIso(),
    });
  }

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
        greeting={
          advisor.greeting
        }
        summary={
          advisor.summary
        }
        confidence={
          advisor.confidence
        }
      />

      <section className="rounded-3xl border border-border bg-card p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          Cognitive Core
        </p>

        <h2 className="mt-2 text-2xl font-black tracking-tight">
          {
            advisor
              .cognitionSummary
              .headline
          }
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          {
            advisor
              .cognitionSummary
              .explanation
          }
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-black">
              {Math.round(
                advisor
                  .cognitionSummary
                  .confidence *
                  100,
              )}
              %
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Evidence
            </p>

            <p className="mt-2 text-2xl font-black">
              {
                advisor
                  .cognitionSummary
                  .evidenceCount
              }
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Learning
            </p>

            <p className="mt-2 text-lg font-black">
              {advisor
                .cognitionSummary
                .isLearning
                ? "Active"
                : "Gathering evidence"}
            </p>
          </div>
        </div>
      </section>

      <AdvisorNarrative
        headline={
          advisor.narrative
            .headline
        }
        narrative={
          advisor.narrative
            .narrative
        }
        confidence={
          advisor.narrative
            .confidence
        }
      />

      <RecommendationCard
        recommendationId={
          recommendationId
        }
        title={
          advisor.recommendation
            .title
        }
        explanation={
          advisor.recommendation
            .explanation
        }
        priority={
          advisor.recommendation
            .priority
        }
        confidence={
          advisor.recommendation
            .confidence
        }
        provenance={
          advisor.recommendation
            .provenance
        }
        lifecycleStatus={
          latestRecommendation
            .data
            ?.lifecycle_status ??
          null
        }
        evaluationDueAt={
          latestRecommendation
            .data
            ?.evaluation_due_at ??
          null
        }
        loadingResponse={
          latestRecommendation
            .isLoading
        }
        responding={
          responding
        }
        responseError={
          responseError
        }
        onTry={
          handleTryRecommendation
        }
        onDismiss={
          handleDismissRecommendation
        }
      />

      <AdvisorActionsCard
        actions={
          advisor.actions
        }
      />

      <AdvisorReasoningPanel
        confidence={
          advisor
            .confidenceReasoning
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



  {advisor.adaptiveLearning ? (
  <AdvisorLearningPanel
    learning={
      advisor.adaptiveLearning
    }
  />
) : (
  <section className="rounded-3xl border border-dashed border-border p-6">
    Adaptive learning is unavailable.
  </section>
)}

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


function mutationErrorMessage(
  error: unknown,
): string | null {
  if (error instanceof Error) {
    return error.message;
  }

  return error
    ? "Forge could not save your response. Please try again."
    : null;
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