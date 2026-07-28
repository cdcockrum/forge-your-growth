export type PredictionTimeframe =
  | "today"
  | "week"
  | "month";

export type PredictionCategory =
  | "momentum"
  | "consistency"
  | "recovery"
  | "identity"
  | "practice";

export type ForgePrediction = {
  id: string;

  title: string;

  description: string;

  category: PredictionCategory;

  confidence: number;

  timeframe: PredictionTimeframe;

  evidence: string[];

  recommendation: string;
};

export type PredictionResult = {
  predictions: ForgePrediction[];

  strongest: ForgePrediction | null;

  confidence: number;
};