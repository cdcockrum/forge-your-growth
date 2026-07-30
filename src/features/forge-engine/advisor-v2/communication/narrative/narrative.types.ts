import type { Observation } from "../observation.types";

export type Narrative = {
  title: string;

  summary: string;

  observations: Observation[];

  priorities: string[];

  opportunities: string[];

  risks: string[];
};