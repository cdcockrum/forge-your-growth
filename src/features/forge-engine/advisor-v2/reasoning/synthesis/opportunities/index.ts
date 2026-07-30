import type {
  OpportunityRule,
} from "./opportunity.types";

import {
  reinforceConsistency,
} from "./reinforceConsistency";

export const opportunityRules: OpportunityRule[] = [
  reinforceConsistency,
];