import type {
  OpportunityRule,
} from "./opportunity.types";

export const reinforceConsistency: OpportunityRule = {
  id: "reinforce-consistency",

  matches(observations) {
    return observations.some(
      (o) =>
        o.id === "compounding" ||
        o.id === "alignment",
    );
  },

  build() {
    return "Current consistency creates an opportunity to reinforce long-term habits before expanding into new goals.";
  },
};