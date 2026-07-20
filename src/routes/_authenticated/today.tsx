import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ForgePage } from "@/components/forge";

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

import {
  TodayContent,
  TodayLoadingState,
} from "@/features/today";

export const Route = createFileRoute(
  "/_authenticated/today",
)({
  loader: async ({ context }) => {
    const today = todayIso();
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(
        profileQuery(),
      ),
      context.queryClient.ensureQueryData(
        skillsQuery(),
      ),
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        sessionsForDateQuery(today),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
      context.queryClient.ensureQueryData(
        achievementsQuery(),
      ),
      context.queryClient.ensureQueryData(
        focusItemsForDateQuery(today),
      ),
    ]);
  },
  component: TodayPage,
});

function TodayPage() {
  return (
    <ForgePage>
      <Suspense fallback={<TodayLoadingState />}>
        <TodayContent />
      </Suspense>
    </ForgePage>
  );
}