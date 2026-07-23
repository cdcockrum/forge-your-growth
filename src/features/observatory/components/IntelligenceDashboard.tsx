import type {
  ForgeState,
} from "@/features/forge-engine";

type IntelligenceDashboardProps = {
  forge: ForgeState;
  recordedDays: number;
};

function formatLabel(
  value: string,
): string {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function IntelligenceDashboard({
  forge,
  recordedDays,
}: IntelligenceDashboardProps) {
  const strongestIdentity =
    forge.identity.strongestIdentity;

  const dominantTrait =
    forge.traits.dominantTrait;

  const cards = [
    {
      label: "Forge Score",
      value:
        forge.forgeScore.score.toFixed(0),
      detail: `${recordedDays} recorded ${
        recordedDays === 1
          ? "day"
          : "days"
      }`,
    },
    {
      label: "Momentum",
      value: formatLabel(
        forge.momentum.direction,
      ),
      detail: `${formatLabel(
        forge.momentum.burnoutRisk,
      )} burnout risk`,
    },
    {
      label: "Dominant Identity",
      value:
        strongestIdentity
          ?.identity.name ??
        "Emerging",
      detail: strongestIdentity
        ? `Level ${strongestIdentity.level}`
        : "Complete more practices",
    },
    {
      label: "Dominant Trait",
      value: dominantTrait
        ? formatLabel(
            dominantTrait.trait,
          )
        : "Emerging",
      detail: dominantTrait
        ? `${dominantTrait.evidence} supporting sessions`
        : "Evidence is still forming",
    },
  ];

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Current state
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Intelligence Dashboard
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A concise view of your current performance,
          momentum, and developing identity.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border bg-background p-5"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-tight">
              {card.value}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {card.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Completion
          </p>

          <p className="mt-2 text-xl font-semibold">
            {Math.round(
              forge.progress.completionRate,
            )}
            %
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {forge.progress.completedSessions} of{" "}
            {forge.progress.scheduledSessions} scheduled
            sessions completed.
          </p>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Current streak
          </p>

          <p className="mt-2 text-xl font-semibold">
            {forge.progress.currentStreak}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Longest recorded streak:{" "}
            {forge.progress.longestStreak}.
          </p>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Recovery
          </p>

          <p className="mt-2 text-xl font-semibold">
            {forge.momentum.recovery.toFixed(0)}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {forge.coach.headline}
          </p>
        </div>
      </div>
    </section>
  );
}