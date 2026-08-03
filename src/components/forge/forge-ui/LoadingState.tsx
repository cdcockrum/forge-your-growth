type LoadingStateProps = {
  title?: string;

  description?: string;

  cards?: number;

  compact?: boolean;

  className?: string;
};

export function LoadingState({
  title = "Preparing Forge",
  description =
    "Gathering the latest information and building your current view.",
  cards = 3,
  compact = false,
  className = "",
}: LoadingStateProps) {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className={[
        "space-y-6",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "rounded-3xl border border-border bg-card",
          compact
            ? "p-5"
            : "p-6 sm:p-8",
        ].join(" ")}
      >
        <div className="flex items-start gap-4">
          <SkeletonBlock className="size-11 shrink-0 rounded-2xl" />

          <div className="min-w-0 flex-1">
            <p className="sr-only">
              {title}. {description}
            </p>

            <SkeletonBlock className="h-3 w-28 rounded-full" />

            <SkeletonBlock className="mt-4 h-7 w-full max-w-md rounded-xl" />

            <SkeletonBlock className="mt-3 h-4 w-full max-w-2xl rounded-lg" />

            <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-xl rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length:
            Math.max(
              cards,
              1,
            ),
        }).map(
          (_, index) => (
            <LoadingCard
              key={index}
              compact={compact}
            />
          ),
        )}
      </div>
    </section>
  );
}

function LoadingCard({
  compact,
}: {
  compact: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-border bg-card",
        compact
          ? "p-5"
          : "p-6",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <SkeletonBlock className="size-10 shrink-0 rounded-2xl" />

        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-3 w-24 rounded-full" />

          <SkeletonBlock className="mt-3 h-5 w-3/4 rounded-lg" />
        </div>
      </div>

      <SkeletonBlock className="mt-6 h-4 w-full rounded-lg" />

      <SkeletonBlock className="mt-2 h-4 w-5/6 rounded-lg" />

      <SkeletonBlock className="mt-6 h-10 w-full rounded-xl" />
    </div>
  );
}

function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse bg-muted",
        "motion-reduce:animate-none",
        className,
      ].join(" ")}
    />
  );
}