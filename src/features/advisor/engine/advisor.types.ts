export type AdvisorInsightType =
  | "success"
  | "warning"
  | "opportunity"
  | "pattern";

export type AdvisorInsight = {
  id: string;
  type: AdvisorInsightType;

  title: string;
  description: string;

  confidence: number;

  evidence: string[];

  priority: number;
};

export type AdvisorRecommendation = {
  id: string;

  title: string;

  description: string;

  reason: string;

  impact:
    | "low"
    | "medium"
    | "high";

  effort:
    | "low"
    | "medium"
    | "high";
};

export type AdvisorSummary = {
  greeting: string;

  overview: string;

  insights: AdvisorInsight[];

  recommendations:
    AdvisorRecommendation[];
};