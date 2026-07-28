import {
  ForgeCard,
  ForgeConfidence,
} from "@/components/forge";

type AdvisorAssessmentCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  confidence?: number;
  footer?: React.ReactNode;
};

export function AdvisorAssessmentCard({
  eyebrow,
  title,
  description,
  confidence,
  footer,
}: AdvisorAssessmentCardProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              {eyebrow}
            </p>

            <h3 className="mt-2 text-xl font-black tracking-tight">
              {title}
            </h3>
          </div>

          {confidence !== undefined && (
            <ForgeConfidence value={confidence} />
          )}
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {footer && (
          <div className="border-t border-border pt-4">
            {footer}
          </div>
        )}
      </div>
    </ForgeCard>
  );
}