import type {
  Observation,
} from "../communication/observation.types";

export interface Contradiction {
  id: string;

  title: string;

  description: string;

  observations: Observation[];

  severity: number;
}

export interface ContradictionRule {
  id: string;

  matches(
    observations: Observation[],
  ): boolean;

  build(
    observations: Observation[],
  ): Contradiction;
}