import {
  ForgeCard,
  ForgeConfidence,
} from "@/components/forge";

type AdvisorExecutiveSummaryProps = {
  greeting: string;
  summary: string;
  confidence: number;
};

export function AdvisorExecutiveSummary({
  greeting,
  summary,
  confidence,
}: AdvisorExecutiveSummaryProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Executive Briefing
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
            {greeting}
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {summary}
          </p>
        </div>

        <div className="shrink-0">
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Advisor confidence
            </p>

            <ForgeConfidence
                value={confidence}
            />
            </div>
        </div>
      </div>
    </ForgeCard>
  );
}
