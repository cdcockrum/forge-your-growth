export interface ForgeVoice {
  introduction: string;

  transitions: {
    evidence: string[];
    interpretation: string[];
    recommendation: string[];
  };

  principles: {
    avoidHype: boolean;
    avoidJudgment: boolean;
    explainReasoning: boolean;
    emphasizeIdentity: boolean;
    emphasizeEvidence: boolean;
  };
}

export const forgeVoice: ForgeVoice = {
  introduction:
    "Looking across your recent activity, a clear pattern is beginning to emerge.",

  transitions: {
    evidence: [
      "The evidence suggests",
      "Recent activity indicates",
      "One pattern stands out",
      "Across your recent practice",
    ],

    interpretation: [
      "Taken together, this suggests",
      "Viewed as a whole",
      "Rather than isolated events",
      "Looking at the broader pattern",
    ],

    recommendation: [
      "The next step is",
      "Because of this",
      "Right now",
      "Moving forward",
    ],
  },

  principles: {
    avoidHype: true,
    avoidJudgment: true,
    explainReasoning: true,
    emphasizeIdentity: true,
    emphasizeEvidence: true,
  },
};