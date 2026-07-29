import type {
  ConfidenceLevel,
} from "../confidence/confidence.types";

export type AdvisorSection =
  | "insight"
  | "strength"
  | "opportunity"
  | "recommendation";

export type AdvisorItem = {
  id: string;

  section: AdvisorSection;

  title: string;

  body: string[];

  evidenceIds: string[];
};

export type AdvisorBrief = {
  headline: string;

  summary: string;

  overallConfidence: ConfidenceLevel;

  generatedAt: string;

  items: AdvisorItem[];
};