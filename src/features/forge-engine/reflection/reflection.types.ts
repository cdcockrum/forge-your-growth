export type ReflectionLevel =
  | "low"
  | "medium"
  | "high";

export type FocusLevel =
  | "poor"
  | "good"
  | "excellent";

export type ReflectionEntry = {
  id?: string;
  reflectionDate: string;

  energy: ReflectionLevel;
  focus: FocusLevel;
  stress: ReflectionLevel;

  proudOf: string;
  obstacle: string;
  lesson: string;
  nextStep: string;
};

export type ReflectionSummary = {
  energy: ReflectionLevel;
  focus: FocusLevel;
  stress: ReflectionLevel;

  strengths: string[];
  obstacles: string[];
  lessons: string[];
  nextSteps: string[];

  headline: string;
  recommendation: string;
};