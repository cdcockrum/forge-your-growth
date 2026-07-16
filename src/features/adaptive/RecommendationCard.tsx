import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import {
  DAYS,
  DAY_LABELS,
} from "@/features/forge/types";
import type { SkillAdaptation } from "@/features/forge-engine";

type RecommendationCardProps = {
  adaptation: SkillAdaptation;
  applying: boolean;
  onApply: () => Promise<void>;
};

export function RecommendationCard({
  adaptation,
  applying,
  onApply,
}: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const recommendationChanged =
    !sameDays(
      adaptation.currentPreferredDays,
      adaptation.recommendedDays,
    );

  return (
    <article className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-accent" />

            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Forge recommendation
            </p>
          </div>

          <h3 className="mt-3 text-xl font-extrabold tracking-tight">
            {adaptation.skillName}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {formatConfidence(adaptation.confidence)} confidence
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-expanded={expanded}
          aria-label={
            expanded
              ? "Hide recommendation details"
              : "Show recommendation details"
          }
        >
          {expanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DayGroup
          label="Current"
          days={adaptation.currentPreferredDays}
        />

        <DayGroup
          label="Recommended"
          days={adaptation.recommendedDays}
          emphasized
        />
      </div>

      {expanded && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Why Forge recommends this
          </p>

          <div className="mt-3 space-y-2">
            {adaptation.reasons.map((reason) => (
              <div
                key={reason}
                className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
              >
                <Check className="mt-1 size-3.5 shrink-0 text-accent" />
                <p>{reason}</p>
              </div>
            ))}
          </div>

          {adaptation.dayPerformance.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Observed performance
              </p>

              {adaptation.dayPerformance.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs"
                >
                  <span className="font-semibold">
                    {DAY_LABELS[day.day]}
                  </span>

                  <span className="text-muted-foreground">
                    {day.completedSessions}/
                    {day.scheduledSessions} completed ·{" "}
                    {day.completionRate}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs leading-5 text-muted-foreground">
          {recommendationChanged
            ? "Forge will update this skill’s preferred practice days."
            : "Your current schedule already matches the observed pattern."}
        </p>

        <button
          type="button"
          onClick={onApply}
          disabled={
            applying ||
            !recommendationChanged ||
            adaptation.confidence === "low"
          }
          className="shrink-0 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {applying
            ? "Applying..."
            : recommendationChanged
              ? "Apply"
              : "Already aligned"}
        </button>
      </div>
    </article>
  );
}

function DayGroup({
  label,
  days,
  emphasized = false,
}: {
  label: string;
  days: string[];
  emphasized?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {DAYS.map((day) => {
          const active = days.includes(day);

          return (
            <span
              key={day}
              className={`rounded-md px-2 py-1 font-mono text-[9px] uppercase ${
                active
                  ? emphasized
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground text-background"
                  : "bg-muted text-muted-foreground opacity-45"
              }`}
            >
              {DAY_LABELS[day]}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function formatConfidence(
  confidence: SkillAdaptation["confidence"],
): string {
  return (
    confidence.charAt(0).toUpperCase() +
    confidence.slice(1)
  );
}

function sameDays(
  first: string[],
  second: string[],
): boolean {
  if (first.length !== second.length) {
    return false;
  }

  return first.every(
    (day, index) => day === second[index],
  );
}