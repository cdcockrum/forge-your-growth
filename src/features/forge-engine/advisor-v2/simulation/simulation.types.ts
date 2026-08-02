export type Simulation = {
  scenarios: Scenario[];

  bestCase: Scenario;

  expectedCase: Scenario;

  worstCase: Scenario;
};

export type Scenario = {
  id: string;

  title: string;

  description: string;

  probability: number;

  projectedConfidence: number;

  trajectory: Trajectory;

  recommendations: string[];
};

export type Trajectory =
  | "accelerating"
  | "steady"
  | "plateau"
  | "declining"
  | "uncertain";