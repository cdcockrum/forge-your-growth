export type AdvisorNarrativeInput = {
  greeting: string;

  assessment: string;

  recommendation: {
    title: string;

    explanation: string;

    confidence: number;
  };

  cognitionSummary: {
    headline: string;

    explanation: string;

    confidence: number;

    evidenceCount: number;

    isLearning: boolean;
  };

  strongestBelief?: {
    statement: string;

    confidence: number;
  } | null;

  strongestPattern?: {
    title: string;

    description: string;
  } | null;

  strongestPrediction?: {
    title: string;

    description: string;

    confidence: number;
  } | null;

  primaryRisk?: string | null;

  primaryOpportunity?: string | null;
};

export type AdvisorNarrativeResult = {
  headline: string;

  narrative: string;

  confidence: number;
};

export function buildAdvisorNarrative(
  input: AdvisorNarrativeInput,
): AdvisorNarrativeResult {
  const confidence =
    normalizeScore(
      input.cognitionSummary.confidence,
    );

  const paragraphs = [
    buildObservation(input),
    buildGuidance(input),
    buildQualification(
      input,
      confidence,
    ),
  ].filter(
    (
      paragraph,
    ): paragraph is string =>
      Boolean(paragraph?.trim()),
  );

  return {
    headline: buildHeadline(input),

    narrative: paragraphs.join(
      "\n\n",
    ),

    confidence,
  };
}

function buildHeadline(
  input: AdvisorNarrativeInput,
): string {
  const recommendationTitle =
    cleanHeadline(
      input.recommendation.title,
    );

  if (recommendationTitle) {
    return recommendationTitle;
  }

  const cognitionHeadline =
    cleanHeadline(
      input.cognitionSummary.headline,
    );

  if (cognitionHeadline) {
    return cognitionHeadline;
  }

  return (
    cleanHeadline(input.greeting) ||
    "A clearer direction is emerging"
  );
}

function buildObservation(
  input: AdvisorNarrativeInput,
): string {
  const prediction =
    cleanThought(
      input.strongestPrediction
        ?.description ?? "",
    );

  if (prediction) {
    return prediction;
  }

  const pattern =
    cleanThought(
      input.strongestPattern
        ?.description ?? "",
    );

  if (pattern) {
    return pattern;
  }

  const cognition =
    cleanThought(
      input.cognitionSummary
        .explanation,
    );

  if (cognition) {
    return cognition;
  }

  return cleanThought(
    input.assessment,
  );
}

function buildGuidance(
  input: AdvisorNarrativeInput,
): string {
  const title =
    cleanHeadline(
      input.recommendation.title,
    );

  const explanation =
    cleanThought(
      input.recommendation
        .explanation,
    );

  if (!title) {
    return explanation;
  }

  const action =
    `For now, ${lowercaseFirst(
      title,
    )}.`;

  if (
    !explanation ||
    expressesSameThought(
      title,
      explanation,
    )
  ) {
    return action;
  }

  return `${action} ${explanation}`;
}

function buildQualification(
  input: AdvisorNarrativeInput,
  confidence: number,
): string {
  const evidenceCount =
    input.cognitionSummary
      .evidenceCount;

  if (confidence >= 0.85) {
    return input.cognitionSummary
      .isLearning
      ? "This reading is well supported, but it is not fixed. Forge will continue testing it against what happens next."
      : "This reading is well supported by the available evidence.";
  }

  if (confidence >= 0.6) {
    const evidenceReference =
      evidenceCount > 0
        ? `It draws on ${evidenceCount} pieces of evidence, but some signals still point in different directions.`
        : "Some signals still point in different directions.";

    return `${evidenceReference} Treat this as a useful working interpretation rather than a final judgment.`;
  }

  return "There is not enough consistent evidence yet for a firm conclusion. The next few practices and reflections will matter more than this early reading.";
}

function cleanThought(
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
      /^forge currently believes\s+/i,
      "",
    )
    .replace(
      /^the evidence currently (suggests|indicates|shows|favors)\s+/i,
      "",
    )
    .replace(
      /^the available evidence (suggests|indicates|shows)\s+/i,
      "",
    )
    .replace(
      /^memory and identity evidence converge on\s+/i,
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
      /[.!?]+$/,
      "",
    )
    .replace(
      /,\s*strongest\b/gi,
      "",
    );

  return cleaned
    ? uppercaseFirst(cleaned)
    : "";
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
    0.7
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
    "in",
    "is",
    "it",
    "of",
    "on",
    "the",
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

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
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