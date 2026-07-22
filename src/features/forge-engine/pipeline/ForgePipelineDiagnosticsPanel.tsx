import type {
  ForgePipelineSnapshot,
} from "./forgePipeline";

import type {
  ForgePipelineDiagnostics,
  PipelineStageStatus,
} from "./pipelineDiagnostics";

type ForgePipelineDiagnosticsPanelProps = {
  diagnostics: ForgePipelineDiagnostics;
  snapshot: ForgePipelineSnapshot;
};

function StageCard({
  stage,
  value,
}: {
  stage: PipelineStageStatus;
  value: unknown;
}) {
  return (
    <details className="rounded-xl border bg-background p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <p className="font-medium">{stage.label}</p>

          <p className="text-sm text-muted-foreground">
            {stage.outputCount} outputs
          </p>
        </div>

        <span
          className={[
            "rounded-full px-2.5 py-1 text-xs font-medium",
            stage.completed
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive",
          ].join(" ")}
        >
          {stage.completed ? "Complete" : "Incomplete"}
        </span>
      </summary>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Outputs
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {stage.outputs.map((output) => (
              <span
                key={output}
                className="rounded-full border px-2.5 py-1 text-xs"
              >
                {output}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Raw stage data
          </p>

          <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      </div>
    </details>
  );
}

export function ForgePipelineDiagnosticsPanel({
  diagnostics,
  snapshot,
}: ForgePipelineDiagnosticsPanelProps) {
  const stageValues = {
    observation: snapshot.observation,
    interpretation: snapshot.interpretation,
    context: snapshot.context,
    reasoning: snapshot.reasoning,
    explanation: snapshot.explanation,
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">
              Forge Pipeline
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {diagnostics.completedStages} of{" "}
              {diagnostics.totalStages} stages complete
            </p>
          </div>

          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-medium",
              diagnostics.completed
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
            ].join(" ")}
          >
            {diagnostics.completed
              ? "Healthy"
              : "Needs attention"}
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-foreground transition-all"
            style={{
              width: `${
                diagnostics.totalStages === 0
                  ? 0
                  : (diagnostics.completedStages /
                      diagnostics.totalStages) *
                    100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {diagnostics.stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            value={stageValues[stage.id]}
          />
        ))}
      </div>
    </section>
  );
}