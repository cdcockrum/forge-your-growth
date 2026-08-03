import {
  BrainCircuit,
  Database,
  Gauge,
  ShieldCheck,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type AdvisorCognitionSummaryProps = {
  overallConfidence: number;

  evidenceQuality: string;

  calibration: string;

  strongestBelief: string;

  memoryStatus: string;
};

export function AdvisorCognitionSummary({
  overallConfidence,
  evidenceQuality,
  calibration,
  strongestBelief,
  memoryStatus,
}: AdvisorCognitionSummaryProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-border bg-background p-3">
          <BrainCircuit className="size-5 text-accent" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Forge Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Current cognitive state
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {strongestBelief}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={Gauge}
          label="Overall confidence"
          value={formatPercentage(
            overallConfidence,
          )}
        />

        <Metric
          icon={ShieldCheck}
          label="Evidence quality"
          value={formatLabel(
            evidenceQuality,
          )}
        />

        <Metric
          icon={BrainCircuit}
          label="Calibration"
          value={formatLabel(
            calibration,
          )}
        />

        <Metric
          icon={Database}
          label="Memory"
          value={formatLabel(
            memoryStatus,
          )}
        />
      </div>
    </ForgeCard>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BrainCircuit;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-accent" />

        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-3 text-lg font-black tracking-tight">
        {value}
      </p>
    </div>
  );
}

function formatPercentage(
  value: number,
): string {
  const normalized =
    value > 1
      ? value / 100
      : value;

  return `${Math.round(
    Math.max(
      0,
      Math.min(
        normalized,
        1,
      ),
    ) * 100,
  )}%`;
}

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll(
      "-",
      " ",
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}