import type {
  TimelineEvent,
} from "../timeline.types";

type TimelineItemProps = {
  event: TimelineEvent;
};

export function TimelineItem({
  event,
}: TimelineItemProps) {
  const formattedDate =
    formatTimelineDate(event.date);

  return (
    <article className="relative pb-7">
      <div
        aria-hidden="true"
        className="absolute -left-7 top-1.5 size-3 rounded-full border-2 border-background bg-foreground"
      />

      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {formattedDate}
      </p>

      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        {event.source}
      </p>

      <h4 className="mt-2 text-sm font-black tracking-tight">
        {event.title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {event.description}
      </p>

      {event.confidence !== undefined && (
        <p className="mt-3 text-xs text-muted-foreground">
          Confidence: {event.confidence}%
        </p>
      )}
    </article>
  );
}

function formatTimelineDate(
  date: string,
): string {
  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(parsedDate);
}