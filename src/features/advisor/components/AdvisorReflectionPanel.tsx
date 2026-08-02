import {
  AlertTriangle,
  Brain,
  CircleHelp,
  Lightbulb,
  Search,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type AdvisorReflectionPanelProps = {
  confidenceStatement: string;

  assumptions: string[];

  uncertainties: string[];

  alternativeInterpretations: string[];

  additionalEvidenceNeeded: string[];
};

export function AdvisorReflectionPanel({
  confidenceStatement,
  assumptions,
  uncertainties,
  alternativeInterpretations,
  additionalEvidenceNeeded,
}: AdvisorReflectionPanelProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-border bg-background p-3">
          <Brain className="size-5 text-accent" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Reflection
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            How Forge is questioning its own conclusion
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {confidenceStatement}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <ReflectionSection
          icon={Lightbulb}
          title="Assumptions"
          values={assumptions}
          emptyMessage="Forge is not relying on any strong assumptions yet."
        />

        <ReflectionSection
          icon={AlertTriangle}
          title="Uncertainties"
          values={uncertainties}
          emptyMessage="No major uncertainty has been identified."
        />

        <ReflectionSection
          icon={CircleHelp}
          title="Alternative interpretations"
          values={alternativeInterpretations}
          emptyMessage="No credible alternative interpretation is currently strong enough to surface."
        />

        <ReflectionSection
          icon={Search}
          title="Evidence still needed"
          values={additionalEvidenceNeeded}
          emptyMessage="Forge does not currently require additional evidence for this judgment."
        />
      </div>
    </ForgeCard>
  );
}

function ReflectionSection({
  icon: Icon,
  title,
  values,
  emptyMessage,
}: {
  icon: typeof Brain;

  title: string;

  values: string[];

  emptyMessage: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-accent" />

        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </p>
      </div>

      {values.length > 0 ? (
        <div className="mt-3 space-y-2">
          {values.map((value) => (
            <p
              key={value}
              className="text-sm leading-6 text-muted-foreground"
            >
              {value}
            </p>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}