import {
  LoadingState,
} from "@/components/forge/forge-ui";

export function TodayLoadingState() {
  return (
    <LoadingState
      title="Preparing today’s briefing"
      description="Gathering your plan, current progress, momentum, and recent intelligence."
      cards={5}
    />
  );
}