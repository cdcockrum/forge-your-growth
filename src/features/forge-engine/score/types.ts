export type ForgeScoreBreakdown = {
  consistency: number;
  completion: number;
  balance: number;
  recovery: number;
  reflection: number;
};

export type ForgeScoreResult = {
  score: number;
  grade: string;
  trend: "up" | "down" | "steady";
  breakdown: ForgeScoreBreakdown;
};