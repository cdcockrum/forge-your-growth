import {
  useMemo,
} from "react";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

import {
  buildCognitiveGraph,
} from "../services/buildCognitiveGraph";

import type {
  CognitiveWorkspace,
} from "../types";

export function useCognitiveWorkspace(): CognitiveWorkspace {
  const {
    forge,
  } = useTodayDashboard();

  return useMemo(
    () =>
      buildCognitiveGraph(
        forge,
      ),
    [
      forge,
    ],
  );
}