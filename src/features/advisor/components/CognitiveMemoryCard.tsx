import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  History,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type CognitiveRevision = {
  previousBelief: string;

  currentBelief: string;

  explanation: string;

  confidenceBefore: number;

  confidenceAfter: number;

  recordedAt: string;
};

type CognitiveMemoryCardProps = {
  strongestBelief: string;

  confidence: number;

  status: string;

  revisionCount: number;

  previousBelief:
    | string
    | null;

  previousConfidence:
    | number
    | null;

  confidenceChange:
    | number
    | null;

  lastRevision:
    | CognitiveRevision
    | null;
};

export function CognitiveMemoryCard({
  strongestBelief,
  confidence,
  status,
  revisionCount,
  previousBelief,
  previousConfidence,
  confidenceChange,
  lastRevision,
}: CognitiveMemoryCardProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-border bg-background p-3">
            <BrainCircuit className="size-5 text-accent" />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              Cognitive Memory
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              How Forge’s understanding is evolving
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {strongestBelief}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-border bg-background px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Current status
          </p>

          <p className="mt-1 text-sm font-black uppercase tracking-wider">
            {formatLabel(
              status,
            )}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MemoryMetric
          label="Confidence"
          value={formatPercentage(
            confidence,
          )}
        />

        <MemoryMetric
          label="Previous confidence"
          value={
            previousConfidence === null
              ? "No prior snapshot"
              : formatPercentage(
                  previousConfidence,
                )
          }
        />

        <MemoryMetric
          label="Confidence change"
          value={
            confidenceChange === null
              ? "No comparison yet"
              : formatDelta(
                  confidenceChange,
                )
          }
          direction={
            confidenceChange
          }
        />

        <MemoryMetric
          label="Recorded revisions"
          value={String(
            revisionCount,
          )}
        />
      </div>

      {previousBelief && (
        <section className="mt-6 rounded-2xl border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <History className="size-4 text-accent" />

            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Previous belief
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {previousBelief}
          </p>
        </section>
      )}

      {lastRevision && (
        <section className="mt-4 rounded-2xl border border-border bg-background p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Latest revision
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <BeliefBlock
              label="Previous"
              belief={
                lastRevision.previousBelief
              }
              confidence={
                lastRevision.confidenceBefore
              }
            />

            <ArrowRight className="mx-auto size-4 text-muted-foreground" />

            <BeliefBlock
              label="Current"
              belief={
                lastRevision.currentBelief
              }
              confidence={
                lastRevision.confidenceAfter
              }
            />
          </div>

          <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            {lastRevision.explanation}
          </p>
        </section>
      )}
    </ForgeCard>
  );
}

function MemoryMetric({
  label,
  value,
  direction = null,
}: {
  label: string;

  value: string;

  direction?:
    | number
    | null;
}) {
  const DirectionIcon =
    direction === null ||
    direction === 0
      ? ArrowRight
      : direction > 0
        ? ArrowUpRight
        : ArrowDownRight;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-3 flex items-center gap-2">
        {direction !== null && (
          <DirectionIcon className="size-4 text-accent" />
        )}

        <p className="text-lg font-black tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function BeliefBlock({
  label,
  belief,
  confidence,
}: {
  label: string;

  belief: string;

  confidence: number;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {belief}
      </p>

      <p className="mt-3 text-xs font-semibold">
        {formatPercentage(
          confidence,
        )} confidence
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

function formatDelta(
  value: number,
): string {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  const percentage =
    Math.round(
      normalized * 100,
    );

  return percentage > 0
    ? `+${percentage}%`
    : `${percentage}%`;
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