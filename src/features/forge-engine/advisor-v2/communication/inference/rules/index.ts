import { alignmentRule } from "./alignmentRule";
import { compoundingRule } from "./compoundingRule";
import { interruptionRule } from "./interruptionRule";
import { recoveryRule } from "./recoveryRule";

export const inferenceRules = [
  interruptionRule,
  recoveryRule,
  alignmentRule,
  compoundingRule,
];