import type {
  ExecutiveNarrative,
  ExecutiveNarrativeInput,
} from "./composer.types";

import {
  contradictionSentence,
  openingSentence,
  predictionSentence,
} from "./templates";

export function composeExecutiveNarrative(
  input: ExecutiveNarrativeInput,
): ExecutiveNarrative {

  const belief =
    input.beliefs.strongest[0];

  const contradiction =
    input.contradictions.strongest;

  const prediction =
    input.predictions.strongest;

  return {

    title:
      "Forge Assessment",

    summary: [

      belief
        ? openingSentence(
            belief.statement,
          )
        : "",

      contradiction
        ? contradictionSentence(
            contradiction.title,
          )
        : "",

      prediction
        ? predictionSentence(
            prediction.description,
          )
        : "",

    ]
      .filter(Boolean)
      .join(" "),

    confidence:
      input.advisor.confidence,

  };

}