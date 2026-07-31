import {
  describe,
  expect,
  it,
} from "vitest";

import {
  runReasoningPipeline,
} from "../reasoning";

describe(
  "runReasoningPipeline",
  () => {
    it(
      "returns a complete reasoning result",
      () => {
        const result =
          runReasoningPipeline([]);

        expect(result).toBeDefined();

        expect(result).toHaveProperty(
          "graph",
        );

        expect(result).toHaveProperty(
          "weights",
        );

        expect(result).toHaveProperty(
          "analysis",
        );

        expect(result).toHaveProperty(
          "conflicts",
        );

        expect(result).toHaveProperty(
          "hypotheses",
        );

        expect(result).toHaveProperty(
          "evaluation",
        );

        expect(result).toHaveProperty(
          "interpretation",
        );

        expect(result).toHaveProperty(
          "recommendations",
        );

        expect(result).toHaveProperty(
          "trace",
        );
      },
    );

    it(
      "handles an empty evidence collection",
      () => {
        expect(() =>
          runReasoningPipeline([]),
        ).not.toThrow();
      },
    );

    it(
      "returns collections instead of undefined",
      () => {
        const result =
          runReasoningPipeline([]);

        expect(
          Array.isArray(
            result.hypotheses,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.recommendations,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.evaluation
              .contradictions,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.evaluation.tensions,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.evaluation.gaps,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.evaluation
              .competingHypotheses,
          ),
        ).toBe(true);
      },
    );

    it(
      "always returns a valid consistency score",
      () => {
        const result =
          runReasoningPipeline([]);

        const {
          consistencyScore,
        } = result.evaluation;

        expect(
          typeof consistencyScore,
        ).toBe("number");

        expect(
          Number.isFinite(
            consistencyScore,
          ),
        ).toBe(true);

        expect(
          consistencyScore,
        ).toBeGreaterThanOrEqual(0);

        expect(
          consistencyScore,
        ).toBeLessThanOrEqual(1);
      },
    );

    it(
      "always returns an interpretation",
      () => {
        const result =
          runReasoningPipeline([]);

        expect(
          result.interpretation,
        ).toBeDefined();

        expect(
          result.interpretation,
        ).not.toBeNull();

        expect(
          typeof result.interpretation
            .summary,
        ).toBe("string");
      },
    );

    it(
      "always returns a recommendations array",
      () => {
        const result =
          runReasoningPipeline([]);

        expect(
          result.recommendations,
        ).toBeDefined();

        expect(
          Array.isArray(
            result.recommendations,
          ),
        ).toBe(true);
      },
    );

    it(
      "creates a reasoning trace",
      () => {
        const result =
          runReasoningPipeline([]);

        expect(
          result.trace,
        ).toBeDefined();

        expect(
          typeof result.trace
            .generatedAt,
        ).toBe("string");

        expect(
          Array.isArray(
            result.trace.steps,
          ),
        ).toBe(true);

        expect(
          result.trace.interpretation,
        ).toEqual(
          result.interpretation,
        );

        expect(
          result.trace.evaluation,
        ).toEqual(
          result.evaluation,
        );

        expect(
          result.trace.analysis,
        ).toEqual(
          result.analysis,
        );
      },
    );

    it(
      "produces deterministic reasoning for identical evidence",
      () => {
        const first =
          runReasoningPipeline([]);

        const second =
          runReasoningPipeline([]);

        expect(first.graph).toEqual(
          second.graph,
        );

        expect(first.weights).toEqual(
          second.weights,
        );

        expect(first.analysis).toEqual(
          second.analysis,
        );

        expect(
          first.hypotheses,
        ).toEqual(
          second.hypotheses,
        );

        expect(
          first.evaluation,
        ).toEqual(
          second.evaluation,
        );

        expect(
          first.interpretation,
        ).toEqual(
          second.interpretation,
        );

        expect(
          first.recommendations,
        ).toEqual(
          second.recommendations,
        );
      },
    );
  },
);