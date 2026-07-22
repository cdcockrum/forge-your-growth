import {
  useSuspenseQuery,
} from "@tanstack/react-query";

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

import {
  buildForgeState,
} from "@/features/forge-engine";

import {
  focusItemsForDateQuery,
} from "@/features/focus";

import {
  buildTodayViewModel,
} from "@/features/today/services";

import {
  useVision,
} from "@/features/vision";

export function useTodayDashboard() {
  const today = todayIso();
  const { start, end } = weekBounds();

  const { data: profile } =
    useSuspenseQuery(profileQuery());

  const { data: skills } =
    useSuspenseQuery(skillsQuery());

  const { vision } = useVision();

  const { data: areas } =
    useSuspenseQuery(lifeAreasQuery());

  const { data: todaySessions } =
    useSuspenseQuery(
      sessionsForDateQuery(today),
    );

  const { data: weekSessions } =
    useSuspenseQuery(
      sessionsInRangeQuery(start, end),
    );

  const { data: achievements } =
    useSuspenseQuery(
      achievementsQuery(),
    );

  const { data: focusItems } =
    useSuspenseQuery(
      focusItemsForDateQuery(today),
    );

  const forge = buildForgeState({
    vision,
    sessions: weekSessions,
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

  const model = buildTodayViewModel({
    profile,
    todaySessions,
    weekSessions,
    achievements,
    forge,
  });

  return {
    skills,
    areas,
    todaySessions,
    focusItems,
    model,
  };
}