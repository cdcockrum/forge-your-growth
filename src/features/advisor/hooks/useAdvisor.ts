import {
  useMemo,
} from "react";

import {
  buildAdvisorSummary,
} from "../engine/AdvisorEngine";

export function useAdvisor() {
  return useMemo(
    () =>
      buildAdvisorSummary(),
    [],
  );
}