import {
  BrainCircuit,
  Database,
  Gauge,
  ShieldCheck,
} from "lucide-react";

import {
  InsightCard,
  MetricCard,
  StatusBadge,
  MetricGrid,
} from "@/components/forge/forge-ui";

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
    <InsightCard
      eyebrow="Forge Intelligence"
      title="Current cognitive state"
      description={strongestBelief}
      icon={BrainCircuit}
      action={
        <StatusBadge
          label={memoryStatus}
          tone={memoryTone(
            memoryStatus,
          )}
        />
      }
    >
      <MetricGrid columns={4}>
  <MetricCard
    icon={Gauge}
    label="Overall confidence"
    value={formatPercentage(
      overallConfidence,
    )}
    emphasis={confidenceEmphasis(
      overallConfidence,
    )}
  />

  <MetricCard
    icon={ShieldCheck}
    label="Evidence quality"
    value={formatLabel(
      evidenceQuality,
    )}
    emphasis={evidenceEmphasis(
      evidenceQuality,
    )}
  />

  <MetricCard
    icon={BrainCircuit}
    label="Calibration"
    value={formatLabel(
      calibration,
    )}
    emphasis={calibrationEmphasis(
      calibration,
    )}
  />

  <MetricCard
    icon={Database}
    label="Memory"
    value={formatLabel(
      memoryStatus,
    )}
    emphasis={memoryEmphasis(
      memoryStatus,
    )}
  />
</MetricGrid>
    </InsightCard>
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

function confidenceEmphasis(
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

  if (normalized < 0.45) {
    return "warning";
  }

  return "default";
}

function evidenceEmphasis(
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
    normalized === "strong" ||
    normalized === "high"
  ) {
    return "positive";
  }

  if (
    normalized === "weak" ||
    normalized === "low"
  ) {
    return "warning";
  }

  return "default";
}

function calibrationEmphasis(
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
    normalized ===
    "well-calibrated"
  ) {
    return "positive";
  }

  if (
    normalized ===
      "overconfident" ||
    normalized ===
      "underconfident"
  ) {
    return "warning";
  }

  return "default";
}

function memoryEmphasis(
  value: string,
):
  | "default"
  | "positive"
  | "warning"
  | "critical" {
  const normalized =
    value
      .trim()
      .toLowerCase();

  if (
    normalized ===
      "strengthened" ||
    normalized ===
      "stable"
  ) {
    return "positive";
  }

  if (
    normalized ===
      "weakened" ||
    normalized ===
      "revised"
  ) {
    return "warning";
  }

  if (
    normalized ===
    "rejected"
  ) {
    return "critical";
  }

  return "default";
}

function memoryTone(
  value: string,
):
  | "neutral"
  | "positive"
  | "warning"
  | "critical" {
  const emphasis =
    memoryEmphasis(
      value,
    );

  if (
    emphasis === "positive"
  ) {
    return "positive";
  }

  if (
    emphasis === "warning"
  ) {
    return "warning";
  }

  if (
    emphasis === "critical"
  ) {
    return "critical";
  }

  return "neutral";
}