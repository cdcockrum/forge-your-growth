import {
  useMemo,
} from "react";

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
  buildPatternSummary,
} from "@/features/forge-engine/patterns";

import {
  focusItemsForDateQuery,
} from "@/features/focus";

import {
  useForgeSnapshotRecorder,
} from "@/features/observatory/hooks/useForgeSnapshotRecorder";

import {
  mapReflectionRow,
} from "@/features/reflection/types";

import {
  useReflectionByDate,
  useReflections,
} from "@/features/reflection/hooks";

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
    useSuspenseQuery(
      profileQuery(),
    );

  const { data: skills } =
    useSuspenseQuery(
      skillsQuery(),
    );

  const { vision } =
    useVision();

  const { data: areas } =
    useSuspenseQuery(
      lifeAreasQuery(),
    );

  const { data: todaySessions } =
    useSuspenseQuery(
      sessionsForDateQuery(today),
    );

  const { data: weekSessions } =
    useSuspenseQuery(
      sessionsInRangeQuery(
        start,
        end,
      ),
    );

  const { data: achievements } =
    useSuspenseQuery(
      achievementsQuery(),
    );

  const { data: focusItems } =
    useSuspenseQuery(
      focusItemsForDateQuery(today),
    );

  const todayReflectionQuery =
    useReflectionByDate(today);

  const reflectionHistoryQuery =
    useReflections();

  const reflection = useMemo(() => {
    if (!todayReflectionQuery.data) {
      return null;
    }

    return mapReflectionRow(
      todayReflectionQuery.data,
    );
  }, [todayReflectionQuery.data]);

  const reflectionEntries =
    useMemo(
      () =>
        (
          reflectionHistoryQuery.data ??
          []
        ).map(mapReflectionRow),
      [reflectionHistoryQuery.data],
    );

  const patterns = useMemo(
    () =>
      buildPatternSummary(
        reflectionEntries,
        weekSessions,
      ),
    [
      reflectionEntries,
      weekSessions,
    ],
  );

  const forge = useMemo(
    () =>
      buildForgeState({
        vision,
        sessions: weekSessions,
        skills,
        lifeAreas: areas,

        achievements:
          achievements.map(
            (achievement) => ({
              id: achievement.id,
              title:
                achievement.title,
              earned_at:
                achievement.earned_at,
            }),
          ),

        review: null,
      }),
    [
      vision,
      weekSessions,
      skills,
      areas,
      achievements,
    ],
  );

  const snapshotRecorder =
    useForgeSnapshotRecorder({
      snapshotDate: today,
      forge,
      reflection,
      patterns,

      // Wait until reflection data has loaded so
      // today's snapshot includes the complete
      // available context on its first write.
      enabled:
        !todayReflectionQuery.isLoading &&
        !reflectionHistoryQuery.isLoading,
    });

  const model = useMemo(
    () =>
      buildTodayViewModel({
        profile,
        todaySessions,
        weekSessions,
        achievements,
        forge,
      }),
    [
      profile,
      todaySessions,
      weekSessions,
      achievements,
      forge,
    ],
  );

  return {
    profile,
    vision,

    skills,
    areas,

    todaySessions,
    weekSessions,

    achievements,
    focusItems,

    reflection,
    reflectionEntries,
    patterns,

    forge,
    model,

    snapshotRecorder,
  };
}