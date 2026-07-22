import {
  ForgeBadge,
  ForgeConfidence,
} from "@/components/forge";

import type {
  IntelligenceViewModel,
} from "@/features/intelligence/services";

type IntelligenceHeroProps = {
  firstName: string;
  model: IntelligenceViewModel["hero"];
};

export function IntelligenceHero({
  firstName,
  model,
}: IntelligenceHeroProps) {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Forge Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
          What Forge understands.
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {firstName}, this conclusion combines your
          progress, momentum, identity, memory, history,
          narrative, advisor, and Vision.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ForgeBadge>
            Today&apos;s conclusion
          </ForgeBadge>

          <ForgeConfidence value={model.confidence} />
        </div>

        <h2 className="mt-6 max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl">
          {model.title}
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
          {model.summary}
        </p>
      </section>
    </div>
  );
}