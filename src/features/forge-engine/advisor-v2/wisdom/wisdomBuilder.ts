import type {
  ExecutiveJudgment,
} from "../executive-judgment";

import type {
  LearningResult,
} from "../learning";

import type {
  Reflection,
} from "../reflection";

import type {
  ReasoningResult,
} from "../reasoning";

import type {
  Simulation,
} from "../simulation";

import type {
  Wisdom,
  WisdomInsight,
} from "./wisdom.types";

export function buildWisdom(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
  reflection: Reflection,
  simulation: Simulation,
  learning: LearningResult | null = null,
): Wisdom {
  const insights =
    buildInsights(
      reasoning,
      judgment,
    );

  return {
    narrative:
      buildWisdomNarrative(
        judgment,
        reflection,
      ),

    insights,

    longTermThemes:
      buildLongTermThemes(
        reasoning,
        judgment,
      ),

    emergingIdentity:
      buildEmergingIdentity(
        reasoning,
      ),

    cautions:
      buildCautions(
        reflection,
        simulation,
      ),

    opportunities:
      buildOpportunities(
        judgment,
        simulation,
        learning,
      ),

    confidence:
      normalizeConfidence(
        judgment.confidence,
      ),
  };
}

function buildInsights(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): WisdomInsight[] {
  const strongest =
    reasoning.interpretation.strongest;

  const insights:
    WisdomInsight[] = [];

  if (strongest) {
    insights.push({
      id:
        `wisdom-${strongest.id}`,

      title:
        presentInsightTitle(
          strongest.title,
        ),

      explanation:
        presentThought(
          strongest.description,
        ),

      confidence:
        normalizeConfidence(
          strongest.confidence,
        ),

      evidenceIds: [
        ...strongest.supportingEvidence,
      ],
    });
  }

  const judgmentExplanation =
    presentThought(
      judgment.summary,
    );

  const strongestExplanation =
    strongest
      ? presentThought(
          strongest.description,
        )
      : "";

  if (
    judgmentExplanation &&
    !expressesSameThought(
      judgmentExplanation,
      strongestExplanation,
    )
  ) {
    insights.push({
      id:
        "wisdom-executive-judgment",

      title:
        presentInsightTitle(
          judgment.headline,
        ),

      explanation:
        judgmentExplanation,

      confidence:
        normalizeConfidence(
          judgment.confidence,
        ),

      evidenceIds: [
        ...reasoning.interpretation
          .supportingEvidence,
      ],
    });
  }

  return insights.slice(0, 2);
}

function buildWisdomNarrative(
  judgment: ExecutiveJudgment,
  reflection: Reflection,
): string {
  const judgmentSummary =
    presentThought(
      judgment.summary,
    );

  const uncertainty =
    presentThought(
      reflection.uncertainties[0] ??
        "",
    );

  const statements = [
    judgmentSummary,

    uncertainty &&
    !expressesSameThought(
      uncertainty,
      judgmentSummary,
    )
      ? `There is still some uncertainty: ${lowercaseFirst(
          uncertainty,
        )}`
      : "",
  ];

  return uniqueStrings(
    statements,
  )
    .slice(0, 2)
    .join(" ");
}

function buildLongTermThemes(
  reasoning: ReasoningResult,
  judgment: ExecutiveJudgment,
): string[] {
  const situationTheme =
    getSituationTheme(
      judgment.situation,
    );

  const agreements =
    reasoning.analysis
      .agreements
      .sort(
        (left, right) =>
          right.strength -
          left.strength,
      )
      .map(
        (agreement) =>
          presentThought(
            agreement.explanation,
          ),
      );

  return uniqueStrings([
    situationTheme,
    ...agreements,
  ]).slice(0, 3);
}

function buildEmergingIdentity(
  reasoning: ReasoningResult,
): string[] {
  const identityEvidence =
    reasoning.graph.nodes
      .map(
        (node) =>
          node.evidence,
      )
      .filter(
        (evidence) =>
          evidence.category ===
          "identity",
      )
      .sort(
        (left, right) =>
          evidenceScore(right) -
          evidenceScore(left),
      )
      .map(
        (evidence) =>
          presentThought(
            evidence.statement,
          ),
      );

  return uniqueStrings(
    identityEvidence,
  ).slice(0, 3);
}

function buildCautions(
  reflection: Reflection,
  simulation: Simulation,
): string[] {
  const uncertainties =
    reflection.uncertainties.map(
      presentThought,
    );

  const evidenceNeeded =
    reflection
      .additionalEvidenceNeeded
      .map(
        presentThought,
      );

  const worstCase =
    presentThought(
      simulation.worstCase
        .description,
    );

  return uniqueStrings([
    ...uncertainties,
    ...evidenceNeeded,
    worstCase,
  ]).slice(0, 3);
}

function buildOpportunities(
  judgment: ExecutiveJudgment,
  simulation: Simulation,
  learning: LearningResult | null,
): string[] {
  const bestCase =
    presentThought(
      simulation.bestCase
        .description,
    );

  const recommendations =
    simulation.bestCase
      .recommendations
      .map(
        presentThought,
      );

  const learnedOpportunities =
    learning?.effectiveness
      .filter(
        (item) =>
          item.effectivenessScore >=
          0.65,
      )
      .map(
        () =>
          "A previously recommended action appears to be helping. Continuing it may provide stronger evidence.",
      ) ?? [];

  const accelerationOpportunity =
    judgment.situation ===
    "accelerating"
      ? "Protect the practices that are creating momentum."
      : "";

  return uniqueStrings([
    bestCase,
    ...recommendations,
    accelerationOpportunity,
    ...learnedOpportunities,
  ]).slice(0, 3);
}

