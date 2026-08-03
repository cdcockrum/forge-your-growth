import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

export function analyzeAssumptions(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): string[] {
  const assumptions: string[] = [
    ...reflection.assumptions,
  ];

  if (
    reasoning.interpretation
      .strongest
  ) {
    assumptions.push(
      "The strongest interpretation is treated as the best current explanation, even though other explanations may remain possible.",
    );
  }

  if (
    reasoning.interpretation
      .supportingEvidence.length > 0
  ) {
    assumptions.push(
      "The available supporting evidence is representative of the user's broader behavior.",
    );
  }

  if (
    reasoning.graph.nodes.length <
    3
  ) {
    assumptions.push(
      "A limited evidence set is being used to describe the current situation.",
    );
  }

  if (
    judgment.situation !==
      "uncertain" &&
    reasoning.evaluation
      .gaps.length > 0
  ) {
    assumptions.push(
      "The current situation can still be described meaningfully despite known evidence gaps.",
    );
  }

  if (
    judgment.confidence >= 0.7 &&
    reasoning.evaluation
      .contradictions.length > 0
  ) {
    assumptions.push(
      "The supporting evidence is considered more informative than the contradictory evidence.",
    );
  }

  return uniqueStrings(
    assumptions,
  );
}

export function identifyUnverifiedAssumptions(
  assumptions: string[],
  reasoning: ReasoningResult,
): string[] {
  const hasRepeatedBehavior =
    reasoning.graph.nodes.some(
      (node) =>
        node.evidence.tags.some(
          (tag) =>
            tag.toLowerCase().includes(
              "repeated",
            ) ||
            tag.toLowerCase().includes(
              "pattern",
            ) ||
            tag.toLowerCase().includes(
              "history",
            ),
        ),
    );

  return assumptions.filter(
    (assumption) => {
      const normalized =
        assumption.toLowerCase();

      if (
        normalized.includes(
          "representative",
        ) ||
        normalized.includes(
          "meaningful pattern",
        ) ||
        normalized.includes(
          "broader behavior",
        )
      ) {
        return !hasRepeatedBehavior;
      }

      return true;
    },
  );
}

function uniqueStrings(
  values: string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim(),
        )
        .filter(
          (value) =>
            value.length > 0,
        ),
    ),
  );
}