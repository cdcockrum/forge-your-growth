import type {
  ReasoningResult,
} from "../../reasoning/reasoning.types";

type ReasoningInspectorProps = {
  reasoning: ReasoningResult;
};

type InspectorSectionProps = {
  title: string;
  value: unknown;
  defaultOpen?: boolean;
};

function InspectorSection({
  title,
  value,
  defaultOpen = false,
}: InspectorSectionProps) {
  return (
    <details
      className="overflow-hidden rounded-xl border bg-background"
      open={defaultOpen}
    >
      <summary className="cursor-pointer px-4 py-3 font-medium">
        {title}
      </summary>

      <div className="border-t bg-muted/30 p-4">
        <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </details>
  );
}

export function ReasoningInspector({
  reasoning,
}: ReasoningInspectorProps) {
  return (
    <section className="space-y-4">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          Developer Tool
        </p>

        <h1 className="text-2xl font-semibold tracking-tight">
          Advisor Reasoning Inspector
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Inspect each stage of the Advisor V2 reasoning pipeline.
        </p>
      </header>

      <div className="grid gap-3">
        <InspectorSection
          title="Evidence Graph"
          value={reasoning.graph}
        />

        <InspectorSection
          title="Evidence Weights"
          value={reasoning.weights}
        />

        <InspectorSection
          title="Relationship Analysis"
          value={reasoning.analysis}
        />

        <InspectorSection
          title="Conflicts"
          value={reasoning.conflicts}
        />

        <InspectorSection
          title="Hypotheses"
          value={reasoning.hypotheses}
        />

        <InspectorSection
          title="Evaluation"
          value={reasoning.evaluation}
        />

        <InspectorSection
          title="Interpretation"
          value={reasoning.interpretation}
          defaultOpen
        />

        <InspectorSection
          title="Recommendations"
          value={reasoning.recommendations}
          defaultOpen
        />

        <InspectorSection
          title="Reasoning Trace"
          value={reasoning.trace}
        />

        <InspectorSection
          title="Complete Reasoning Result"
          value={reasoning}
        />
      </div>
    </section>
  );
}