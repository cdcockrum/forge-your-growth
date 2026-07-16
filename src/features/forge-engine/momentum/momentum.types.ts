export type MomentumDirection =
  | "rising"
  | "stable"
  | "falling";

export type BurnoutRisk =
  | "low"
  | "moderate"
  | "high";

export type MomentumResult = {
  score: number;

  direction: MomentumDirection;

  burnoutRisk: BurnoutRisk;

  consistency: number;

  recovery: number;

  adherence: number;

  message: string;
};