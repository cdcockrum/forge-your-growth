import type {
  MorningBriefing,
} from "./briefing.types";

import type {
  ForgeState,
} from "../forge.types";

export function buildMorningBriefing(
  forge: ForgeState,
): MorningBriefing {

  const strongest =
    forge.identity.strongestIdentity;

  return {

    greeting:
      "Good morning.",

    title:
      strongest
        ? `${strongest.identity.name} Week`
        : "A New Week",

    message:
      forge.intelligence.summary,

    priorities: [
      forge.intelligence.recommendation,
    ],

    warning:
      forge.progress.completionRate < 40
        ? "Momentum is slipping."
        : undefined,

    encouragement:
      forge.narrative.closing,
  };

}