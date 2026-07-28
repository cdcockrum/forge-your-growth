import {
  AdvisorAssessmentCard,
} from "./AdvisorAssessmentCard";

type Pattern = {
  title: string;
  description: string;
  confidence: "low" | "medium" | "high";
  recommendation?: string;
} | null;

type PatternCardProps = {
  pattern: Pattern;
};

function confidenceToNumber(
  confidence: "low" | "medium" | "high",
): number {
  switch (confidence) {
    case "high":
      return 90;

    case "medium":
      return 70;

    case "low":
      return 45;
  }
}

export function PatternCard({
  pattern,
}: PatternCardProps) {
  if (!pattern) {
    return (
      <AdvisorAssessmentCard
        eyebrow="Pattern"
        title="Forge is still observing."
        description="Patterns emerge after repeated behavior over time."
      />
    );
  }

  return (
    <AdvisorAssessmentCard
      eyebrow="Emerging Pattern"
      title={pattern.title}
      description={pattern.description}
      confidence={confidenceToNumber(
        pattern.confidence,
      )}
      footer={
        pattern.recommendation ? (
          <p className="text-xs text-muted-foreground">
            Recommendation: {pattern.recommendation}
          </p>
        ) : undefined
      }
    />
  );
}
