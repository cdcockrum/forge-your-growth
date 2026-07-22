import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  achievementsQuery,
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  weekBounds,
} from "@/features/forge/queries";

import {
  IntelligencePage,
} from "@/features/intelligence";

import {
  visionQuery,
} from "@/features/vision";

export const Route = createFileRoute(
  "/_authenticated/intelligence",
)({
  loader: async ({ context }) => {
    const { start, end } =
      weekBounds();

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
        sessionsInRangeQuery(
          start,
          end,
        ),
      ),

      context.queryClient.ensureQueryData(
        achievementsQuery(),
      ),

      context.queryClient.ensureQueryData(
        visionQuery(),
      ),
    ]);
  },

  component: IntelligencePage,
});