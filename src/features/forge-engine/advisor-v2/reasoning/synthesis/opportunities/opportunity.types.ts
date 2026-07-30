import type {
  Observation,
} from "../../../communication/observation.types";

export interface OpportunityRule {
  id: string;

  matches(
    observations: Observation[],
  ): boolean;

  build(
    observations: Observation[],
  ): string;
}
