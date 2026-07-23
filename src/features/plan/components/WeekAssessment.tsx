import type {
  PlanAssessmentItem,
  WeeklyPlanAssessment,
} from "@/features/forge-engine";

type WeekAssessmentProps = {
  assessment: WeeklyPlanAssessment;
};

export function WeekAssessment({
  assessment,
}: WeekAssessmentProps) {
  return (
    <section className="mb-6 rounded-2xl border border-border bg-surface p-6">
      <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
        <div className="rounded-xl bg-foreground p-5 text-background">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-background/55">
            Plan quality
          </p>

          <p className="mt-3 text-5xl font-extrabold tracking-tight">
            {assessment.score}
          </p>

          <p className="mt-2 text-sm font-semibold">
            {getAssessmentLabel(
              assessment.label,
            )}
          </p>

          <p className="mt-2 text-xs leading-5 text-background/60">
            {assessment.totalSessions}{" "}
            {assessment.totalSessions === 1
              ? "session"
              : "sessions"}{" "}
            ·{" "}
            {formatAssessmentMinutes(
              assessment.totalMinutes,
            )}
          </p>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Week assessment
          </p>

          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
            {getAssessmentHeadline(
              assessment.label,
            )}
          </h2>

          {assessment.items.length > 0 ? (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {assessment.items.map(
                (item) => (
                  <AssessmentItem
                    key={item.id}
                    item={item}
                  />
                ),
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AssessmentItem({
  item,
}: {
  item: PlanAssessmentItem;
}) {
  const toneStyles = {
    positive: {
      marker: "bg-emerald-500",
      label: "Strong",
    },

    attention: {
      marker: "bg-amber-500",
      label: "Review",
    },

    neutral: {
      marker:
        "bg-muted-foreground",
      label: "Note",
    },
  } as const;

  const style =
    toneStyles[item.tone];

  return (
    <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
      <span
        className={`mt-1.5 size-2.5 shrink-0 rounded-full ${style.marker}`}
      />

      <div>
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
          {style.label}
        </p>

        <h3 className="mt-1 text-sm font-bold tracking-tight">
          {item.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function getAssessmentLabel(
  label: WeeklyPlanAssessment["label"],
): string {
  switch (label) {
    case "balanced":
      return "Balanced week";

    case "demanding":
      return "Demanding week";

    case "light":
      return "Light week";

    case "unplanned":
      return "Not planned";
  }
}

function getAssessmentHeadline(
  label: WeeklyPlanAssessment["label"],
): string {
  switch (label) {
    case "balanced":
      return "The week looks sustainable and intentional.";

    case "demanding":
      return "The week may need more recovery or fewer commitments.";

    case "light":
      return "The week leaves room for recovery or additional focus.";

    case "unplanned":
      return "Generate the week to evaluate its balance.";
  }
}

function formatAssessmentMinutes(
  minutes: number,
): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = minutes / 60;

  return Number.isInteger(hours)
    ? `${hours}h`
    : `${hours.toFixed(1)}h`;
}