import { createFileRoute } from "@tanstack/react-router";

import { ObservatoryPage } from "@/features/observatory/pages/ObservatoryPage";

export const Route = createFileRoute(
  "/_authenticated/observatory",
)({
  component: ObservatoryPage,
});