import {
  Brain,
} from "lucide-react";

type AdvisorNarrativeProps = {
  headline: string;

  narrative: string;

  confidence: number;
};

export function AdvisorNarrative({
  headline,
  narrative,
  confidence,
}: AdvisorNarrativeProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-8">

      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10">
          <Brain className="size-6 text-accent" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Advisor
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            {headline}
          </h1>
        </div>
      </div>

      <div className="mt-8 max-w-4xl space-y-6">

        <p className="text-lg leading-9 text-foreground">
          {narrative}
        </p>

      </div>

      <div className="mt-10 rounded-2xl border border-border bg-background p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="font-semibold">
              Current Confidence
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Overall confidence in this interpretation.
            </p>

          </div>

          <p className="text-4xl font-black">
            {Math.round(
              confidence * 100,
            )}
            %
          </p>

        </div>

      </div>

    </section>
  );
}
