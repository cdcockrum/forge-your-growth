import type {
  CognitiveTimeline,
} from "./timeline.types";

export function buildTimeline(): CognitiveTimeline {
  return {
    events: [],
    interpretation: undefined,
  };
}