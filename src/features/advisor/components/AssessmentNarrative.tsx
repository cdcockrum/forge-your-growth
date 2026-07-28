import {
  ForgeCard,
} from "@/components/forge";

type AssessmentNarrativeProps = {
  narrative: string;
};

export function AssessmentNarrative({
  narrative,
}: AssessmentNarrativeProps) {
  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        Forge Assessment
      </p>

      <p className="mt-4 text-base leading-8">
        {narrative}
      </p>
    </ForgeCard>
  );
}