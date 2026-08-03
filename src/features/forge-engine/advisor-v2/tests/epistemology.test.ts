import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdvisorEvidence,
} from "../advisor.types";

import {
  buildEpistemology,
  determineBeliefStrength,
  determineEvidenceQuality,
} from "../epistemology";

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
  validateEpistemology,
} from "../validation";

describe(
  "Epistemology Engine",
  () => {
    it(
      "returns a complete result for empty evidence",
      () => {
        const result =
          createEpistemology([]);

        expect(result).toBeDefined();

        expect(
          typeof result.strongestBelief,
        ).toBe("string");

        expect([
          "tentative",
          "developing",
          "stable",
        ]).toContain(
          result.beliefStrength,
        );

        expect([
          "weak",
          "moderate",
          "strong",
        ]).toContain(
          result.evidenceQuality,
        );

        expect(
          Array.isArray(
            result.assumptions,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.uncertainties,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.missingEvidence,
          ),
        ).toBe(true);

        expect(
          Array.isArray(
            result.couldChangeMyMind,
          ),
        ).toBe(true);

        expect(
          typeof result.confidenceNarrative,
        ).toBe("string");
      },
    );

    it(
      "classifies an empty evidence set as tentative and weak",
      () => {
        const reasoning =
          runReasoningPipeline([]);

        expect(
          determineBeliefStrength(
            reasoning,
          ),
        ).toBe("tentative");

        expect(
          determineEvidenceQuality(
            [],
            reasoning,
          ),
        ).toBe("weak");
      },
    );

    it(
      "identifies missing evidence and revision conditions",
      () => {
        const result =
          createEpistemology([]);

        expect(
          result.missingEvidence.length,
        ).toBeGreaterThan(0);

        expect(
          result.couldChangeMyMind.length,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "produces deterministic output",
      () => {
        const first =
          createEpistemology([]);

        const second =
          createEpistemology([]);

        expect(first).toEqual(
          second,
        );
      },
    );

    it(
      "passes structural validation",
      () => {
        const result =
          createEpistemology([]);

        const validation =
          validateEpistemology(
            result,
          );

        expect(validation).toBeDefined();

        expect(
          typeof validation.valid,
        ).toBe("boolean");

        expect(
          Array.isArray(
            validation.issues,
          ),
        ).toBe(true);
      },
    );

    it(
      "detects a missing strongest belief",
      () => {
        const result =
          createEpistemology([]);

        const validation =
          validateEpistemology({
            ...result,

            strongestBelief:
              "",
          });

        expect(validation.valid).toBe(
          false,
        );

        expect(
          validation.issues.some(
            (issue) =>
              issue.code ===
              "epistemology.missing-strongest-belief",
          ),
        ).toBe(true);
      },
    );
  },
);

function createEpistemology(
  evidence: AdvisorEvidence[],
) {
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

  return buildEpistemology(
    evidence,
    reasoning,
    judgment,
    reflection,
  );
}