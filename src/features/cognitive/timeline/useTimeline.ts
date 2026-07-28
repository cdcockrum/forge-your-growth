import {
  useMemo,
} from "react";

import {
  buildTimeline,
} from "./buildTimeline";

import type {
  CognitiveTimeline,
} from "./timeline.types";

export function useTimeline(): CognitiveTimeline {
  return useMemo(
    () =>
      buildTimeline(),
    [],
  );
}