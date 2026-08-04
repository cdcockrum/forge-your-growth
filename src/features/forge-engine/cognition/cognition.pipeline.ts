import type {
  ForgeCognitionInput,
  ForgeCognitionResult,
} from "./cognition.types";

import {
  buildCognition,
} from "./cognition.engine";

export type CognitionPipelineOptions =
  ForgeCognitionInput;

export function runCognitionPipeline(
  options: CognitionPipelineOptions,
): ForgeCognitionResult {
  return buildCognition(
    options,
  );
}