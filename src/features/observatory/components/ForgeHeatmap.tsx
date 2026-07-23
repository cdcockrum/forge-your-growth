import type {
  ConsistencyHeatmapCell,
  DayKey,
  Daypart,
} from "../view-models";

type ForgeHeatmapProps = {
  title: string;
  description?: string;
  data: ConsistencyHeatmapCell[];
  emptyMessage?: string;
};

const dayOrder: Array<{
  key: DayKey;
  label: string;
}> = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const daypartOrder: Array<{
  key: Daypart;
  label: string;
}> = [
  {
    key: "morning",
    label: "Morning",
  },
  {
    key: "afternoon",
    label: "Afternoon",
  },
  {
    key: "evening",
    label: "Evening",
  },
  {
    key: "unscheduled",
    label: "No time",
  },
];

function getIntensityClass(
  completionRate: number,
  scheduledSessions: number,
): string {
  if (scheduledSessions === 0) {
    return "bg-muted/30";
  }

  if (completionRate >= 85) {
    return "bg-foreground text-background";
  }

  if (completionRate >= 65) {
    return "bg-foreground/75 text-background";
  }

  if (completionRate >= 40) {
    return "bg-foreground/45 text-foreground";
  }

  if (completionRate > 0) {
    return "bg-foreground/20 text-foreground";
  }

  return "bg-muted text-muted-foreground";
}

export function ForgeHeatmap({
  title,
  description,
  data,
  emptyMessage = "Not enough session history yet.",
}: ForgeHeatmapProps) {
  const hasData = data.some(
    (cell) => cell.scheduledSessions > 0,
  );

  const cellMap = new Map(
    data.map((cell) => [
      `${cell.day}:${cell.daypart}`,
      cell,
    ]),
  );

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <header>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>

      {!hasData ? (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl bg-muted/30 px-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[720px]">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns:
                  "110px repeat(7, minmax(72px, 1fr))",
              }}
            >
              <div />

              {dayOrder.map((day) => (
                <div
                  key={day.key}
                  className="px-2 py-1 text-center text-xs font-medium text-muted-foreground"
                >
                  {day.label}
                </div>
              ))}

              {daypartOrder.map((daypart) => (
                <>
                  <div
                    key={`${daypart.key}-label`}
                    className="flex items-center text-sm font-medium"
                  >
                    {daypart.label}
                  </div>

                  {dayOrder.map((day) => {
                    const cell = cellMap.get(
                      `${day.key}:${daypart.key}`,
                    );

                    if (!cell) {
                      return (
                        <div
                          key={`${day.key}:${daypart.key}`}
                          className="min-h-20 rounded-xl bg-muted/30"
                        />
                      );
                    }

                    return (
                      <div
                        key={`${day.key}:${daypart.key}`}
                        className={[
                          "flex min-h-20 flex-col items-center justify-center rounded-xl px-2 py-3 text-center transition",
                          getIntensityClass(
                            cell.completionRate,
                            cell.scheduledSessions,
                          ),
                        ].join(" ")}
                        title={[
                          `${cell.dayLabel} ${cell.daypartLabel}`,
                          `${cell.completedSessions} of ${cell.scheduledSessions} completed`,
                          `${cell.completionRate}% completion`,
                        ].join(" · ")}
                      >
                        <span className="text-sm font-semibold">
                          {cell.scheduledSessions === 0
                            ? "—"
                            : `${cell.completionRate}%`}
                        </span>

                        {cell.scheduledSessions > 0 ? (
                          <span className="mt-1 text-[11px] opacity-75">
                            {cell.completedSessions}/
                            {cell.scheduledSessions}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasData ? (
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Lower consistency</span>

          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-muted" />
            <span className="h-3 w-3 rounded-sm bg-foreground/20" />
            <span className="h-3 w-3 rounded-sm bg-foreground/45" />
            <span className="h-3 w-3 rounded-sm bg-foreground/75" />
            <span className="h-3 w-3 rounded-sm bg-foreground" />
          </div>

          <span>Higher consistency</span>
        </div>
      ) : null}
    </section>
  );
}