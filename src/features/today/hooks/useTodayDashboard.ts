import { useSuspenseQuery } from "@tanstack/react-query";

import {
  achievementsQuery,
  lifeAreasQuery,
  profileQuery,
  sessionsForDateQuery,
  sessionsInRangeQuery,
  skillsQuery,
  todayIso,
  weekBounds,
} from "@/features/forge/queries";
import { focusItemsForDateQuery } from "@/features/focus";
import { buildForgeState } from "@/features/forge-engine";

export function useTodayDashboard() {
  const today = todayIso();
  const { start, end } = weekBounds();

  const { data: profile } = useSuspenseQuery(
    profileQuery(),
  );

  const { data: skills } = useSuspenseQuery(
    skillsQuery(),
  );

  const { data: areas } = useSuspenseQuery(
    lifeAreasQuery(),
  );

  const { data: todaySessions } = useSuspenseQuery(
    sessionsForDateQuery(today),
  );

  const { data: weekSessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const { data: achievements } = useSuspenseQuery(
    achievementsQuery(),
  );

  const { data: focusItems } = useSuspenseQuery(
    focusItemsForDateQuery(today),
  );

  const forge = buildForgeState({
    sessions: weekSessions,
    skills,
    lifeAreas: areas,
  });

  return {
    profile,
    skills,
    areas,
    todaySessions,
    weekSessions,
    achievements,
    focusItems,
    forge,
  };
}