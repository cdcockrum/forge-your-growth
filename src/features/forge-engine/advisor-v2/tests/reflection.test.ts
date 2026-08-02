import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildExecutiveJudgment,
} from "../executive-judgment";

import {
  buildReflection,
} from "../reflection";

import {
  runReasoningPipeline,
} from "../reasoning";

describe(
  "buildReflection",
  () => {
    it(
      "returns a complete reflection",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        const reflection =
          buildReflection(
            reasoning,
            judgment,
          );

        expect(reflection).toBeDefined();

        expect(
          Array.isArray(
            reflection.assumptions,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            reflection.uncertainties,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            reflection
              .alternativeInterpretations,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            reflection
              .additionalEvidenceNeeded,
          ),
        ).toBe(true);

        expect(
          typeof reflection
            .confidenceStatement,
        ).toBe("string");
      },
    );

    it(
      "acknowledges insufficient evidence",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        const reflection =
          buildReflection(
            reasoning,
            judgment,
          );

        expect(
          reflection.uncertainties,
        ).toContain(
          "There is not yet enough evidence to form a stable conclusion.",
        );

        expect(
          reflection
            .additionalEvidenceNeeded,
        ).toContain(
          "Additional completed practices, reflections, and progress observations are needed.",
        );

        expect(
          reflection
            .confidenceStatement,
        ).toContain(
          "does not yet have enough evidence",
        );
      },
    );

    it(
      "does not return duplicate statements",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        const reflection =
          buildReflection(
            reasoning,
            judgment,
          );

        const collections = [
          reflection.assumptions,
          reflection.uncertainties,
          reflection
            .alternativeInterpretations,
          reflection
            .additionalEvidenceNeeded,
        ];

        for (
          const collection
          of collections
        ) {
          expect(
            new Set(
              collection,
            ).size,
          ).toBe(
            collection.length,
          );
        }
      },
    );

    it(
      "produces deterministic output",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        const judgment =
          buildExecutiveJudgment(
            reasoning,
          );

        const first =
          buildReflection(
            reasoning,
            judgment,
          );

        const second =
          buildReflection(
            reasoning,
            judgment,
          );

        expect(first).toEqual(
          second,
        );
      },
    );
  },
);