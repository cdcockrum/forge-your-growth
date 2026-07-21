export type HistoryEventType =
  | "vision"
  | "identity"
  | "practice"
  | "achievement"
  | "story"
  | "coach"
  | "reflection";

export type HistoryEvent = {
  id: string;

  occurredAt: string;

  type: HistoryEventType;

  title: string;

  description: string;

  importance: number;

  metadata?: Record<string, unknown>;
};

export type HistoryResult = {
  events: HistoryEvent[];

  highlights: HistoryEvent[];
};