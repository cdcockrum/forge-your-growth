export type BriefingMetric = {
  label: string;
  value: string;
  trend?: "up" | "down" | "stable";
};

export type MorningBriefingModel = {
  greeting: string;
  summary: string;
  metrics: BriefingMetric[];
  observations: string[];
  recommendation: string;
  confidence: number;
};