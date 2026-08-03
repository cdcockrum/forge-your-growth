export type CognitiveMemoryStatus =
  | "active"
  | "strengthened"
  | "weakened"
  | "revised"
  | "rejected";

export type CognitiveBeliefSnapshot = {
  id: string;

  statement: string;

  confidence: number;

  strength:
    | "tentative"
    | "developing"
    | "stable";

  status:
    CognitiveMemoryStatus;

  evidenceQuality:
    | "weak"
    | "moderate"
    | "strong";

  recordedAt: string;
};

export type CognitiveAssumptionSnapshot = {
  id: string;

  statement: string;

  status:
    | "unverified"
    | "supported"
    | "rejected";

  recordedAt: string;
};

export type CognitiveRevision = {
  id: string;

  previousBelief: string;

  currentBelief: string;

  explanation: string;

  confidenceBefore: number;

  confidenceAfter: number;

  recordedAt: string;
};

export type CognitiveConfidenceSnapshot = {
  value: number;

  recordedAt: string;
};

export type CognitiveMemorySnapshot = {
  id: string;

  generatedAt: string;

  strongestBelief:
    CognitiveBeliefSnapshot;

  assumptions:
    CognitiveAssumptionSnapshot[];

  confidence:
    CognitiveConfidenceSnapshot;

  revisionConditions: string[];
};

export type CognitiveMemory = {
  current:
    CognitiveMemorySnapshot;

  previous:
    CognitiveMemorySnapshot | null;

  revisions:
    CognitiveRevision[];

  confidenceHistory:
    CognitiveConfidenceSnapshot[];
};