export type NarrativeTheme =
  | "identity"
  | "momentum"
  | "vision"
  | "growth"
  | "consistency"
  | "risk";

export type NarrativeState =
  | "strengthening"
  | "steady"
  | "slowing"
  | "uncertain";

export type NarrativeConfidence =
  | "low"
  | "medium"
  | "high";

export interface Narrative {
  primaryTheme: NarrativeTheme;

  primaryState: NarrativeState;

  secondaryTheme?: NarrativeTheme;

  confidence: NarrativeConfidence;

  recommendation: string;
}