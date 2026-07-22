import { ForgeSection } from "@/components/forge";

import type {
  IntelligenceViewModel,
} from "@/features/intelligence/services";

type RecommendationCardProps = {
  model: IntelligenceViewModel["recommendation"];
};

export function RecommendationCard({
  model,
}: RecommendationCardProps) {
  return (
    <ForgeSection
      eyebrow="Recommendation"
      title={model.title}
    >
      <div className="rounded-3xl bg-foreground p-6 text-background md:p-8">
        <p className="text-2xl font-black leading-snug tracking-tight md:text-3xl">
          {model.text}
        </p>
      </div>
    </ForgeSection>
  );
}