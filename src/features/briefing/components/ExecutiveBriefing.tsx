import type {
  DailyBriefing,
} from "@/features/forge-engine/briefing";

type ExecutiveBriefingProps = {
  briefing: DailyBriefing;
};

export function ExecutiveBriefing({
  briefing,
}: ExecutiveBriefingProps) {
  const confidence = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        briefing.confidence <= 1
          ? briefing.confidence * 100
          : briefing.confidence,
      ),
    ),
  );

  const observations = [
    ...briefing.strengths.map(
      (strength) =>
        strength.description,
    ),

    ...briefing.watchItems.map(
      (item) =>
        item.description,
    ),

    ...briefing.priorities.map(
      (priority) =>
        priority.reason,
    ),
  ].slice(0, 4);

  return (
    <section className="overflow-hidden rounded-3xl border bg-card">
      <div className="border-b bg-gradient-to-r from-orange-500/10 via-transparent to-transparent px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Forge Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          {briefing.greeting}
        </h2>

        <h3 className="mt-5 text-xl font-bold tracking-tight">
          {briefing.headline}
        </h3>

        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {briefing.summary}
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h3 className="text-lg font-semibold">
            Today&apos;s recommendation
          </h3>

          {briefing.recommendedAction ? (
            <>
              <p className="mt-3 text-lg font-semibold leading-relaxed">
                {briefing.recommendedAction.title}
              </p>

              <p className="mt-2 leading-relaxed text-muted-foreground">
                {briefing.recommendedAction.description}
              </p>
            </>
          ) : (
            <p className="mt-3 text-muted-foreground">
              Complete one meaningful practice so Forge can form a more specific recommendation.
            </p>
          )}

          <div className="mt-8">
            <h3 className="font-semibold">
              Forge noticed
            </h3>

            {observations.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {observations.map(
                  (item, index) => (
                    <li
                      key={`${index}:${item}`}
                      className="flex gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 text-muted-foreground"
                      >
                        •
                      </span>

                      <span className="text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Forge is still collecting enough evidence to identify meaningful observations.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Priorities"
            value={briefing.priorities.length}
          />

          <MetricCard
            label="Strengths"
            value={briefing.strengths.length}
          />

          <MetricCard
            label="Watch items"
            value={briefing.watchItems.length}
          />

          <div className="rounded-xl border bg-background p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>

            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              {confidence}%
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-700"
                style={{
                  width: `${confidence}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold sm:text-3xl">
        {value}
      </p>
    </div>
  );
}