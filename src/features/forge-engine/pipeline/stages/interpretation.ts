import type {
  WeeklyPlanAssessment,
} from "../../planning-assessment/assessment.types";

import {
  calculateIdentityProgress,
} from "../../identity";

import {
  calculateMomentum,
} from "../../momentum";

import type {
  FoundationStage,
} from "./foundation";

import {
  buildTraitEngine,
} from "../../traits";

export type InterpretationStage = {
  identity: ReturnType<
    typeof calculateIdentityProgress
  >;

  momentum: ReturnType<
    typeof calculateMomentum
  >;

  traits: ReturnType<
    typeof buildTraitEngine
  >;
};

type InterpretationOptions = {
  foundation: FoundationStage;
  sessions: Parameters<
    typeof calculateIdentityProgress
  >[0]["sessions"];
  skills: Parameters<
    typeof calculateIdentityProgress
  >[0]["skills"];
  assessment?: WeeklyPlanAssessment;
};

export function buildInterpretationStage({
  foundation,
  sessions,
  skills,
  assessment,
}: InterpretationOptions): InterpretationStage {
  const identity =
    calculateIdentityProgress({
      sessions,
      skills,
    });

  const momentum = calculateMomentum({
    progress: foundation.progress,
    assessment,
  });

  const traits = buildTraitEngine({
  sessions,
  skills,
});

  return {
    identity,
    momentum,
    traits,
  };
}