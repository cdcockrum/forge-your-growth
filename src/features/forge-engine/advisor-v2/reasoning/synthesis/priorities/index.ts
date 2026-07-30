import type {
  PriorityRule,
} from "./priority.types";

import {
  protectMomentum,
} from "./protectMomentum";

export const priorityRules: PriorityRule[] = [
  protectMomentum,
];