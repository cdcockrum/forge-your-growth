import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  ForgeCard,
} from "@/components/forge";

type RecommendationPriority =
  | "low"
  | "medium"
  | "high";

type RecommendationExplanation = {
  explanation: string;

  evidence: string[];

  hypotheses: string[];

  conflicts: string[];

  gaps: string[];
};

type RecommendationCardProps = {
  title: string;

  explanation: string;

  priority: RecommendationPriority;

  confidence: number;

  provenance:
    RecommendationExplanation | null;
};

export function RecommendationCard({
  title,
  explanation,
  priority,
  confidence,
  provenance,
}: RecommendationCardProps) {
  const [expanded, setExpanded] =
    useState(false);

  const hasProvenance =
    provenance !== null;

  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Primary Recommendation
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {explanation}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <ConfidenceBadge
            confidence={
              confidence
            }
          />

          <PriorityBadge
            priority={
              priority
            }
          />
        </div>
      </div>

      {hasProvenance && (
        <div className="mt-7 border-t border-border pt-5">
          <button
            type="button"
            onClick={() =>
              setExpanded(
                (current) =>
                  !current,
              )
            }
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={
              expanded
            }
            aria-controls="recommendation-provenance"
          >
            <span className="text-sm font-semibold">
              Why this recommendation?
            </span>

            {expanded ? (
              <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            )}
          </button>

          {expanded && (
            <div id="recommendation-provenance">
              <ProvenanceDetails
                provenance={
                  provenance
                }
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-sm font-semibold">
        <ArrowUpRight className="size-4" />

        Highest-leverage next step
      </div>
    </ForgeCard>
  );
}

function ProvenanceDetails({
  provenance,
}: {
  provenance:
    RecommendationExplanation;
}) {
  return (
    <div className="mt-5 space-y-6 rounded-2xl bg-muted/40 p-4 md:p-5">
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          Forge’s reasoning
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {provenance.explanation}
        </p>
      </div>

      <ReferenceSection
        title="Supporting evidence"
        values={
          provenance.evidence
        }
        emptyMessage="No specific supporting evidence is available yet."
      />

      <ReferenceSection
        title="Contributing interpretation"
        values={
          provenance.hypotheses
        }
        emptyMessage="Forge has not identified a strong interpretation yet."
      />

      {provenance.conflicts.length >
        0 && (
        <ReferenceSection
          title="Conflicting evidence"
          values={
            provenance.conflicts
          }
          emptyMessage="No conflicting evidence was identified."
        />
      )}

      {provenance.gaps.length >
        0 && (
        <ReferenceSection
          title="Evidence gaps"
          values={
            provenance.gaps
          }
          emptyMessage="No important evidence gaps were identified."
        />
      )}
    </div>
  );
}

function ReferenceSection({
  title,
  values,
  emptyMessage,
}: {
  title: string;

  values: string[];

  emptyMessage: string;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </p>

      {values.length > 0 ? (
        <div className="mt-2 space-y-2">
          {values.map(
            (value) => (
              <div
                key={value}
                className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
              >
                <Check className="mt-1 size-3.5 shrink-0 text-accent" />

                <span>
                  {value}
                </span>
              </div>
            ),
          )}
        </div>
      ) : (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: number;
}) {
  const percentage =
    Math.round(
      normalizeConfidence(
        confidence,
      ) * 100,
    );

  return (
    <div className="min-w-24 rounded-2xl border border-border bg-background px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Confidence
      </p>

      <p className="mt-1 text-sm font-black uppercase tracking-wider">
        {percentage}%
      </p>
    </div>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: RecommendationPriority;
}) {
  return (
    <div className="min-w-24 rounded-2xl border border-border bg-background px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Priority
      </p>

      <p className="mt-1 text-sm font-black uppercase tracking-wider">
        {priority}
      </p>
    </div>
  );
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}