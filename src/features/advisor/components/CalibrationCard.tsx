import {
  Activity,
  Gauge,
  ShieldCheck,
  Target,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type CalibrationCardProps = {
  calibration: string;

  averageAccuracy: number;

  averageConfidence: number;

  confidenceBias: number;

  evidenceReliability: string;

  evidenceCoverage: number;

  contradictionRate: number;

  revisionRate: number;

  predictionCount: number;

  resolvedPredictionCount: number;

  recommendation: string;
};

export function CalibrationCard({
  calibration,
  averageAccuracy,
  averageConfidence,
  confidenceBias,
  evidenceReliability,
  evidenceCoverage,
  contradictionRate,
  revisionRate,
  predictionCount,
  resolvedPredictionCount,
  recommendation,
}: CalibrationCardProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-border bg-background p-3">
            <Gauge className="size-5 text-accent" />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              Calibration
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              How much Forge should trust itself
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {recommendation}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-border bg-background px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Current state
          </p>

          <p className="mt-1 text-sm font-black uppercase tracking-wider">
            {formatLabel(
              calibration,
            )}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CalibrationMetric
          icon={Target}
          label="Prediction accuracy"
          value={
            resolvedPredictionCount === 0
              ? "No resolved predictions"
              : formatPercentage(
                  averageAccuracy,
                )
          }
        />

        <CalibrationMetric
          icon={Gauge}
          label="Average confidence"
          value={
            resolvedPredictionCount === 0
              ? "Not calibrated yet"
              : formatPercentage(
                  averageConfidence,
                )
          }
        />

        <CalibrationMetric
          icon={Activity}
          label="Confidence bias"
          value={
            resolvedPredictionCount === 0
              ? "No outcome history"
              : formatBias(
                  confidenceBias,
                )
          }
        />

        <CalibrationMetric
          icon={ShieldCheck}
          label="Evidence reliability"
          value={formatLabel(
            evidenceReliability,
          )}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CalibrationMetric
          icon={ShieldCheck}
          label="Evidence coverage"
          value={formatPercentage(
            evidenceCoverage,
          )}
        />

        <CalibrationMetric
          icon={Activity}
          label="Negative evidence rate"
          value={formatPercentage(
            contradictionRate,
          )}
        />

        <CalibrationMetric
          icon={Activity}
          label="Revision rate"
          value={formatPercentage(
            revisionRate,
          )}
        />

        <CalibrationMetric
          icon={Target}
          label="Predictions tracked"
          value={`${resolvedPredictionCount} of ${predictionCount} resolved`}
        />
      </div>
    </ForgeCard>
  );
}

function CalibrationMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;

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
    Math.abs(value) > 1
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

function formatBias(
  value: number,
): string {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  if (
    Math.abs(normalized) <= 0.1
  ) {
    return "Well aligned";
  }

  if (normalized > 0) {
    return `${Math.round(
      normalized * 100,
    )}% overconfident`;
  }

  return `${Math.round(
    Math.abs(normalized) * 100,
  )}% underconfident`;
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