function getSituationTheme(
  situation:
    ExecutiveJudgment["situation"],
): string {
  switch (situation) {
    case "accelerating":
      return "Your recent progress appears to be gaining strength.";

    case "recovering":
      return "You appear to be rebuilding consistency after an interruption.";

    case "plateauing":
      return "Your progress appears steady, though it is not accelerating yet.";

    default:
      return "";
  }
}

function presentInsightTitle(
  value: string,
): string {
  const lower =
    value.toLowerCase();

  if (
    lower.includes("identity") &&
    lower.includes("alignment")
  ) {
    return "Your actions are beginning to support your identity";
  }

  if (
    lower.includes("identity")
  ) {
    return "Your emerging identity is becoming clearer";
  }

  if (
    lower.includes("momentum")
  ) {
    return "Your momentum is becoming more consistent";
  }

  if (
    lower.includes("direction")
  ) {
    return "Your direction is becoming clearer";
  }

  if (
    lower.includes("evidence")
  ) {
    return "A meaningful pattern is beginning to emerge";
  }

  return cleanHeadline(value);
}

function presentThought(
  value: string,
): string {
  const cleaned = value
    .trim()
    .replace(
      /\s+/g,
      " ",
    )
    .replace(
      /\.\.+/g,
      ".",
    )
    .replace(
      /,\s*strongest\b/gi,
      "",
    )
    .replace(
      /memory and identity evidence converge on a consistent interpretation of identity/gi,
      "your reflections and recent choices are beginning to point in the same direction",
    )
    .replace(
      /meaningful contradictory evidence remains, so this interpretation should be treated cautiously/gi,
      "some recent signals still do not fit that picture, so it should remain open to revision",
    )
    .replace(
      /some evidence supports opposing conclusions/gi,
      "some recent evidence points in another direction",
    )
    .replace(
      /the current direction continues to strengthen as supportive behavior becomes more consistent/gi,
      "your recent choices are supporting this direction more consistently",
    )
    .replace(
      /maintain the current direction while continuing to gather evidence/gi,
      "keep following this direction while paying attention to what happens",
    )
    .replace(
      /^the evidence currently favors this interpretation,?\s*/i,
      "",
    )
    .replace(
      /^evidence indicates\s+/i,
      "",
    )
    .replace(
      /^the available evidence (suggests|indicates|shows)\s+/i,
      "",
    )
    .replace(
      /^forge currently believes\s+/i,
      "",
    );

  if (!cleaned) {
    return "";
  }

  const sentence =
    uppercaseFirst(cleaned);

  return /[.!?]$/.test(sentence)
    ? sentence
    : `${sentence}.`;
}

function cleanHeadline(
  value: string,
): string {
  const cleaned = value
    .trim()
    .replace(
      /\s+/g,
      " ",
    )
    .replace(
      /,\s*strongest\b/gi,
      "",
    )
    .replace(
      /[.!?]+$/,
      "",
    );

  return cleaned
    ? uppercaseFirst(cleaned)
    : "A meaningful pattern is emerging";
}

function expressesSameThought(
  left: string,
  right: string,
): boolean {
  const leftWords =
    meaningfulWords(left);

  const rightWords =
    meaningfulWords(right);

  if (
    leftWords.size === 0 ||
    rightWords.size === 0
  ) {
    return false;
  }

  const overlap =
    [...leftWords].filter(
      (word) =>
        rightWords.has(word),
    ).length;

  return (
    overlap /
      Math.min(
        leftWords.size,
        rightWords.size,
      ) >=
    0.65
  );
}

function meaningfulWords(
  value: string,
): Set<string> {
  const ignored = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "for",
    "from",
    "in",
    "is",
    "it",
    "of",
    "on",
    "that",
    "the",
    "this",
    "to",
    "your",
  ]);

  return new Set(
    value
      .toLowerCase()
      .replace(
        /[^a-z0-9\s]/g,
        " ",
      )
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 1 &&
          !ignored.has(word),
      ),
  );
}

function evidenceScore(
  evidence: ReasoningResult[
    "graph"
  ]["nodes"][number]["evidence"],
): number {
  return (
    normalizeConfidence(
      evidence.confidence,
    ) *
    evidence.impact
  );
}

function uniqueStrings(
  values: string[],
): string[] {
  const seen =
    new Set<string>();

  return values.filter(
    (value) => {
      const trimmed =
        value.trim();

      if (!trimmed) {
        return false;
      }

      const key =
        trimmed
          .toLowerCase()
          .replace(
            /[^a-z0-9\s]/g,
            "",
          )
          .replace(
            /\s+/g,
            " ",
          );

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    },
  );
}

function lowercaseFirst(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  return (
    trimmed.charAt(0)
      .toLowerCase() +
    trimmed.slice(1)
  );
}

function uppercaseFirst(
  value: string,
): string {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  return (
    trimmed.charAt(0)
      .toUpperCase() +
    trimmed.slice(1)
  );
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}