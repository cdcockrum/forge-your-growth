import type {
  PriorityRule,
} from "./priority.types";

export const protectMomentum: PriorityRule = {
  id: "protect-momentum",

  matches(observations) {
    return observations.some(
      (o) =>
        o.id === "recovery" ||
        o.id === "compounding",
    );
  },

  build() {
    return "Protect your current consistency before increasing intensity.";
  },
};