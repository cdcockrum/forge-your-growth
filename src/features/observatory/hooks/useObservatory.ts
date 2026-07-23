import {
  useMemo,
} from "react";

import {
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  achievementsQuery,
  lifeAreasQuery,
  sessionsInRangeQuery,
  skillsQuery,
  weekBounds,
} from "@/features/forge/queries";

import {
  buildForgeState,
} from "@/features/forge-engine";

import {
  useVision,
} from "@/features/vision";

import {
  buildIdentityTreeViewModel,
} from "../identity-tree";

import type {
  ForgeSnapshotRange,
} from "../snapshot.types";

import {
  buildConsistencyHeatmap,
  buildObservatoryViewModel,
} from "../view-models";

import {
  useForgeSnapshots,
} from "./useForgeSnapshots";

import {
  buildMorningBriefing,
} from "@/features/briefing"

import {
  buildForgeEvents,
} from "@/features/forge-engine";

import {
  buildChronicleViewModel,
} from "@/features/chronicle";;

function toIsoDate(
  value: Date,
): string {
  return value
    .toISOString()
    .slice(0, 10);
}

function getHistoryRange() {
  const end = new Date();

  const start = new Date(end);

  start.setDate(
    start.getDate() - 83,
  );

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
}

export function useObservatory(
  range: ForgeSnapshotRange = {},
) {
  const historyRange = useMemo(
    () => getHistoryRange(),
    [],
  );

  const weekRange = useMemo(
    () => weekBounds(),
    [],
  );

  const snapshotsQuery =
    useForgeSnapshots(range);

  const { vision } =
    useVision();

  const {
    data: skills,
  } = useSuspenseQuery(
    skillsQuery(),
  );

  const {
    data: lifeAreas,
  } = useSuspenseQuery(
    lifeAreasQuery(),
  );

  const {
    data: achievements,
  } = useSuspenseQuery(
    achievementsQuery(),
  );

  const {
    data: weekSessions,
  } = useSuspenseQuery(
    sessionsInRangeQuery(
      weekRange.start,
      weekRange.end,
    ),
  );

  const {
    data: sessionHistory,
  } = useSuspenseQuery(
    sessionsInRangeQuery(
      historyRange.startDate,
      historyRange.endDate,
    ),
  );

  const model = useMemo(
    () =>
      buildObservatoryViewModel(
        snapshotsQuery.data ?? [],
      ),
    [
      snapshotsQuery.data,
    ],
  );

  const consistencyHeatmap =
    useMemo(
      () =>
        buildConsistencyHeatmap(
          sessionHistory,
        ),
      [
        sessionHistory,
      ],
    );

  const forge = useMemo(
    () =>
      buildForgeState({
        vision,
        sessions: sessionHistory,
        skills,
        lifeAreas,

        achievements:
          achievements.map(
            (achievement) => ({
              id:
                achievement.id,

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
      lifeAreas,
      achievements,
    ],
  );

  const briefing = useMemo(
  () =>
    buildMorningBriefing(
      forge,
    ),
  [forge],
);

const events = useMemo(
  () =>
    buildForgeEvents({
      forge,
      date: new Date()
        .toISOString(),
      achievements,
    }),
  [
    forge,
    achievements,
  ],
);

const chronicle =
  useMemo(
    () =>
      buildChronicleViewModel(
        events,
      ),
    [events],
  );

  const identityTree =
    useMemo(
      () =>
        buildIdentityTreeViewModel({
          traits: forge.traits,

          // Use the longer history so the tree
          // represents accumulated evidence,
          // rather than only the current week.
          sessions: sessionHistory,

          skills,
        }),
      [
        forge.traits,
        sessionHistory,
        skills,
      ],
    );

  return {
    snapshots:
      snapshotsQuery.data ?? [],

    sessionHistory,
    weekSessions,
    skills,
    lifeAreas,
    achievements,
    briefing,
    events,
    chronicle,
    forge,
    model,
    consistencyHeatmap,
    identityTree,

    isLoading:
      snapshotsQuery.isLoading,

    isError:
      snapshotsQuery.isError,

    error:
      snapshotsQuery.error,

    refetch:
      snapshotsQuery.refetch,
  };
}