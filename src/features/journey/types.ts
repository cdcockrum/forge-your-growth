export type JourneyEventType =
  | "practice"
  | "reflection"
  | "achievement"
  | "memory";

export type JourneyEvent = {
  id: string;

  type: JourneyEventType;

  occurredAt: string;

  title: string;

  summary: string;

  confidence?: number;

  evidence?: string[];

  icon?: string;
};