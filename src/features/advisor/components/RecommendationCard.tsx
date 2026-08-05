import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  LoaderCircle,
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
  recommendationId:
    string | null;

  title: string;

  explanation: string;

  priority:
    RecommendationPriority;

  confidence: number;

  provenance:
    RecommendationExplanation | null;

  lifecycleStatus:
    string | null;

  evaluationDueAt:
    string | null;

  loadingResponse: boolean;

  responding: boolean;

  responseError:
    string | null;

  onTry: () => Promise<void>;

  onDismiss: () => Promise<void>;
};

export function RecommendationCard({
  recommendationId,
  title,
  explanation,
  priority,
  confidence,
  provenance,
  lifecycleStatus,
  evaluationDueAt,
  loadingResponse,
  responding,
  responseError,
  onTry,
  onDismiss,
}: RecommendationCardProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

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

      <RecommendationLifecycleControl
        recommendationId={
          recommendationId
        }
        lifecycleStatus={
          lifecycleStatus
        }
        evaluationDueAt={
          evaluationDueAt
        }
        loadingResponse={
          loadingResponse
        }
        responding={
          responding
        }
        responseError={
          responseError
        }
        onTry={
          onTry
        }
        onDismiss={
          onDismiss
        }
      />

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
    </ForgeCard>
  );
}

function RecommendationLifecycleControl({
  recommendationId,
  lifecycleStatus,
  evaluationDueAt,
  loadingResponse,
  responding,
  responseError,
  onTry,
  onDismiss,
}: {
  recommendationId:
    string | null;

  lifecycleStatus:
    string | null;

  evaluationDueAt:
    string | null;

  loadingResponse: boolean;

  responding: boolean;

  responseError:
    string | null;

  onTry: () => Promise<void>;

  onDismiss: () => Promise<void>;
}) {
  if (!recommendationId) {
    return (
      <div className="mt-7 border-t border-border pt-5">
        <p className="text-sm font-semibold">
          Forge is still forming a specific next step.
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Continue recording practices and reflections so the recommendation can become more specific.
        </p>
      </div>
    );
  }

  if (loadingResponse) {
    return (
      <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" />

        Loading your response…
      </div>
    );
  }

  if (
    lifecycleStatus ===
      "in-progress" ||
    lifecycleStatus ===
      "pending"
  ) {
    return (
      <div className="mt-7 flex items-start gap-3 border-t border-border pt-5">
        <div className="rounded-full bg-accent/10 p-2">
          <Clock3 className="size-4 text-accent" />
        </div>

        <div>
          <p className="text-sm font-semibold">
            You’re trying this recommendation.
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {evaluationDueAt
              ? `Forge will review what changed around ${formatEvaluationDate(
                  evaluationDueAt,
                )}.`
              : "Forge will review what changes after enough evidence accumulates."}
          </p>
        </div>
      </div>
    );
  }

  const reconsidering =
    lifecycleStatus ===
      "dismissed" ||
    lifecycleStatus ===
      "evaluated" ||
    lifecycleStatus ===
      "expired";

  return (
    <div className="mt-7 border-t border-border pt-5">
      {lifecycleStatus ===
        "dismissed" && (
        <p className="mb-4 text-sm text-muted-foreground">
          You chose not to pursue this recommendation.
        </p>
      )}

      {lifecycleStatus ===
        "evaluated" && (
        <p className="mb-4 text-sm text-muted-foreground">
          Forge has reviewed the previous outcome of this recommendation.
        </p>
      )}

      {lifecycleStatus ===
        "expired" && (
        <p className="mb-4 text-sm text-muted-foreground">
          The previous evaluation period ended without enough evidence.
        </p>
      )}

      {responseError && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {responseError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => {
            void onTry().catch(
              () => undefined,
            );
          }}
          disabled={
            responding
          }
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {responding && (
            <LoaderCircle className="size-4 animate-spin" />
          )}

          {reconsidering
            ? "Try it again"
            : "Try this"}
        </button>

        {!reconsidering && (
          <button
            type="button"
            onClick={() => {
              void onDismiss().catch(
                () => undefined,
              );
            }}
            disabled={
              responding
            }
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Not now
          </button>
        )}

        <span className="text-xs leading-5 text-muted-foreground sm:ml-2">
          Forge will not change your plan automatically.
        </span>
      </div>
    </div>
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
  priority:
    RecommendationPriority;
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

function formatEvaluationDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "the end of the evaluation period";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    },
  ).format(date);
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