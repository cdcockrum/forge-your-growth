export type TrendDirection =
  | "improving"
  | "declining"
  | "stable"
  | "insufficient-data";

export type TrendMetric = {
  current: number;
  previous: number;
  change: number;
  percentChange: number | null;
  direction: TrendDirection;
};

export type PracticeTrendAnalysis = {
  generatedAt: string;
  currentPeriod: {
    start: string;
    end: string;
  };
  previousPeriod: {
    start: string;
    end: string;
  };
  scheduledSessions: TrendMetric;
  completedSessions: TrendMetric;
  completionRate: TrendMetric;
  reflectedSessions: TrendMetric;
  reflectionRate: TrendMetric;
  overallDirection: TrendDirection;
  confidence: number;
  evidenceCount: number;
};