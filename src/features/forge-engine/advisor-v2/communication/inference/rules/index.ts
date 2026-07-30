import type {
  InferenceRule,
} from "../inference.types";

import {
  interruptionRule,
} from "./interruptionRule";

import {
  recoveryRule,
} from "./recoveryRule";

export const inferenceRules: InferenceRule[] = [
  interruptionRule,
  recoveryRule,
];