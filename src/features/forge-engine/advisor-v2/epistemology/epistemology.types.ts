
export type EvidenceQuality =
  | "weak"
  | "moderate"
  | "strong";

export type BeliefStrength =
  | "tentative"
  | "developing"
  | "stable";

export type EpistemologyResult = {
  strongestBelief: string;

  beliefStrength: BeliefStrength;

  evidenceQuality: EvidenceQuality;

  assumptions: string[];

  uncertainties: string[];

  missingEvidence: string[];

  couldChangeMyMind: string[];

  confidenceNarrative: string;
};