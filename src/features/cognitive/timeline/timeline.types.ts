export type TimelineSource =
  | "practice"
  | "reflection"
  | "memory"
  | "belief"
  | "identity"
  | "pattern"
  | "prediction"
  | "recommendation";

export type TimelineEvent = {
  id: string;

  date: string;

  title: string;

  description: string;

  source: TimelineSource;

  confidence?: number;

  metadata?: Record<string, string>;
};

export type CognitiveTimeline = {
  events: TimelineEvent[];

  interpretation?: string;
};