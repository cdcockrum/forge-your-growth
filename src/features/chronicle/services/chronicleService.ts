import type {
  ForgeEvent,
} from "@/features/forge-engine/events";

import type {
  ChronicleDay,
  ChronicleViewModel,
} from "../types";

function formatDateLabel(
  dateValue: string,
): string {
  const date = new Date(
    `${dateValue.slice(0, 10)}T12:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(
    today.getDate() - 1,
  );

  const iso = date
    .toISOString()
    .slice(0, 10);

  const todayIso = today
    .toISOString()
    .slice(0, 10);

  const yesterdayIso = yesterday
    .toISOString()
    .slice(0, 10);

  if (iso === todayIso) {
    return "Today";
  }

  if (iso === yesterdayIso) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "long",
      day: "numeric",
      year:
        date.getFullYear() ===
        today.getFullYear()
          ? undefined
          : "numeric",
    },
  ).format(date);
}

function eventDate(
  event: ForgeEvent,
): string {
  return event.date.slice(0, 10);
}

export function buildChronicleViewModel(
  events: ForgeEvent[],
): ChronicleViewModel {
  const sortedEvents = [...events].sort(
    (a, b) =>
      b.date.localeCompare(a.date),
  );

  const grouped = new Map<
    string,
    ForgeEvent[]
  >();

  for (const event of sortedEvents) {
    const date = eventDate(event);

    const current =
      grouped.get(date) ?? [];

    current.push(event);

    grouped.set(date, current);
  }

  const days: ChronicleDay[] = [
    ...grouped.entries(),
  ].map(([date, dayEvents]) => ({
    date,
    label: formatDateLabel(date),
    events: dayEvents,
  }));

  return {
    days,
    totalEvents: sortedEvents.length,
    latestEvent:
      sortedEvents[0] ?? null,
  };
}