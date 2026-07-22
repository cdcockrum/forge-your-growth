import {
  ForgePipelineDiagnosticsPanel,
  useForgePipelineDiagnostics,
} from "@/features/forge-engine/pipeline";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

export function DeveloperPage() {
  const {
    skills,
    areas,
    todaySessions,
  } = useTodayDashboard();

  const {
    snapshot,
    diagnostics,
  } = useForgePipelineDiagnostics({
    vision: null,
    sessions: todaySessions,
    skills,
    lifeAreas: areas,
    achievements: [],
    review: null,
  });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Developer Mode
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Forge Cognition
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Inspect each stage of Forge&apos;s reasoning
          pipeline and review the raw output produced from
          the current user data.
        </p>
      </header>

      <ForgePipelineDiagnosticsPanel
        diagnostics={diagnostics}
        snapshot={snapshot}
      />
    </main>
  );
}