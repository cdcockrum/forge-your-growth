import {
  AdvisorAssessmentCard,
} from "./AdvisorAssessmentCard";

type Prediction = {
  title: string;
  description: string;
  confidence: number;
  recommendation: string;
};

type PredictionCardProps = {
  prediction: Prediction | null;
};

export function PredictionCard({
  prediction,
}: PredictionCardProps) {
  if (!prediction) {
    return (
      <AdvisorAssessmentCard
        eyebrow="Prediction"
        title="Forge is not yet confident enough to forecast."
        description="As more observations accumulate, Forge will begin predicting future outcomes."
      />
    );
  }

  return (
    <AdvisorAssessmentCard
      eyebrow="Prediction"
      title={prediction.title}
      description={prediction.description}
      confidence={prediction.confidence}
      footer={
        <p className="text-xs text-muted-foreground">
          Recommendation:
          {" "}
          {prediction.recommendation}
        </p>
      }
    />
  );
}