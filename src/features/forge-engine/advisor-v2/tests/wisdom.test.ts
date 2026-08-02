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

import {
  buildSimulation,
} from "../simulation";

import {
  buildWisdom,
} from "../wisdom";

describe(
  "buildWisdom",
  () => {
    it(
      "returns a complete wisdom result",
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

        const simulation =
          buildSimulation(
            reasoning,
            judgment,
            reflection,
          );

        const wisdom =
          buildWisdom(
            reasoning,
            judgment,
            reflection,
            simulation,
            null,
          );

        expect(wisdom).toBeDefined();

        expect(
          typeof wisdom.narrative,
        ).toBe("string");

        expect(
          Array.isArray(
            wisdom.insights,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            wisdom.longTermThemes,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            wisdom.emergingIdentity,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            wisdom.cautions,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            wisdom.opportunities,
          ),
        ).toBe(true);

        expect(
          wisdom.confidence,
        ).toBeGreaterThanOrEqual(0);

        expect(
          wisdom.confidence,
        ).toBeLessThanOrEqual(1);
      },
    );

    it(
      "handles empty evidence safely",
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

        const simulation =
          buildSimulation(
            reasoning,
            judgment,
            reflection,
          );

        expect(() =>
          buildWisdom(
            reasoning,
            judgment,
            reflection,
            simulation,
            null,
          ),
        ).not.toThrow();
      },
    );

    it(
      "does not return duplicate collection values",
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

        const simulation =
          buildSimulation(
            reasoning,
            judgment,
            reflection,
          );

        const wisdom =
          buildWisdom(
            reasoning,
            judgment,
            reflection,
            simulation,
            null,
          );

        const collections = [
          wisdom.longTermThemes,
          wisdom.emergingIdentity,
          wisdom.cautions,
          wisdom.opportunities,
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

        const reflection =
          buildReflection(
            reasoning,
            judgment,
          );

        const simulation =
          buildSimulation(
            reasoning,
            judgment,
            reflection,
          );

        const first =
          buildWisdom(
            reasoning,
            judgment,
            reflection,
            simulation,
            null,
          );

        const second =
          buildWisdom(
            reasoning,
            judgment,
            reflection,
            simulation,
            null,
          );

        expect(first).toEqual(
          second,
        );
      },
    );
  },
);