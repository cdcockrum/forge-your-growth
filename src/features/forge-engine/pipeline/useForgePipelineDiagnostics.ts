import {
  useMemo,
} from "react";

import type {
  ForgePipelineOptions,
} from "./forgePipeline";

import {
  buildForgePipelineSnapshot,
} from "./forgePipeline";

import {
  buildPipelineDiagnostics,
} from "./pipelineDiagnostics";

export function useForgePipelineDiagnostics(
  options: ForgePipelineOptions,
) {
  return useMemo(() => {
    const snapshot =
      buildForgePipelineSnapshot(options);

    const diagnostics =
      buildPipelineDiagnostics(snapshot);

    return {
      snapshot,
      diagnostics,
    };
  }, [
    options.vision,
    options.sessions,
    options.skills,
    options.lifeAreas,
    options.assessment,
    options.achievements,
    options.review,
  ]);
}