import type { Observation } from "../../communication/observation.types";
import type { SynthesisResult } from "./synthesis.types";

export function synthesize(
  observations: Observation[],
): SynthesisResult {
  return {
    dominantTheme: null,
    priorities: [],
    opportunities: [],
    risks: [],
    summary: "",
  };
}