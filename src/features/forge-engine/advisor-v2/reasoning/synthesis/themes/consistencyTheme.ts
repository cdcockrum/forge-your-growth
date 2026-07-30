import type {
  ThemeRule,
} from "./theme.types";

export const consistencyTheme: ThemeRule = {
  id: "consistency",

  matches(observations) {
    return observations.some(
      (observation) =>
        observation.id === "recovery" ||
        observation.id === "compounding",
    );
  },

  build() {
    return "Consistency is becoming the dominant force behind current progress.";
  },
};