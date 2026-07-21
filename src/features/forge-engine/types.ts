export type ScoreBreakdown = {
  consistency: number;
  difficulty: number;
  duration: number;
  reflection: number;
  review: number;
  penalties: number;
};

/**
 * Accumulating activity points.
 * This score is intentionally not capped.
 */
export type ForgePointsResult = {
  score: number;
  breakdown: ScoreBreakdown;
};

/**
 * Backward-compatible alias for existing code.
 */
export type ForgeScoreResult = ForgePointsResult;

export type ForgeHealthBreakdown = {
  completion: number;
  consistency: number;
  balance: number;
  reflection: number;
  review: number;
};

export type ForgeHealthScoreResult = {
  score: number;
  grade: "Apprentice" | "Builder" | "Craftsman" | "Master";
  breakdown: ForgeHealthBreakdown;
};