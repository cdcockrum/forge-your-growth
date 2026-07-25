import {
  ForgeCard,
} from "@/components/forge";

import {
  useAdvisor,
} from "../hooks/useAdvisor";

export function AdvisorCard() {
  const advisor =
    useAdvisor();

  return (
    <ForgeCard className="space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Advisor
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          {advisor.greeting}
        </h2>

        <p className="mt-3 text-sm text-muted-foreground leading-7">
          {advisor.overview}
        </p>
      </div>

      <div className="space-y-3">
        {advisor.insights.map(
          (insight) => (
            <div
              key={insight.id}
              className="rounded-xl border border-border p-4"
            >
              <h3 className="font-semibold">
                {insight.title}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {insight.description}
              </p>
            </div>
          ),
        )}
      </div>
    </ForgeCard>
  );
}