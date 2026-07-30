import type {
  Observation,
} from "../../../communication/observation.types";

export interface ThemeRule {
  id: string;

  matches(
    observations: Observation[],
  ): boolean;

  build(
    observations: Observation[],
  ): string;
}