import type {
  PracticeSession,
} from "@/features/forge/types";

export type DayKey =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export type Daypart =
  | "morning"
  | "afternoon"
  | "evening"
  | "unscheduled";

export type ConsistencyHeatmapCell = {
  day: DayKey;
  dayLabel: string;
  daypart: Daypart;
  daypartLabel: string;
  scheduledSessions: number;
  completedSessions: number;
  completionRate: number;
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

function getDayKey(
  scheduledDate: string,
): DayKey | null {
  const date = new Date(
    `${scheduledDate}T12:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const day = date.getDay();

  const map: Record<number, DayKey> = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };

  return map[day] ?? null;
}

function getDaypart(
  scheduledTime: string | null,
): Daypart {
  if (!scheduledTime) {
    return "unscheduled";
  }

  const hour = Number(
    scheduledTime.split(":")[0],
  );

  if (Number.isNaN(hour)) {
    return "unscheduled";
  }

  if (hour < 12) {
    return "morning";
  }

  if (hour < 17) {
    return "afternoon";
  }

  return "evening";
}

function isCompleted(
  session: PracticeSession,
): boolean {
  return (
    session.completed === true ||
    session.status === "completed"
  );
}

export function buildConsistencyHeatmap(
  sessions: PracticeSession[],
): ConsistencyHeatmapCell[] {
  const cells =
    dayOrder.flatMap((day) =>
      daypartOrder.map(
        (daypart) => ({
          day: day.key,
          dayLabel: day.label,
          daypart: daypart.key,
          daypartLabel:
            daypart.label,
          scheduledSessions: 0,
          completedSessions: 0,
          completionRate: 0,
        }),
      ),
    );

  const cellMap = new Map(
    cells.map((cell) => [
      `${cell.day}:${cell.daypart}`,
      cell,
    ]),
  );

  for (const session of sessions) {
    const day = getDayKey(
      session.scheduled_date,
    );

    if (!day) {
      continue;
    }

    const daypart = getDaypart(
      session.scheduled_time,
    );

    const key = `${day}:${daypart}`;
    const cell = cellMap.get(key);

    if (!cell) {
      continue;
    }

    cell.scheduledSessions += 1;

    if (isCompleted(session)) {
      cell.completedSessions += 1;
    }
  }

  for (const cell of cells) {
    cell.completionRate =
      cell.scheduledSessions === 0
        ? 0
        : Math.round(
            (cell.completedSessions /
              cell.scheduledSessions) *
              100,
          );
  }

  return cells;
}