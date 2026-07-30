import type {
  Narrative,
} from "./narrative.types";

import {
  forgeVoice,
} from "./voice";

export function composeConversation(
  narrative: Narrative,
): string {
  const parts: string[] = [];

  parts.push(
    forgeVoice.introduction,
  );

  parts.push(
    describeNarrative(
      narrative,
    ),
  );

  parts.push(
    describeRecommendation(
      narrative,
    ),
  );

  return parts.join(" ");
}

function describeNarrative(
  narrative: Narrative,
): string {
  switch (narrative.primaryTheme) {
    case "identity":
      switch (narrative.primaryState) {
        case "strengthening":
          return "Your recent actions continue to reinforce the identity you're intentionally building.";

        case "slowing":
          return "The broader direction is still visible, but your recent behavior isn't reinforcing it as consistently.";

        case "steady":
          return "Your recent actions continue to provide stable evidence for the person you're becoming.";

        default:
          return "Forge is still gathering enough evidence to understand how your recent actions affect your identity.";
      }

    case "momentum":
      switch (narrative.primaryState) {
        case "strengthening":
          return "Your recent activity is beginning to build on itself, making continued progress easier to sustain.";

        case "slowing":
          return "Your recent pace has slowed, although your broader direction remains intact.";

        case "steady":
          return "Your recent pace has remained relatively stable.";

        default:
          return "Your recent momentum is still developing into a clearer pattern.";
      }

    case "vision":
      switch (narrative.primaryState) {
        case "strengthening":
          return "Your daily actions continue to align with the direction you've chosen for yourself.";

        case "slowing":
          return "Some recent choices have drifted away from your longer-term direction.";

        default:
          return "Forge is continuing to evaluate how your daily actions relate to your longer-term vision.";
      }

    default:
      return "A meaningful pattern is beginning to emerge from your recent activity.";
  }
}

function describeRecommendation(
  narrative: Narrative,
): string {
  switch (narrative.recommendation) {
    case "maintainConsistency":
      return "Right now, consistency matters more than intensity. Continue reinforcing the pattern you're building.";

    case "restoreConsistency":
      return "The next meaningful step is to restore regular practice before trying to increase effort.";

    case "continueGrowth":
      return "Continue building on the habits that are already supporting your progress.";

    default:
      return "Forge will continue learning from your recent activity and refine its guidance as new evidence becomes available.";
  }
}