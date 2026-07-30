import type {
  AdvisorEvidence,
} from "../advisor.types";

export interface Observation {
  id: string;

  /**
   * The underlying pattern that was detected.
   * Never shown directly to the user.
   */
  pattern: ObservationPattern;

  /**
   * Structured explanation of what the pattern suggests.
   */
  interpretation: string;

  /**
   * Why Forge believes this observation.
   */
  evidence: AdvisorEvidence[];

  /**
   * Possible consequences if the pattern continues.
   */
  implications: string[];

  /**
   * Constructive options.
   */
  recommendations: string[];

  /**
   * Confidence in the interpretation.
   */
  confidence: number;

  /**
   * Importance relative to other observations.
   */
  importance: number;
}

export type ObservationPattern =
  | "momentum_slowing"
  | "momentum_strengthening"
  | "identity_strengthening"
  | "identity_stable"
  | "vision_alignment"
  | "vision_drift"
  | "practice_compounding"
  | "practice_interrupting"
  | "recovery_beginning"
  | "plateau_forming"
  | "evidence_mixed"
  | "insufficient_evidence";