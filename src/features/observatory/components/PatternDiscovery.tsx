import type {
  ConsistencyHeatmapCell,
} from "../view-models";

type PatternDiscoveryProps = {
  consistencyHeatmap: ConsistencyHeatmapCell[];
};

type DiscoveredPattern = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  evidence: string;
};

function strongestConsistencyWindow(
  cells: ConsistencyHeatmapCell[],
): ConsistencyHeatmapCell | null {
  return (
    [...cells]
      .filter(
        (cell) =>
          cell.scheduledSessions >= 2,
      )
      .sort((a, b) => {
        if (
          b.completionRate !==
          a.completionRate
        ) {
          return (
            b.completionRate -
            a.completionRate
          );
        }

        return (
          b.scheduledSessions -
          a.scheduledSessions
        );
      })[0] ?? null
  );
}

function weakestConsistencyWindow(
  cells: ConsistencyHeatmapCell[],
): ConsistencyHeatmapCell | null {
  return (
    [...cells]
      .filter(
        (cell) =>
          cell.scheduledSessions >= 2,
      )
      .sort((a, b) => {
        if (
          a.completionRate !==
          b.completionRate
        ) {
          return (
            a.completionRate -
            b.completionRate
          );
        }

        return (
          b.scheduledSessions -
          a.scheduledSessions
        );
      })[0] ?? null
  );
}

function buildPatterns(
  consistencyHeatmap: ConsistencyHeatmapCell[],
): DiscoveredPattern[] {
  const results: DiscoveredPattern[] = [];

  const strongest =
    strongestConsistencyWindow(
      consistencyHeatmap,
    );

  if (strongest) {
    results.push({
      id: "strongest-window",

      title:
        `${strongest.dayLabel} ${strongest.daypartLabel} is your strongest window`,

      description:
        `You complete ${strongest.completionRate}% of scheduled practices during this period.`,

      confidence: Math.min(
        95,
        55 +
          strongest.scheduledSessions *
            5,
      ),

      evidence:
        `${strongest.completedSessions} of ${strongest.scheduledSessions} sessions completed`,
    });
  }

  const weakest =
    weakestConsistencyWindow(
      consistencyHeatmap,
    );

  const isDifferentWindow =
    weakest &&
    strongest &&
    (
      weakest.day !== strongest.day ||
      weakest.daypart !==
        strongest.daypart
    );

  if (
    weakest &&
    isDifferentWindow &&
    weakest.completionRate < 50
  ) {
    results.push({
      id: "weakest-window",

      title:
        `${weakest.dayLabel} ${weakest.daypartLabel} may need adjustment`,

      description:
        `This period currently has a ${weakest.completionRate}% completion rate.`,

      confidence: Math.min(
        90,
        50 +
          weakest.scheduledSessions *
            5,
      ),

      evidence:
        `${weakest.completedSessions} of ${weakest.scheduledSessions} sessions completed`,
    });
  }

  const highConsistencyWindows =
    consistencyHeatmap.filter(
      (cell) =>
        cell.scheduledSessions >= 2 &&
        cell.completionRate >= 80,
    );

  if (
    highConsistencyWindows.length >= 2
  ) {
    results.push({
      id: "multiple-strong-windows",

      title:
        "Several reliable practice windows are emerging",

      description:
        `${highConsistencyWindows.length} weekday and time combinations currently have completion rates of at least 80%.`,

      confidence: Math.min(
        92,
        60 +
          highConsistencyWindows.length *
            6,
      ),

      evidence:
        `${highConsistencyWindows.length} strong scheduling windows`,
    });
  }

  const eveningCells =
    consistencyHeatmap.filter(
      (cell) =>
        cell.daypart === "evening" &&
        cell.scheduledSessions > 0,
    );

  const eveningScheduled =
    eveningCells.reduce(
      (total, cell) =>
        total +
        cell.scheduledSessions,
      0,
    );

  const eveningCompleted =
    eveningCells.reduce(
      (total, cell) =>
        total +
        cell.completedSessions,
      0,
    );

  const eveningRate =
    eveningScheduled === 0
      ? 0
      : Math.round(
          (
            eveningCompleted /
            eveningScheduled
          ) * 100,
        );

  if (
    eveningScheduled >= 4 &&
    eveningRate < 50
  ) {
    results.push({
      id: "evening-friction",

      title:
        "Evening practices show recurring friction",

      description:
        `Your overall evening completion rate is currently ${eveningRate}%.`,

      confidence: Math.min(
        90,
        55 +
          eveningScheduled * 4,
      ),

      evidence:
        `${eveningCompleted} of ${eveningScheduled} evening sessions completed`,
    });
  }

  return results
    .sort(
      (a, b) =>
        b.confidence -
        a.confidence,
    )
    .slice(0, 6);
}

export function PatternDiscovery({
  consistencyHeatmap,
}: PatternDiscoveryProps) {
  const discovered =
    buildPatterns(
      consistencyHeatmap,
    );

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Pattern discovery
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Patterns Forge Found
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Recurring relationships
          inferred from your practice
          history.
        </p>
      </header>

      {discovered.length === 0 ? (
        <div className="mt-6 rounded-xl bg-muted/30 p-6 text-sm text-muted-foreground">
          Forge needs more practice
          history before it can
          identify reliable patterns.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {discovered.map(
            (pattern) => (
              <article
                key={pattern.id}
                className="rounded-2xl border bg-background p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {pattern.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {
                        pattern.description
                      }
                    </p>
                  </div>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {
                      pattern.confidence
                    }
                    %
                  </span>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  {pattern.evidence}
                </p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground transition-all"
                    style={{
                      width:
                        `${pattern.confidence}%`,
                    }}
                  />
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}