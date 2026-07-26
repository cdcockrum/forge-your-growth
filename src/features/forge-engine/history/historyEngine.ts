import type {
  HistoryEvent,
  HistoryResult,
} from "./history.types";

type HistoryMemory = {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  importance:
    | "minor"
    | "normal"
    | "major"
    | "permanent";
  confidence?: number;
  evidence?: string[];
  metadata?: Record<string, unknown>;
};

type BuildHistoryOptions = {
  achievements: {
    id: string;
    title: string;
    earned_at: string;
  }[];

  narrativeTitle?: string;

  northStar?: string | null;

  memories?: HistoryMemory[];
};

export function buildHistory({
  achievements,
  narrativeTitle,
  northStar,
  memories = [],
}: BuildHistoryOptions): HistoryResult {
  const events: HistoryEvent[] = [];

  if (northStar?.trim()) {
    events.push({
      id: "vision",

      occurredAt:
        new Date().toISOString(),

      type: "vision",

      title:
        "North Star Defined",

      description:
        northStar.trim(),

      importance: 100,
    });
  }

  for (
    const achievement
    of achievements
  ) {
    events.push({
      id:
        achievement.id,

      occurredAt:
        achievement.earned_at,

      type:
        "achievement",

      title:
        achievement.title,

      description:
        "Achievement unlocked.",

      importance: 80,
    });
  }

  for (
    const memory
    of memories
  ) {
    events.push({
      id:
        memory.id,

      occurredAt:
        memory.createdAt,

      type:
        "memory",

      title:
        memory.title,

      description:
        memory.summary,

      importance:
        memoryImportanceToNumber(
          memory.importance,
        ),

      metadata: {
        confidence:
          memory.confidence,

        evidence:
          memory.evidence ??
          [],

        ...memory.metadata,
      },
    });
  }

  if (
    narrativeTitle?.trim()
  ) {
    events.push({
      id: "story",

      occurredAt:
        new Date().toISOString(),

      type: "story",

      title:
        narrativeTitle.trim(),

      description:
        "Weekly narrative generated.",

      importance: 70,
    });
  }

  const uniqueEvents =
    deduplicateEvents(
      events,
    );

  uniqueEvents.sort(
    (
      first,
      second,
    ) =>
      new Date(
        second.occurredAt,
      ).getTime() -
      new Date(
        first.occurredAt,
      ).getTime(),
  );

  return {
    events:
      uniqueEvents,

    highlights:
      uniqueEvents
        .filter(
          (event) =>
            event.importance >=
            80,
        )
        .slice(0, 5),
  };
}

function memoryImportanceToNumber(
  importance:
    HistoryMemory["importance"],
): number {
  switch (importance) {
    case "permanent":
      return 100;

    case "major":
      return 85;

    case "normal":
      return 65;

    case "minor":
      return 40;
  }
}

function deduplicateEvents(
  events: HistoryEvent[],
): HistoryEvent[] {
  const seen =
    new Set<string>();

  return events.filter(
    (event) => {
      const key = [
        event.type,
        event.id,
        event.occurredAt,
      ].join(":");

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}