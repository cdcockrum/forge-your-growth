export type InsightTone =
  | "positive"
  | "attention"
  | "neutral";

export type ProgressInsight = {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
};