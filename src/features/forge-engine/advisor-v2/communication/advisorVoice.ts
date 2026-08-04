export type AdvisorVoiceTone =
  | "confident"
  | "cautious"
  | "exploratory";

export type AdvisorVoiceResult = {
  opening: string;

  transition: string;

  closing: string;
};

export function buildAdvisorVoice(
  confidence: number,
): AdvisorVoiceResult {

  if (confidence >= 0.85) {
    return {
      opening:
        "The current evidence points strongly toward one conclusion.",

      transition:
        "Several independent observations support this interpretation.",

      closing:
        "I'll continue testing this conclusion as new evidence appears.",
    };
  }

  if (confidence >= 0.60) {
    return {
      opening:
        "The evidence currently favors this interpretation.",

      transition:
        "There are still alternative explanations worth monitoring.",

      closing:
        "Future observations may strengthen or weaken this conclusion.",
    };
  }

  return {
    opening:
      "The available evidence is still limited.",

    transition:
      "Several interpretations remain plausible.",

    closing:
      "More observations are needed before I become confident.",
    };
  }
