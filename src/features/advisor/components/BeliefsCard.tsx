import {
  AdvisorAssessmentCard,
} from "./AdvisorAssessmentCard";

type AdvisorBelief = {
  id: string;
  statement: string;
  confidence: number;
};

type BeliefsCardProps = {
  beliefs: AdvisorBelief[];
};

export function BeliefsCard({
  beliefs,
}: BeliefsCardProps) {
  const strongestBelief =
    beliefs[0];

  if (!strongestBelief) {
    return (
      <AdvisorAssessmentCard
        eyebrow="Belief"
        title="Forge is still forming its understanding."
        description="Complete practices and reflections so Forge can identify stable beliefs about your growth."
      />
    );
  }

  return (
    <AdvisorAssessmentCard
      eyebrow="Strongest Belief"
      title={strongestBelief.statement}
      description="This belief currently has the strongest support among Forge’s available observations."
      confidence={strongestBelief.confidence}
      footer={
        <p className="text-xs text-muted-foreground">
          Based on accumulated identity, practice, and evidence signals.
        </p>
      }
    />
  );
}