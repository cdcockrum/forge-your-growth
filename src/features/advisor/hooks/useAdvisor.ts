import {
  useMemo,
} from "react";

import {
  useAdvisorAdaptiveLearning,
} from "@/features/advisor-learning";

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

  const adaptiveLearningQuery =
    useAdvisorAdaptiveLearning();

  return useMemo(
    () =>
      buildAdvisorViewModel(
        forge,
        adaptiveLearningQuery.data ??
          null,
      ),
    [
      forge,
      adaptiveLearningQuery.data,
    ],
  );
}