import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  AdvisorEvidence,
} from "../advisor.types";

import {
  buildCalibration,
  buildConfidenceMetrics,
  buildPredictionRecords,
  buildReliabilityMetrics,
  predictionAccuracy,
  resolvePrediction,
} from "../calibration";

import type {
  CognitiveMemory,
} from "../cognitive-memory";

import {
  validateCalibration,
} from "../validation";

describe(
  "Calibration Engine",
  () => {
    it(
      "builds an empty calibration result safely",
      () => {
        const result =
          buildCalibration({
            predictions: [],

            evidence: [],

            cognitiveMemory:
              createCognitiveMemory(),
          });

        expect(result).toBeDefined();

        expect(
          result.predictions,
        ).toEqual([]);

        expect(
          result.confidence
            .averageAccuracy,
        ).toBe(0);

        expect(
          result.confidence
            .averageConfidence,
        ).toBe(0);

        expect(
          typeof result.recommendation,
        ).toBe("string");
      },
    );

    it(
      "tracks and resolves predictions",
      () => {
        const records =
          buildPredictionRecords(
            [
              {
                id:
                  "prediction-1",

                title:
                  "Momentum improves",

                description:
                  "Momentum will improve over the next week.",

                confidence:
                  0.8,
              },
            ],
            "2026-01-01T00:00:00.000Z",
          );

        expect(
          records[0]?.outcome,
        ).toBe("unknown");

        const resolved =
          resolvePrediction(
            records[0]!,
            true,
            "2026-01-08T00:00:00.000Z",
          );

        expect(
          resolved.outcome,
        ).toBe("correct");

        expect(
          resolved.resolvedAt,
        ).toBe(
          "2026-01-08T00:00:00.000Z",
        );
      },
    );

    it(
      "calculates prediction accuracy",
      () => {
        const records =
          buildPredictionRecords(
            [
              {
                id:
                  "prediction-1",

                title:
                  "First",

                description:
                  "First prediction.",

                confidence:
                  0.8,
              },

              {
                id:
                  "prediction-2",

                title:
                  "Second",

                description:
                  "Second prediction.",

                confidence:
                  0.6,
              },
            ],
            "2026-01-01T00:00:00.000Z",
          );

        const resolved = [
          resolvePrediction(
            records[0]!,
            true,
          ),

          resolvePrediction(
            records[1]!,
            false,
          ),
        ];

        expect(
          predictionAccuracy(
            resolved,
          ),
        ).toBe(0.5);
      },
    );

    it(
      "detects overconfidence",
      () => {
        const records =
          buildPredictionRecords(
            [
              {
                id:
                  "prediction-1",

                title:
                  "First",

                description:
                  "First prediction.",

                confidence:
                  0.9,
              },

              {
                id:
                  "prediction-2",

                title:
                  "Second",

                description:
                  "Second prediction.",

                confidence:
                  0.9,
              },
            ],
            "2026-01-01T00:00:00.000Z",
          );

        const resolved = [
          resolvePrediction(
            records[0]!,
            true,
          ),

          resolvePrediction(
            records[1]!,
            false,
          ),
        ];

        const metrics =
          buildConfidenceMetrics(
            resolved,
          );

        expect(
          metrics.calibration,
        ).toBe(
          "overconfident",
        );

        expect(
          metrics.overconfidenceBias,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "builds evidence reliability metrics",
      () => {
        const evidence:
          AdvisorEvidence[] = [
            {
              id:
                "evidence-1",

              category:
                "progress",

              source:
                "test",

              statement:
                "Progress is improving.",

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
                "evidence-2",

              category:
                "momentum",

              source:
                "test",

              statement:
                "Momentum is uncertain.",

              confidence:
                0.4,

              impact:
                0.5,

              polarity:
                "negative",

              tags: [
                "test",
              ],
            },
          ];

        const result =
          buildReliabilityMetrics(
            evidence,
            0,
          );

        expect(
          result.evidenceCoverage,
        ).toBe(0.5);

        expect(
          result.contradictionRate,
        ).toBe(0.5);

        expect([
          "low",
          "medium",
          "high",
        ]).toContain(
          result.evidenceReliability,
        );
      },
    );

    it(
      "passes structural validation",
      () => {
        const result =
          buildCalibration({
            predictions: [],

            evidence: [],

            cognitiveMemory:
              createCognitiveMemory(),
          });

        const validation =
          validateCalibration(
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
      "detects an invalid recommendation",
      () => {
        const result =
          buildCalibration({
            predictions: [],

            evidence: [],

            cognitiveMemory:
              createCognitiveMemory(),
          });

        const validation =
          validateCalibration({
            ...result,

            recommendation:
              "",
          });

        expect(
          validation.valid,
        ).toBe(false);

        expect(
          validation.issues.some(
            (issue) =>
              issue.code ===
              "calibration.missing-recommendation",
          ),
        ).toBe(true);
      },
    );
  },
);

function createCognitiveMemory():
  CognitiveMemory {
  return {
    current: {
      id:
        "snapshot-current",

      generatedAt:
        "2026-01-01T00:00:00.000Z",

      strongestBelief: {
        id:
          "belief-current",

        statement:
          "Forge is still gathering evidence.",

        confidence:
          0.5,

        strength:
          "tentative",

        status:
          "active",

        evidenceQuality:
          "weak",

        recordedAt:
          "2026-01-01T00:00:00.000Z",
      },

      assumptions:
        [],

      confidence: {
        value:
          0.5,

        recordedAt:
          "2026-01-01T00:00:00.000Z",
      },

      revisionConditions: [
        "Additional evidence could change this belief.",
      ],
    },

    previous:
      null,

    revisions:
      [],

    confidenceHistory: [
      {
        value:
          0.5,

        recordedAt:
          "2026-01-01T00:00:00.000Z",
      },
    ],
  };
}