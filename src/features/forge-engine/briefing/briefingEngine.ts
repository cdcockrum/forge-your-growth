import type {
  BriefingAction,
  BriefingPriority,
  BriefingStrength,
  BriefingWatchItem,
  BuildDailyBriefingInput,
  DailyBriefing,
} from "./briefing.types";

import {
  average,
  clamp,
  createBriefingId,
  getGreeting,
} from "./briefing.utils";



function buildPriorities(
  input: BuildDailyBriefingInput,
): BriefingPriority[] {
  const { cognitiveState } = input;

  const priorities: BriefingPriority[] = [];

  if (cognitiveState.momentum) {
    priorities.push({
      id: "priority-protect-momentum",
      kind: "protect-momentum",
      title: "Protect current momentum",
      reason:
        "Consistent action is usually more valuable than increasing intensity too quickly.",
      urgency: 0.7,
      confidence: 0.65,
      evidence: [
        {
          source: "momentum",
          description:
            "Momentum data is available in the current cognitive state.",
        },
      ],
    });
  }

  if (cognitiveState.identity) {
    priorities.push({
      id: "priority-reinforce-identity",
      kind: "continue-growth",
      title: "Reinforce the person you are becoming",
      reason:
        "Today’s actions can provide additional evidence for your developing identity.",
      urgency: 0.6,
      confidence: 0.65,
      evidence: [
        {
          source: "identity",
          description:
            "Identity analysis is available in the current cognitive state.",
        },
      ],
    });
  }

  if (cognitiveState.vision) {
    priorities.push({
      id: "priority-review-vision",
      kind: "review-vision",
      title: "Keep today connected to your larger vision",
      reason:
        "A brief vision check can keep immediate activity aligned with long-term direction.",
      urgency: 0.45,
      confidence: 0.6,
      evidence: [
        {
          source: "vision",
          description:
            "A long-term vision is available for contextual guidance.",
        },
      ],
    });
  }

  if (priorities.length === 0) {
    priorities.push({
      id: "priority-create-evidence",
      kind: "general",
      title: "Create one meaningful piece of evidence",
      reason:
        "Forge needs lived experience before it can provide deeper personal intelligence.",
      urgency: 0.5,
      confidence: 0.55,
      evidence: [],
    });
  }

  return priorities
    .sort(
      (left, right) =>
        right.urgency - left.urgency,
    )
    .slice(0, 3);
}

function buildStrengths(
  input: BuildDailyBriefingInput,
): BriefingStrength[] {
  const { cognitiveState } = input;

  const strengths: BriefingStrength[] = [];

  if (cognitiveState.progress) {
    strengths.push({
      id: "strength-visible-progress",
      title: "Your progress is becoming visible",
      description:
        "Forge has enough progress data to begin identifying meaningful development over time.",
      confidence: 0.65,
      evidence: [
        {
          source: "progress",
          description:
            "Progress data is available in the current cognitive state.",
        },
      ],
    });
  }

  if (cognitiveState.memory) {
    strengths.push({
      id: "strength-growing-continuity",
      title: "Your history is beginning to form continuity",
      description:
        "Derived memory is available, allowing current activity to be interpreted within a broader pattern.",
      confidence: 0.65,
      evidence: [
        {
          source: "memory",
          description:
            "Derived memory is available in the current cognitive state.",
        },
      ],
    });
  }

  return strengths.slice(0, 2);
}

function buildWatchItems(
  input: BuildDailyBriefingInput,
): BriefingWatchItem[] {
  const { cognitiveState } = input;

  if (
    cognitiveState.meta.missingDomains.length === 0
  ) {
    return [];
  }

  return [
    {
      id: "watch-limited-context",
      title: "Forge is still building context",
      description:
        "Some cognitive domains do not yet have enough information, so today’s briefing may be more general than future briefings.",
      severity: "low",
      confidence: 1,
      evidence: cognitiveState.meta.missingDomains.map(
        (domain) => ({
          source: domain,
          description: `${domain} data is not currently available.`,
        }),
      ),
    },
  ];
}

function buildRecommendedAction(
  priorities: BriefingPriority[],
): BriefingAction | null {
  const primaryPriority = priorities[0];

  if (!primaryPriority) {
    return null;
  }

  return {
    id: createBriefingId(
      "action",
      primaryPriority.title,
    ),
    title: primaryPriority.title,
    description:
      "Choose one concrete action that supports this priority and complete it before adding more complexity to the day.",
    confidence: primaryPriority.confidence,
    relatedPriorityId: primaryPriority.id,
  };
}

function buildHeadline(
  input: BuildDailyBriefingInput,
): string {
  const { cognitiveState } = input;

  if (
    cognitiveState.meta.status ===
    "insufficient-data"
  ) {
    return "Today is an opportunity to begin creating meaningful evidence.";
  }

  if (
    cognitiveState.meta.status === "limited"
  ) {
    return "Forge is beginning to connect today with your broader development.";
  }

  return "Your current direction is supported by a growing body of evidence.";
}

function buildSummary(
  input: BuildDailyBriefingInput,
): string {
  const { cognitiveState } = input;

  const availableCount =
    cognitiveState.meta.availableDomains.length;

  const totalCount =
    availableCount +
    cognitiveState.meta.missingDomains.length;

  if (availableCount === 0) {
    return (
      "Forge does not yet have enough information for a deeply personalized briefing. " +
      "Completing a practice session or reflection today will begin building that understanding."
    );
  }

  return (
    `Forge currently has useful context from ${availableCount} of ${totalCount} cognitive domains. ` +
    "Today’s briefing emphasizes consistency, identity reinforcement, and alignment with your longer-term direction."
  );
}

export function buildDailyBriefing(
  input: BuildDailyBriefingInput,
): DailyBriefing {
  const now = input.now ?? new Date();

  const priorities = buildPriorities(input);
  const strengths = buildStrengths(input);
  const watchItems = buildWatchItems(input);

  const evidence = [
    ...priorities.flatMap(
      (priority) => priority.evidence,
    ),
    ...strengths.flatMap(
      (strength) => strength.evidence,
    ),
    ...watchItems.flatMap(
      (watchItem) => watchItem.evidence,
    ),
  ];

  const confidence = clamp(
    average([
      input.cognitiveState.meta.confidence,
      ...priorities.map(
        (priority) => priority.confidence,
      ),
      ...strengths.map(
        (strength) => strength.confidence,
      ),
    ]),
  );

  return {
    generatedAt: now.toISOString(),

    greeting: getGreeting(
      now,
      input.userName,
    ),

    headline: buildHeadline(input),
    summary: buildSummary(input),

    priorities,
    strengths,
    watchItems,
    opportunities: [],

    recommendedAction:
      buildRecommendedAction(priorities),

    confidence,
    evidence,
  };
}

export const BriefingEngine = {
  build: buildDailyBriefing,
};