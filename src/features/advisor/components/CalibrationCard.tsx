import {
  Activity,
  Gauge,
  ShieldCheck,
  Target,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

import {
  MetricCard,
  MetricGrid,
} from "@/components/forge/forge-ui";

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

      <MetricGrid
        columns={4}
        className="mt-7"
      >
        <MetricCard
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

        <MetricCard
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

        <MetricCard
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

        <MetricCard
          icon={ShieldCheck}
          label="Evidence reliability"
          value={formatLabel(
            evidenceReliability,
          )}
          emphasis={reliabilityEmphasis(
            evidenceReliability,
          )}
        />
      </MetricGrid>

      <MetricGrid
        columns={4}
        className="mt-4"
      >
        <MetricCard
          icon={ShieldCheck}
          label="Evidence coverage"
          value={formatPercentage(
            evidenceCoverage,
          )}
          emphasis={scoreEmphasis(
            evidenceCoverage,
          )}
        />

        <MetricCard
          icon={Activity}
          label="Negative evidence rate"
          value={formatPercentage(
            contradictionRate,
          )}
          emphasis={inverseScoreEmphasis(
            contradictionRate,
          )}
        />

        <MetricCard
          icon={Activity}
          label="Revision rate"
          value={formatPercentage(
            revisionRate,
          )}
        />

        <MetricCard
          icon={Target}
          label="Predictions tracked"
          value={`${resolvedPredictionCount} of ${predictionCount} resolved`}
        />
      </MetricGrid>
    </ForgeCard>
  );
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}

function formatPercentage(
  value: number,
): string {
  return `${Math.round(
    normalizeScore(
      value,
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

function reliabilityEmphasis(
  value: string,
):
  | "default"
  | "positive"
  | "warning" {
  const normalized =
    value
      .trim()
      .toLowerCase();

  if (
    normalized === "high" ||
    normalized === "strong"
  ) {
    return "positive";
  }

  if (
    normalized === "low" ||
    normalized === "weak"
  ) {
    return "warning";
  }

  return "default";
}

function scoreEmphasis(
  value: number,
):
  | "default"
  | "positive"
  | "warning" {
  const normalized =
    normalizeScore(
      value,
    );

  if (normalized >= 0.75) {
    return "positive";
  }

  if (normalized < 0.4) {
    return "warning";
  }

  return "default";
}

function inverseScoreEmphasis(
  value: number,
):
  | "default"
  | "positive"
  | "warning" {
  const normalized =
    normalizeScore(
      value,
    );

  if (normalized <= 0.15) {
    return "positive";
  }

  if (normalized >= 0.4) {
    return "warning";
  }

  return "default";
}