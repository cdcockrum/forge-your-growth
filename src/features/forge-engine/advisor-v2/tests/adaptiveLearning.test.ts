import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildAdaptiveLearning,
  buildAdaptiveLearningPipeline,
} from "../adaptive-learning";

describe(
  "adaptive learning pipeline",
  () => {
    it(
      "strengthens confidence after a successful recommendation outcome",
      () => {
        const result =
          buildAdaptiveLearningPipeline({
            outcome: {
              recommendationId:
                "recommendation-1",

              recommendationTitle:
                "Protect your practice rhythm",

              recommendationConfidence:
                0.65,

              recommendationAccepted:
                true,

              completedPracticeCount:
                4,

              plannedPracticeCount:
                4,

              momentumBefore:
                0.4,

              momentumAfter:
                0.65,

              progressBefore:
                0.35,

              progressAfter:
                0.6,

              reflectionQuality:
                0.9,

              achievementUnlocked:
                true,

              recommendedAt:
                "2026-08-01T12:00:00.000Z",

              evaluatedAt:
                "2026-08-08T12:00:00.000Z",
            },

            previousOutcomes: [],

            previousAdjustments: [],

            recommendationEvaluation: {
              recommendationId:
                "recommendation-1",

              confidenceBefore:
                0.65,

              evaluatedAt:
                "2026-08-08T12:00:00.000Z",
            },

            beliefRevision: {
              recommendationId:
                "recommendation-1",

              previousBelief:
                "A smaller practice plan may improve consistency.",

              currentBelief:
                "A smaller practice plan may improve consistency.",

              confidenceBefore:
                0.65,

              recordedAt:
                "2026-08-08T12:00:00.000Z",
            },

            generatedAt:
              "2026-08-08T12:00:00.000Z",
          });

        expect(
          result.outcome.status,
        ).toBe(
          "successful",
        );

        expect(
          result.outcome.response,
        ).toBe(
          "accepted",
        );

        expect(
          result.outcome.outcomeScore,
        ).toBeGreaterThan(
          0.75,
        );

        expect(
          result.adjustment.adjustment,
        ).toBeGreaterThan(
          0,
        );

        expect(
          result.adjustment.confidenceAfter,
        ).toBeGreaterThan(
          result.adjustment.confidenceBefore,
        );

        expect(
          result.beliefRevision.status,
        ).toBe(
          "strengthened",
        );

        expect(
          result.beliefRevision.revision,
        ).not.toBeNull();

        expect(
          result.adaptiveLearning.summary
            .evaluatedCount,
        ).toBe(
          1,
        );

        expect(
          result.adaptiveLearning.summary
            .successfulCount,
        ).toBe(
          1,
        );
      },
    );

    it(
      "weakens confidence when the observed outcome does not support the recommendation",
      () => {
        const result =
          buildAdaptiveLearningPipeline({
            outcome: {
              recommendationId:
                "recommendation-2",

              recommendationTitle:
                "Increase practice frequency",

              recommendationConfidence:
                0.75,

              recommendationAccepted:
                true,

              completedPracticeCount:
                0,

              plannedPracticeCount:
                4,

              momentumBefore:
                0.6,

              momentumAfter:
                0.3,

              progressBefore:
                0.6,

              progressAfter:
                0.3,

              reflectionQuality:
                0.2,

              achievementUnlocked:
                false,

              recommendedAt:
                "2026-08-01T12:00:00.000Z",

              evaluatedAt:
                "2026-08-08T12:00:00.000Z",
            },

            previousOutcomes: [],

            previousAdjustments: [],

            recommendationEvaluation: {
              recommendationId:
                "recommendation-2",

              confidenceBefore:
                0.75,

              evaluatedAt:
                "2026-08-08T12:00:00.000Z",
            },

            beliefRevision: {
              recommendationId:
                "recommendation-2",

              previousBelief:
                "More frequent practice will improve momentum.",

              currentBelief:
                "A smaller practice commitment may be more sustainable.",

              confidenceBefore:
                0.75,

              recordedAt:
                "2026-08-08T12:00:00.000Z",
            },

            generatedAt:
              "2026-08-08T12:00:00.000Z",
          });

        expect(
          result.outcome.status,
        ).toBe(
          "unsuccessful",
        );

        expect(
          result.adjustment.adjustment,
        ).toBeLessThan(
          0,
        );

        expect(
          result.adjustment.confidenceAfter,
        ).toBeLessThan(
          result.adjustment.confidenceBefore,
        );

        expect(
          result.beliefRevision.status,
        ).toBe(
          "revised",
        );

        expect(
          result.beliefRevision.revision,
        ).not.toBeNull();

        expect(
          result.beliefRevision.revision
            ?.previousBelief,
        ).not.toBe(
          result.beliefRevision.revision
            ?.currentBelief,
        );

        expect(
          result.adaptiveLearning.summary
            .unsuccessfulCount,
        ).toBe(
          1,
        );
      },
    );

    it(
      "reconstructs learning from persisted outcomes and adjustments",
      () => {
        const first =
          buildAdaptiveLearningPipeline({
            outcome: {
              recommendationId:
                "recommendation-3",

              recommendationTitle:
                "Keep the next step small",

              recommendationConfidence:
                0.6,

              recommendationAccepted:
                true,

              completedPracticeCount:
                3,

              plannedPracticeCount:
                3,

              momentumBefore:
                0.45,

              momentumAfter:
                0.6,

              progressBefore:
                0.4,

              progressAfter:
                0.55,

              reflectionQuality:
                0.8,

              achievementUnlocked:
                false,

              recommendedAt:
                "2026-08-01T12:00:00.000Z",

              evaluatedAt:
                "2026-08-08T12:00:00.000Z",
            },

            previousOutcomes: [],

            previousAdjustments: [],

            recommendationEvaluation: {
              recommendationId:
                "recommendation-3",

              confidenceBefore:
                0.6,

              evaluatedAt:
                "2026-08-08T12:00:00.000Z",
            },

            beliefRevision: {
              recommendationId:
                "recommendation-3",

              previousBelief:
                "Smaller commitments support consistency.",

              currentBelief:
                "Smaller commitments support consistency.",

              confidenceBefore:
                0.6,

              recordedAt:
                "2026-08-08T12:00:00.000Z",
            },

            generatedAt:
              "2026-08-08T12:00:00.000Z",
          });

        const restored =
          buildAdaptiveLearning({
            outcomes: [
              first.outcome,
            ],

            adjustments: [
              first.adjustment,
            ],

            generatedAt:
              "2026-08-09T12:00:00.000Z",
          });

        expect(
          restored.outcomes,
        ).toHaveLength(
          1,
        );

        expect(
          restored.adjustments,
        ).toHaveLength(
          1,
        );

        expect(
          restored.summary
            .recommendationCount,
        ).toBe(
          1,
        );

        expect(
          restored.summary
            .evaluatedCount,
        ).toBe(
          1,
        );

        expect(
          restored.outcomes[0]
            ?.recommendationId,
        ).toBe(
          "recommendation-3",
        );

        expect(
          restored.generatedAt,
        ).toBe(
          "2026-08-09T12:00:00.000Z",
        );
      },
    );
  },
);