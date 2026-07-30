import type {
  Observation,
} from "../../../communication/observation.types";

export interface PriorityRule {
  id: string;

  matches(
    observations: Observation[],
  ): boolean;

  build(
    observations: Observation[],
  ): string;
}