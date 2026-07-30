export interface BuildSummaryInput {
  dominantTheme: string | null;

  priorities: string[];

  opportunities: string[];

  risks: string[];
}

export function buildSummary({
  dominantTheme,
  priorities,
  opportunities,
  risks,
}: BuildSummaryInput): string {
  const parts: string[] = [];

  if (dominantTheme) {
    parts.push(dominantTheme);
  }

  const primaryPriority =
    priorities[0];

  if (primaryPriority) {
    parts.push(
      `The current priority is to ${lowercaseOpening(
        primaryPriority,
      )}`,
    );
  }

  const primaryOpportunity =
    opportunities[0];

  if (primaryOpportunity) {
    parts.push(primaryOpportunity);
  }

  const primaryRisk =
    risks[0];

  if (primaryRisk) {
    parts.push(
      `The primary risk is that ${lowercaseOpening(
        primaryRisk,
      )}`,
    );
  }

  return parts.join(" ");
}

function lowercaseOpening(
  value: string,
): string {
  if (value.length === 0) {
    return value;
  }

  return (
    value.charAt(0).toLowerCase() +
    value.slice(1)
  );
}