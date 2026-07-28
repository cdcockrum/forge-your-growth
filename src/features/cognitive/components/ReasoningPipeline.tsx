import {
  ArrowDown,
  CheckCircle2,
  Eye,
  Lightbulb,
  Route,
  Sparkles,
} from "lucide-react";

type ReasoningPipelineProps = {
  observation: string;
  pattern: string;
  interpretation: string;
  confidence: number;
  recommendation: string;
};

type PipelineStepProps = {
  label: string;
  value: string;
  icon: typeof Eye;
};

export function ReasoningPipeline({
  observation,
  pattern,
  interpretation,
  confidence,
  recommendation,
}: ReasoningPipelineProps) {
  return (
    <section className="space-y-5">
      <header>
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Explainable reasoning
        </p>

        <h3 className="mt-2 text-lg font-black tracking-tight">
          How Forge reached this conclusion
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Forge separates observation from interpretation so you can
          inspect how the current conclusion was formed.
        </p>
      </header>

      <div className="rounded-3xl border border-border bg-background p-5">
        <PipelineStep
          label="Observation"
          value={observation}
          icon={Eye}
        />

        <PipelineConnector />

        <PipelineStep
          label="Pattern"
          value={pattern}
          icon={Route}
        />

        <PipelineConnector />

        <PipelineStep
          label="Interpretation"
          value={interpretation}
          icon={Lightbulb}
        />

        <PipelineConnector />

        <ConfidenceStep
          confidence={confidence}
        />

        <PipelineConnector />

        <PipelineStep
          label="Recommended response"
          value={recommendation}
          icon={CheckCircle2}
        />
      </div>
    </section>
  );
}

function PipelineStep({
  label,
  value,
  icon: Icon,
}: PipelineStepProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/30">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>

        <p className="mt-2 text-sm leading-6">
          {value}
        </p>
      </div>
    </div>
  );
}

function ConfidenceStep({
  confidence,
}: {
  confidence: number;
}) {
  const normalizedConfidence =
    normalizeConfidence(confidence);

  const language =
    confidenceLanguage(normalizedConfidence);

  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/30">
        <Sparkles className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Confidence
          </p>

          <span className="text-xs font-bold">
            {normalizedConfidence}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{
              width: `${normalizedConfidence}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm font-semibold">
          {language.label}
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {language.explanation}
        </p>
      </div>
    </div>
  );
}

function PipelineConnector() {
  return (
    <div
      aria-hidden="true"
      className="flex h-9 items-center pl-3"
    >
      <ArrowDown className="size-4 text-muted-foreground" />
    </div>
  );
}

function normalizeConfidence(
  confidence: number,
): number {
  if (!Number.isFinite(confidence)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(confidence),
    ),
  );
}

function confidenceLanguage(
  confidence: number,
): {
  label: string;
  explanation: string;
} {
  if (confidence >= 90) {
    return {
      label: "Strongly supported",
      explanation:
        "The available evidence consistently supports this conclusion across multiple signals.",
    };
  }

  if (confidence >= 70) {
    return {
      label: "Well supported",
      explanation:
        "Several observations point in the same direction, though future evidence may refine the conclusion.",
    };
  }

  if (confidence >= 50) {
    return {
      label: "Emerging",
      explanation:
        "The current evidence suggests this possibility, but additional observations would improve confidence.",
    };
  }

  return {
    label: "Limited",
    explanation:
      "Forge does not yet have enough consistent evidence to treat this conclusion as reliable.",
  };
}