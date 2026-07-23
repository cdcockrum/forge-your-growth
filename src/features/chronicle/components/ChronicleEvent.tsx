import type {
  ForgeEvent,
} from "@/features/forge-engine/events";

type ChronicleEventProps = {
  event: ForgeEvent;
};

function eventLabel(
  type: ForgeEvent["type"],
): string {
  return type
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function ChronicleEvent({
  event,
}: ChronicleEventProps) {
  return (
    <article className="relative rounded-2xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {eventLabel(event.type)}
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            {event.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>

        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
          {event.importance}
        </span>
      </div>

      {event.evidence.length > 0 ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium">
            View evidence
          </summary>

          <ul className="mt-3 space-y-2">
            {event.evidence.map(
              (evidence) => (
                <li
                  key={evidence}
                  className="text-sm text-muted-foreground"
                >
                  {evidence}
                </li>
              ),
            )}
          </ul>
        </details>
      ) : null}

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Confidence</span>
          <span>
            {event.confidence}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  event.confidence,
                ),
              )}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}