import type {
  HistoryEvent,
  HistoryResult,
} from "./history.types";

type BuildHistoryOptions = {
  achievements: {
    id: string;
    title: string;
    earned_at: string;
  }[];

  narrativeTitle?: string;

  northStar?: string | null;
};

export function buildHistory({
  achievements,
  narrativeTitle,
  northStar,
}: BuildHistoryOptions): HistoryResult {

  const events: HistoryEvent[] = [];

  if (northStar) {
    events.push({
      id: "vision",

      occurredAt: new Date().toISOString(),

      type: "vision",

      title: "North Star Defined",

      description: northStar,

      importance: 100,
    });
  }

  for (const achievement of achievements) {
    events.push({
      id: achievement.id,

      occurredAt: achievement.earned_at,

      type: "achievement",

      title: achievement.title,

      description:
        "Achievement unlocked.",

      importance: 80,
    });
  }

  if (narrativeTitle) {
    events.push({
      id: "story",

      occurredAt: new Date().toISOString(),

      type: "story",

      title: narrativeTitle,

      description:
        "Weekly narrative generated.",

      importance: 70,
    });
  }

  events.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() -
      new Date(a.occurredAt).getTime(),
  );

  return {
    events,

    highlights: events
      .filter(
        (event) =>
          event.importance >= 80,
      )
      .slice(0, 5),
  };
}