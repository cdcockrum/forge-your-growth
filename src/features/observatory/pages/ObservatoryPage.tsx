import {
  ExecutiveBriefing,
} from "@/features/briefing";

import {
  ChronicleTimeline,
} from "@/features/chronicle";

import {
  ForgeHeatmap,
  ForgeLineChart,
  ForgeScatterChart,
  IdentityTree,
  IdentitySummary,
  IntelligenceDashboard,
  ObservatorySection,
  PatternDiscovery,
} from "../components";

import {
  useObservatory,
} from "../hooks";

export function ObservatoryPage() {
  const {
    forge,
    briefing,
    chronicle,
    model,
    snapshots,
    consistencyHeatmap,
    identityTree,
    isLoading,
    isError,
    error,
  } = useObservatory();

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Loading Observatory…
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-medium text-destructive">
            Unable to load the Observatory
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-16 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Forge Intelligence
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Observatory
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Explore how your momentum,
          consistency, identity, energy,
          and personal growth change
          over time.
        </p>
      </header>

      <section className="space-y-8">
        <ExecutiveBriefing
            briefing={briefing}
        />
      </section>

      <ObservatorySection
        eyebrow="Identity"
        title="Who you are becoming"
        description="Traits, identities, and evidence shaped by your repeated actions."
      >
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <IdentityTree
              model={identityTree}
            />

            <IdentitySummary
              forge={forge}
            />
          </div>

          <ChronicleTimeline
            model={chronicle}
          />
        </div>
      </ObservatorySection>
      <ObservatorySection
        eyebrow="Trends"
        title="How your progress is changing"
        description="Historical signals drawn from daily Forge snapshots."
      >
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ForgeLineChart
              title="Momentum over time"
              description="See whether your recent practice rhythm is rising, stable, or falling."
              data={model.momentum}
              valueLabel="Momentum"
            />

            <ForgeLineChart
              title="Forge Score history"
              description="Track the accumulated evidence of consistent, intentional practice."
              data={model.forgeScore}
              valueLabel="Forge Score"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ForgeLineChart
              title="Completion rate"
              description="The percentage of scheduled sessions completed for each snapshot."
              data={model.completionRate}
              valueLabel="Completion rate"
              valueSuffix="%"
            />

            <ForgeScatterChart
              title="Energy vs completion"
              description="Explore whether reported energy levels correspond with more completed sessions."
              data={model.energyVsCompletion}
              xLabel="Energy"
              yLabel="Completed sessions"
            />
          </div>
        </div>
      </ObservatorySection>

      <ObservatorySection
        eyebrow="Consistency"
        title="When you work best"
        description="Completion patterns by weekday and time of day across the last twelve weeks."
      >
        <ForgeHeatmap
          title="Weekly consistency"
          description="Darker cells indicate stronger completion history."
          data={consistencyHeatmap}
        />
      </ObservatorySection>

      <ObservatorySection
        eyebrow="Discovery"
        title="Patterns Forge found"
        description="Recurring relationships inferred from your practice history."
      >
        <PatternDiscovery
          consistencyHeatmap={consistencyHeatmap}
        />
      </ObservatorySection>
    </main>
  );
}