export function TodayLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      <div className="h-36 animate-pulse rounded-2xl bg-muted" />

      <div className="h-72 animate-pulse rounded-3xl bg-muted" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          {Array.from(
            { length: 3 },
            (_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-muted"
              />
            ),
          )}
        </div>

        <div className="space-y-4">
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}