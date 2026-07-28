import {
  useMemo,
} from "react";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

import {
  buildAdvisorViewModel,
  type AdvisorViewModel,
} from "../services/advisorViewModel";

export function useAdvisor(): AdvisorViewModel {
  const {
    forge,
  } = useTodayDashboard();

  return useMemo(
    () =>
      buildAdvisorViewModel(
        forge,
      ),
    [
      forge,
    ],
  );
}