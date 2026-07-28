import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  ForgePage,
} from "@/components/forge";

import {
  CognitiveCanvas,
} from "@/features/cognitive";

export const Route = createFileRoute(
  "/_authenticated/cognitive",
)({
  component: CognitivePage,
});

function CognitivePage() {
  return (
    <ForgePage>
      <CognitiveCanvas />
    </ForgePage>
  );
}