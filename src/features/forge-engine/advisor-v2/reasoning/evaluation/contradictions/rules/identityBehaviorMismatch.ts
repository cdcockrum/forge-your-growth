import type {
  ContradictionRule,
} from "../../../Contradictions/contradiction.types";

export const identityBehaviorMismatch:
  ContradictionRule = {
  id: "identity-behavior",

  matches() {
    return false;
  },

  build() {
    throw new Error(
      "Not implemented.",
    );
  },
};