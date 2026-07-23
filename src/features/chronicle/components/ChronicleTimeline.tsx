import type {
  ChronicleViewModel,
} from "../types";

import {
  ChronicleEvent,
} from "./ChronicleEvent";

type ChronicleTimelineProps = {
  model: ChronicleViewModel;
};

export function ChronicleTimeline({
  model,
}: ChronicleTimelineProps) {
  if (model.days.length === 0) {
    return (
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Forge Chronicle
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Significant changes and milestones
          will appear here as Forge gathers
          more evidence.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Growth history
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Forge Chronicle
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {model.totalEvents} meaningful events
          recorded.
        </p>
      </header>

      <div className="space-y-8">
        {model.days.map((day) => (
          <div
            key={day.date}
            className="grid gap-4 lg:grid-cols-[140px_1fr]"
          >
            <div>
              <p className="sticky top-6 text-sm font-semibold">
                {day.label}
              </p>
            </div>

            <div className="relative space-y-4 border-l pl-6">
              {day.events.map((event) => (
                <div
                  key={event.id}
                  className="relative"
                >
                  <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full border-2 border-background bg-foreground" />

                  <ChronicleEvent
                    event={event}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}