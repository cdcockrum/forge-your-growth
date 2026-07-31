import { useMemo } from "react";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

import {
  buildAdvisorAnalysisFromForge,
} from "../services/advisorViewModel";

export function useAdvisorAnalysis() {
  const {
    forge,
  } = useTodayDashboard();

  return useMemo(
    () =>
      buildAdvisorAnalysisFromForge(
        forge,
      ),
    [forge],
  );
}