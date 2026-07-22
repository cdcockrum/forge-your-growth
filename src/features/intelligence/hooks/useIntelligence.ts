import { useState } from "react";
import {
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  achievementsQuery,
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  weekBounds,
} from "@/features/forge/queries";

import {
  buildForgeState,
} from "@/features/forge-engine";

import {
  buildIntelligenceViewModel,
} from "@/features/intelligence/services";

import {
  visionQuery,
} from "@/features/vision";

export function useIntelligence() {
  const { start, end } = weekBounds();

  const { data: profile } =
    useSuspenseQuery(profileQuery());

  const { data: skills } =
    useSuspenseQuery(skillsQuery());

  const { data: areas } =
    useSuspenseQuery(lifeAreasQuery());

  const { data: sessions } =
    useSuspenseQuery(
      sessionsInRangeQuery(start, end),
    );

  const { data: achievements } =
    useSuspenseQuery(
      achievementsQuery(),
    );

  const { data: vision } =
    useSuspenseQuery(visionQuery());

  const forge = buildForgeState({
    vision,
    sessions,
    skills,
    lifeAreas: areas,

    achievements: achievements.map(
      (achievement) => ({
        id: achievement.id,
        title: achievement.title,
        earned_at:
          achievement.earned_at,
      }),
    ),

    review: null,
  });

  const model =
    buildIntelligenceViewModel(forge);

  const [
    highlightedNodeId,
    setHighlightedNodeId,
  ] = useState<string | null>(null);

  function focusEvidenceNode(
    nodeId: string,
  ) {
    const element =
      document.getElementById(
        `evidence-${nodeId}`,
      );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightedNodeId(nodeId);

    window.setTimeout(() => {
      setHighlightedNodeId(
        (current) =>
          current === nodeId
            ? null
            : current,
      );
    }, 1800);
  }

  const firstName =
    profile?.full_name
      ?.split(" ")[0]
      ?.trim() || "Friend";

  return {
    firstName,
    model,
    highlightedNodeId,
    focusEvidenceNode,
  };
}