import type {
  ForgeScoreResult,
} from "./types";

type Input = {
  consistency: number;
  completion: number;
  balance: number;
  recovery: number;
  reflection: number;
};

export function calculateForgeScore(
  input: Input,
): ForgeScoreResult {

  const score = Math.round(
      input.consistency * .40 +
      input.completion * .30 +
      input.balance * .15 +
      input.recovery * .10 +
      input.reflection * .05
  );

  let grade = "Apprentice";

  if (score >= 95)
    grade = "Master";

  else if (score >= 85)
    grade = "Craftsman";

  else if (score >= 70)
    grade = "Builder";

  return {
    score,
    trend: "steady",
    grade,
    breakdown: {
      consistency: input.consistency,
      completion: input.completion,
      balance: input.balance,
      recovery: input.recovery,
      reflection: input.reflection,
    },
  };
}