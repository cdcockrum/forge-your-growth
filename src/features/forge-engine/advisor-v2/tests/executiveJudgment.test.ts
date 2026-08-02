import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildExecutiveJudgment,
} from "../executive-judgment";

import {
  runReasoningPipeline,
} from "../reasoning";

describe(
  "buildExecutiveJudgment",
  () => {
    it(
      "returns a complete judgment for empty evidence",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        expect(judgment).toBeDefined();

        expect(
          typeof judgment.headline,
        ).toBe("string");

        expect(
          typeof judgment.summary,
        ).toBe("string");

        expect([
          "building",
          "accelerating",
          "plateauing",
          "recovering",
          "uncertain",
        ]).toContain(
          judgment.situation,
        );

        expect([
          "low",
          "medium",
          "high",
        ]).toContain(
          judgment.urgency,
        );

        expect(
          judgment.confidence,
        ).toBeGreaterThanOrEqual(0);

        expect(
          judgment.confidence,
        ).toBeLessThanOrEqual(1);

        expect(
          Array.isArray(
            judgment.rationale,
          ),
        ).toBe(true);
      },
    );

    it(
      "returns an uncertain situation when evidence is insufficient",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        expect(
          judgment.situation,
        ).toBe("uncertain");
      },
    );

    it(
      "produces deterministic judgment for identical reasoning",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const first =
          buildExecutiveJudgment(
            reasoning,
          );

        const second =
          buildExecutiveJudgment(
            reasoning,
          );

        expect(first).toEqual(
          second,
        );
      },
    );

    it(
      "does not return duplicate rationale statements",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        expect(
          new Set(
            judgment.rationale,
          ).size,
        ).toBe(
          judgment.rationale.length,
        );
      },
    );
  },
);