import { ForgeSection } from "@/components/forge";

import type {
  IntelligenceViewModel,
} from "@/features/intelligence/services";

type ReasoningSummaryProps = {
  model: IntelligenceViewModel["reasoning"];
};

export function ReasoningSummary({
  model,
}: ReasoningSummaryProps) {
  if (model.items.length === 0) {
    return null;
  }

  return (
    <ForgeSection
      eyebrow="Reasoning summary"
      title="Signals Forge considered"
    >
      <div className="space-y-3">
        {model.items.map((reason) => (
          <div
            key={reason}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <p className="text-sm leading-7 text-muted-foreground">
              {reason}
            </p>
          </div>
        ))}
      </div>
    </ForgeSection>
  );
}