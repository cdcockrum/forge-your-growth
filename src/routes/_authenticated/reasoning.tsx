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
  PageHeader,
} from "@/components/forge/app-shell";

import {
  AdvisorCognitionSummary,
  AdvisorReflectionPanel,
  CalibrationCard,
  CognitiveMemoryCard,
  ReasoningOverviewCard,
} from "@/features/advisor/components";

import {
  buildAdvisorViewModel,
} from "@/features/advisor/services/advisorViewModel";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

export const Route = createFileRoute(
  "/_authenticated/reasoning",
)({
  component:
    ReasoningPage,
});

function ReasoningPage() {
  return (
    <ForgePage>
      <Suspense
        fallback={
          <ReasoningLoadingState />
        }
      >
        <ReasoningContent />
      </Suspense>
    </ForgePage>
  );
}

function ReasoningLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-36 animate-pulse rounded-3xl bg-muted" />

      <div className="h-56 animate-pulse rounded-3xl bg-muted" />

      <div className="h-72 animate-pulse rounded-3xl bg-muted" />

      <div className="h-80 animate-pulse rounded-3xl bg-muted" />

      <div className="h-96 animate-pulse rounded-3xl bg-muted" />
    </div>
  );
}

function ReasoningContent() {
  const {
    forge,
  } = useTodayDashboard();

  const advisor =
    buildAdvisorViewModel(
      forge,
    );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reasoning Explorer"
        title={
          <>
            Understand how Forge{" "}
            <span className="text-accent">
              thinks
            </span>
            .
          </>
        }
      />

      <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
        Inspect the evidence, assumptions,
        uncertainties, memory, calibration, and
        reasoning behind Forge’s current conclusions.
        This page explains the analysis without
        interrupting the action-focused Advisor
        experience.
      </p>

      <AdvisorCognitionSummary
        overallConfidence={
          advisor.cognition
            .summary
            .overallConfidence
        }
        evidenceQuality={
          advisor.cognition
            .summary
            .evidenceQuality
        }
        calibration={
          advisor.cognition
            .summary
            .calibration
        }
        strongestBelief={
          advisor.cognition
            .summary
            .strongestBelief
        }
        memoryStatus={
          advisor.cognition
            .memory
            .status
        }
      />

      <CognitiveMemoryCard
        strongestBelief={
          advisor.cognition
            .memory
            .strongestBelief
        }
        confidence={
          advisor.cognition
            .memory
            .confidence
        }
        status={
          advisor.cognition
            .memory
            .status
        }
        revisionCount={
          advisor.cognition
            .memory
            .revisionCount
        }
        previousBelief={
          advisor.cognition
            .memory
            .previousBelief
        }
        previousConfidence={
          advisor.cognition
            .memory
            .previousConfidence
        }
        confidenceChange={
          advisor.cognition
            .memory
            .confidenceChange
        }
        lastRevision={
          advisor.cognition
            .memory
            .lastRevision
        }
      />

      <CalibrationCard
        calibration={
          advisor.cognition
            .calibration
            .calibration
        }
        averageAccuracy={
          advisor.cognition
            .calibration
            .averageAccuracy
        }
        averageConfidence={
          advisor.cognition
            .calibration
            .averageConfidence
        }
        confidenceBias={
          advisor.cognition
            .calibration
            .confidenceBias
        }
        evidenceReliability={
          advisor.cognition
            .calibration
            .evidenceReliability
        }
        evidenceCoverage={
          advisor.cognition
            .calibration
            .evidenceCoverage
        }
        contradictionRate={
          advisor.cognition
            .calibration
            .contradictionRate
        }
        revisionRate={
          advisor.cognition
            .calibration
            .revisionRate
        }
        predictionCount={
          advisor.cognition
            .calibration
            .predictionCount
        }
        resolvedPredictionCount={
          advisor.cognition
            .calibration
            .resolvedPredictionCount
        }
        recommendation={
          advisor.cognition
            .calibration
            .recommendation
        }
      />

      <ReasoningOverviewCard
        evidenceCount={
          advisor.cognition
            .reasoning
            .evidenceCount
        }
        graphNodeCount={
          advisor.cognition
            .reasoning
            .graphNodeCount
        }
        graphEdgeCount={
          advisor.cognition
            .reasoning
            .graphEdgeCount
        }
        hypothesisCount={
          advisor.cognition
            .reasoning
            .hypothesisCount
        }
        contradictionCount={
          advisor.cognition
            .reasoning
            .contradictionCount
        }
        gapCount={
          advisor.cognition
            .reasoning
            .gapCount
        }
        assumptionCount={
          advisor.cognition
            .reasoning
            .assumptionCount
        }
        uncertaintyCount={
          advisor.cognition
            .reasoning
            .uncertaintyCount
        }
        interpretationConfidence={
          advisor.cognition
            .reasoning
            .interpretationConfidence
        }
        consistencyScore={
          advisor.cognition
            .reasoning
            .consistencyScore
        }
        strongestHypothesis={
          advisor.cognition
            .reasoning
            .strongestHypothesis
        }
        strongestInterpretation={
          advisor.cognition
            .reasoning
            .strongestInterpretation
        }
      />

      <AdvisorReflectionPanel
        confidenceStatement={
          advisor.reflection
            .confidenceStatement
        }
        assumptions={
          advisor.reflection
            .assumptions
        }
        uncertainties={
          advisor.reflection
            .uncertainties
        }
        alternativeInterpretations={
          advisor.reflection
            .alternativeInterpretations
        }
        additionalEvidenceNeeded={
          advisor.reflection
            .additionalEvidenceNeeded
        }
      />
    </div>
  );
}