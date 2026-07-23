export type ForgeEventType =
  | "identity_level"
  | "momentum_shift"
  | "trait_change"
  | "milestone"
  | "recovery"
  | "achievement"
  | "insight";

export type ForgeEventImportance =
  | "low"
  | "medium"
  | "high";

export type ForgeEvent = {
  id: string;
  date: string;
  type: ForgeEventType;
  importance: ForgeEventImportance;
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
};
