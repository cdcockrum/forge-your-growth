import {
  CoachPanel,
} from "@/features/coach";

import type {
  CoachRecommendation,
  ForgeCoachResult,
} from "@/features/forge-engine";

type CoachCardProps = {
  coach: ForgeCoachResult;

  onRecommendationAction?: (
    recommendation: CoachRecommendation,
  ) => void;
};

export function CoachCard({
  coach,
  onRecommendationAction,
}: CoachCardProps) {
  return (
    <div className="mb-8">
      <CoachPanel
        coach={coach}
        onRecommendationAction={
          onRecommendationAction
        }
      />
    </div>
  );
}