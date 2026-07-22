import {
  buildPatternSummary,
} from "@/features/forge-engine";

import {
  mapReflectionRow,
  useReflections,
} from "@/features/reflection";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

export function useInsights() {
  const dashboard = useTodayDashboard();

  const reflectionsQuery =
    useReflections();

  const reflectionEntries =
    (reflectionsQuery.data ?? []).map(
      mapReflectionRow,
    );

  const patterns =
    buildPatternSummary(
      reflectionEntries,
      dashboard.todaySessions,
    );

  return {
    advisor:
      dashboard.model.hero.advisor,

    insight:
      dashboard.model.hero.insight,

    patterns,

    reflectionsLoading:
      reflectionsQuery.isLoading,

    reflectionsError:
      reflectionsQuery.error,
  };
}