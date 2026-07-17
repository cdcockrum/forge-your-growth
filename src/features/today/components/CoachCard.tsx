import {
  CoachPanel,
} from "@/features/coach";

import type {
  ForgeCoachResult,
} from "@/features/forge-engine";

export function CoachCard({
  coach,
}:{
  coach: ForgeCoachResult;
}){

  return (
    <div className="mb-8">

      <CoachPanel
        coach={coach}
      />

    </div>
  );
}