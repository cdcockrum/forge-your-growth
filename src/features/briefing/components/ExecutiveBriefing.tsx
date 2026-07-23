import type {
  MorningBriefingModel,
} from "../types";

type ExecutiveBriefingProps = {
  briefing: MorningBriefingModel;
};

export function ExecutiveBriefing({
  briefing,
}: ExecutiveBriefingProps) {
  const confidence = Math.max(
    0,
    Math.min(100, briefing.confidence),
  );

  return (
    <section className="overflow-hidden rounded-3xl border bg-card">
      <div className="border-b bg-gradient-to-r from-orange-500/10 via-transparent to-transparent px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Forge Intelligence
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          {briefing.greeting}
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {briefing.summary}
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h3 className="text-lg font-semibold">
            Today&apos;s recommendation
          </h3>

          <p className="mt-3 text-lg leading-relaxed">
            {briefing.recommendation}
          </p>

          <div className="mt-8">
            <h3 className="font-semibold">
              Forge noticed
            </h3>

            {briefing.observations.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {briefing.observations.map(
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
                Forge is still collecting enough evidence
                to identify meaningful observations.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {briefing.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border bg-background p-4"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <p className="text-2xl font-bold sm:text-3xl">
                  {metric.value}
                </p>

                {metric.trend ? (
                  <span className="text-xs capitalize text-muted-foreground">
                    {metric.trend}
                  </span>
                ) : null}
              </div>
            </div>
          ))}

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