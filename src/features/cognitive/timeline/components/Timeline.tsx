import type {
  CognitiveTimeline as CognitiveTimelineData,
} from "../timeline.types";

import {
  TimelineItem,
} from "./TimelineItem";

type TimelineProps = {
  timeline: CognitiveTimelineData;
};

export function Timeline({
  timeline,
}: TimelineProps) {
  if (timeline.events.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-6 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Cognitive Timeline
        </p>

        <h3 className="mt-3 text-lg font-black tracking-tight">
          No supporting history yet
        </h3>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          As Forge accumulates practices, reflections, memories,
          and other evidence, the events shaping this conclusion
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <header>
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Cognitive Timeline
        </p>

        <h3 className="mt-2 text-lg font-black tracking-tight">
          How this conclusion emerged
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          These events represent the observations and experiences
          that contributed to Forge&apos;s current understanding.
        </p>
      </header>

      <div className="relative space-y-0 pl-7">
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-[11px] top-3 w-px bg-border"
        />

        {timeline.events.map(
          (event) => (
            <TimelineItem
              key={event.id}
              event={event}
            />
          ),
        )}
      </div>

      {timeline.interpretation && (
        <div className="rounded-2xl border border-border bg-muted/30 p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Forge Interpretation
          </p>

          <p className="mt-3 text-sm leading-7">
            {timeline.interpretation}
          </p>
        </div>
      )}
    </section>
  );
}