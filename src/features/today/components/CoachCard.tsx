import {
  useNavigate,
} from "@tanstack/react-router";

import {
  CoachPanel,
} from "@/features/coach";

import type {
  CoachRecommendation,
  ForgeCoachResult,
} from "@/features/forge-engine";

type CoachCardProps = {
  coach: ForgeCoachResult;
};

export function CoachCard({
  coach,
}: CoachCardProps) {
  const navigate =
    useNavigate();

  function handleRecommendationAction(
    recommendation:
      CoachRecommendation,
  ) {
    switch (
      recommendation.actionType
    ) {
      case "reflect":
        void navigate({
          to: "/review",
        });

        return;

      case "practice":
      case "adjust_plan":
      case "recover":
      case "maintain":
      default:
        void navigate({
          to: "/plan",
        });
    }
  }

  return (
    <div className="mb-8">
      <CoachPanel
        coach={coach}
        onRecommendationAction={
          handleRecommendationAction
        }
      />
    </div>
  );
}