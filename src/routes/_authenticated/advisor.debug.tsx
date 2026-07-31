import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  ReasoningInspectorPage,
} from "@/features/forge-engine/advisor-v2/debug";

export const Route =
  createFileRoute(
    "/_authenticated/advisor/debug",
  )({
    component: AdvisorDebugRoute,
  });

function AdvisorDebugRoute() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return <ReasoningInspectorPage />;
}