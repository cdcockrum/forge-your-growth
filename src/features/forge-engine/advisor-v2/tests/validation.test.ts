import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdvisorEvidence,
  AdvisorResult,
} from "../advisor.types";

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
  validateAdvisor,
  validateEvidence,
  validateJudgment,
  validateReasoning,
  validateReflection,
  validateSimulation,
  validateWisdom,
} from "../validation";

import {
  buildWisdom,
} from "../wisdom";

import {
  buildEpistemology,
} from "../epistemology";

import {
  buildCognitiveMemorySnapshot,
  compareCognitiveMemory,
} from "../cognitive-memory";

import {
  buildCalibration,
} from "../calibration";

describe(
  "Advisor validation",
  () => {
    it(
      "validates an empty evidence collection",
      () => {
        const result =
          validateEvidence([]);

        expect(result.valid).toBe(
          true,
        );

        expect(result.issues).toEqual(
          [],
        );
      },
    );

    it(
      "detects duplicate evidence IDs",
      () => {
        const result =
          validateEvidence([
            {
              id:
                "duplicate",

              category:
                "progress",

              source:
                "test",

              statement:
                "First statement.",

              confidence:
                0.8,

              impact:
                0.7,

              polarity:
                "positive",

              tags: [
                "test",
              ],
            },

            {
              id:
                "duplicate",

              category:
                "momentum",

              source:
                "test",

              statement:
                "Second statement.",

              confidence:
                0.6,

              impact:
                0.5,

              polarity:
                "neutral",

              tags: [
                "test",
              ],
            },
          ]);

        expect(result.valid).toBe(
          false,
        );

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              "evidence.duplicate-id",
          ),
        ).toBe(true);
      },
    );

    it(
      "validates every Advisor stage",
      () => {
        const advisor =
          createEmptyAdvisor();

        expect(
          validateReasoning(
            advisor.reasoning,
          ),
        ).toBeDefined();

        expect(
          validateJudgment(
            advisor.judgment,
          ),
        ).toBeDefined();

        expect(
          validateReflection(
            advisor.reflection,
          ),
        ).toBeDefined();

        expect(
          validateSimulation(
            advisor.simulation,
          ),
        ).toBeDefined();

        expect(
          validateWisdom(
            advisor.wisdom,
          ),
        ).toBeDefined();
      },
    );

    it(
      "returns one combined validation report",
      () => {
        const advisor =
          createEmptyAdvisor();

        const result =
          validateAdvisor(
            advisor,
          );

        expect(result).toBeDefined();

        expect(
          typeof result.valid,
        ).toBe("boolean");

        expect(
          Array.isArray(
            result.issues,
          ),
        ).toBe(true);
      },
    );

    it(
      "does not return duplicate issues",
      () => {
        const advisor =
          createEmptyAdvisor();

        const result =
          validateAdvisor(
            advisor,
          );

        const keys =
          result.issues.map(
            (issue) =>
              `${issue.code}:${issue.message}`,
          );

        expect(
          new Set(keys).size,
        ).toBe(
          keys.length,
        );
      },
    );
  },
);

function createEmptyAdvisor(): AdvisorResult {
  const evidence: AdvisorEvidence[] =
  [];

  const reasoning =
    runReasoningPipeline(
      evidence,
    );

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

  const epistemology =
  buildEpistemology(
    evidence,
    reasoning,
    judgment,
    reflection,
  );

  const cognitiveSnapshot =
  buildCognitiveMemorySnapshot({
    wisdom,

    epistemology,

    recordedAt:
      "2026-01-01T00:00:00.000Z",
  });

    const cognitiveMemory =
    compareCognitiveMemory(
        cognitiveSnapshot,
        null,
    );

    const calibration =
        buildCalibration({
            predictions: [],

            evidence,

            cognitiveMemory,
        });

  return {
    evidence,

    reasoning,

    judgment,

    reflection,

    simulation,

    wisdom,

    epistemology,

    /*
     * Confidence and brief are not examined by the
     * current Advisor validator. These placeholders
     * satisfy AdvisorResult while keeping this test
     * focused on the validated cognitive stages.
     */

    cognitiveMemory,

    calibration,

    confidence:
      {} as AdvisorResult[
        "confidence"
      ],

    brief:
      {} as AdvisorResult[
        "brief"
      ],
  };
}