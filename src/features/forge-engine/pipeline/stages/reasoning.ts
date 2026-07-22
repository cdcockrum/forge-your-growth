import type {
  Vision,
} from "@/features/vision";

import {
  buildAdvisorBriefing,
} from "../../advisor";

import {
  buildIntelligenceConclusion,
} from "../../intelligence";

import {
  buildForgeInsight,
} from "../../synthesis";

import type {
  ContextStage,
} from "./context";

import type {
  FoundationStage,
} from "./foundation";

import type {
  InterpretationStage,
} from "./interpretation";

export type ReasoningStage = {
  insight: ReturnType<
    typeof buildForgeInsight
  >;
  advisor: ReturnType<
    typeof buildAdvisorBriefing
  >;
  intelligence: ReturnType<
    typeof buildIntelligenceConclusion
  >;
};

type ReasoningOptions = {
  vision: Vision | null;
  foundation: FoundationStage;
  interpretation: InterpretationStage;
  context: ContextStage;
};

export function buildReasoningStage({
  vision,
  foundation,
  interpretation,
  context,
}: ReasoningOptions): ReasoningStage {
  const insight = buildForgeInsight({
    vision,
    progress: foundation.progress,
    momentum: interpretation.momentum,
    forgeScore: foundation.forgeScore,
    forgeHealth: foundation.forgeHealth,
    identity: interpretation.identity,
    coach: context.coach,
    narrative: context.narrative,
  });

  const advisor = buildAdvisorBriefing({
    vision,
    progress: foundation.progress,
    momentum: interpretation.momentum,
    identity: interpretation.identity,
    coach: context.coach,
    insight,
    memory: context.memory,
    narrative: context.narrative,
    history: context.history,
  });

  const intelligence =
    buildIntelligenceConclusion({
      vision,
      progress: foundation.progress,
      momentum: interpretation.momentum,
      identity: interpretation.identity,
      coach: context.coach,
      insight,
      advisor,
      memory: context.memory,
      history: context.history,
      narrative: context.narrative,
    });

  return {
    insight,
    advisor,
    intelligence,
  };
}