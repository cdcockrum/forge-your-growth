import {
  AdvisorCard,
  InsightCard,
  PatternCard,
} from "../components";

import {
  useInsights,
} from "../hooks";

export function InsightsPage() {
  const {
    advisor,
    insight,
    patterns,
    reflectionsLoading,
    reflectionsError,
  } = useInsights();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Forge Intelligence
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Insights
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Guidance, observations, and recurring patterns
          derived from your recent activity.
        </p>
      </header>

      <AdvisorCard
        title={advisor.title}
        message={advisor.message}
      />

      <InsightCard
        title="Current insight"
        description={insight.summary}
      />

      {reflectionsLoading ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Looking for reflection patterns…
        </div>
      ) : null}

      {reflectionsError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-medium text-destructive">
            Unable to load reflection patterns
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {reflectionsError instanceof Error
              ? reflectionsError.message
              : "An unexpected error occurred."}
          </p>
        </div>
      ) : null}

      {!reflectionsLoading &&
      !reflectionsError &&
      patterns.strongestPattern ? (
        <PatternCard
          pattern={patterns.strongestPattern}
        />
      ) : null}

      {!reflectionsLoading &&
      !reflectionsError &&
      !patterns.strongestPattern ? (
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold">
            Patterns are still forming
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Complete several daily reflections and Forge
            will begin identifying recurring themes.
          </p>
        </div>
      ) : null}
    </main>
  );
}