export type TrendPoint = {
  date: string;
  value: number;
};

export type ScatterPoint = {
  x: number;
  y: number;
};

export type ObservatoryViewModel = {
  momentum: TrendPoint[];

  forgeScore: TrendPoint[];

  completionRate: TrendPoint[];

  energyVsCompletion: ScatterPoint[];
};