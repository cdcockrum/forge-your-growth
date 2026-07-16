export type ScoreBreakdown = {
  consistency: number;
  difficulty: number;
  duration: number;
  reflection: number;
  review: number;
  penalties: number;
};

export type ForgeScoreResult = {
  score: number;
  breakdown: ScoreBreakdown;
};