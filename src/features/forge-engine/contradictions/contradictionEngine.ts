import type {
  AdvisorBriefing,
} from "../advisor";

import type {
  IdentityEngineResult,
} from "../identity";

import type {
  MomentumResult,
} from "../momentum";

import type {
  ProgressSummary,
} from "../progress";

import type {
  Vision,
} from "@/features/vision";

import type {
  Contradiction,
  ContradictionResult,
} from "./contradiction.types";

type ContradictionInput = {
  vision: Vision | null;

  progress: ProgressSummary;

  momentum: MomentumResult;

  identity: IdentityEngineResult;

  advisor: AdvisorBriefing;
};

export function buildContradictions({
  vision,
  progress,
  momentum,
  identity,
}: ContradictionInput): ContradictionResult {

  const contradictions: Contradiction[] = [];

  //
  // Vision vs Practice
  //

  if (
    vision?.north_star &&
    progress.completedSessions === 0
  ) {
    contradictions.push({
      id: "vision-practice",

      title:
        "Your behavior is not yet supporting your vision.",

      explanation:
        "You have defined a direction, but no completed practice sessions currently reinforce it.",

      severity: "high",

      evidence: [
        "North Star exists",
        "No completed sessions",
      ],
    });
  }

  //
  // Identity vs Behavior
  //

  if (
    identity.strongestIdentity &&
    progress.completionRate < 40
  ) {
    contradictions.push({
      id: "identity-behavior",

      title:
        "Your actions are weakening your strongest identity.",

      explanation:
        `Your ${identity.strongestIdentity.identity.name} identity is established, but recent behavior is not consistently reinforcing it.`,

      severity: "medium",

      evidence: [
        identity.strongestIdentity.identity.name,
        `${progress.completionRate}% completion`,
      ],
    });
  }

  //
  // Momentum vs Load
  //

  if (
    momentum.burnoutRisk === "high" &&
    progress.totalSessions > 20
  ) {
    contradictions.push({
      id: "burnout-load",

      title:
        "Your workload conflicts with your current energy.",

      explanation:
        "Your momentum engine indicates elevated burnout risk while your schedule remains demanding.",

      severity: "high",

      evidence: [
        "Burnout Risk: High",
        `${progress.totalSessions} planned sessions`,
      ],
    });
  }

  return {

    contradictions,

    strongest:
      contradictions[0],

  };
}