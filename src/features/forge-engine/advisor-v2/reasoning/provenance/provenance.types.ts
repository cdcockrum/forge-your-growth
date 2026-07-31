export interface RecommendationProvenance {
  /**
   * IDs of hypotheses that directly
   * produced this recommendation.
   */
  hypothesisIds: string[];

  /**
   * Evidence supporting those hypotheses.
   */
  evidenceIds: string[];

  /**
   * Conflicts that reduced confidence.
   */
  conflictIds: string[];

  /**
   * Gaps preventing stronger conclusions.
   */
  gapIds: string[];

  /**
   * Human-readable explanation.
   */
  explanation: string;
}