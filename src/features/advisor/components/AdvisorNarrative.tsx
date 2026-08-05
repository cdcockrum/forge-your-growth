import {
  Brain,
} from "lucide-react";

type AdvisorNarrativeProps = {
  headline: string;

  narrative: string;

};

export function AdvisorNarrative({
  headline,
  narrative,
  
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

      

    </section>
  );
}
