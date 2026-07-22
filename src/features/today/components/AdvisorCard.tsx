import { ForgeCard } from "@/components/forge";
import type { AdvisorBriefing } from "@/features/forge-engine";

type AdvisorCardProps = {
  advisor: AdvisorBriefing;
};

export function AdvisorCard({
  advisor,
}: AdvisorCardProps) {
  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Forge Advisor
      </p>

      <h2 className="mt-3 text-2xl font-extrabold">
        {advisor.title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {advisor.message}
      </p>

      <div className="mt-6 space-y-3">
        {advisor.actions.map((action) => (
          <div
            key={action}
            className="rounded-xl border border-border bg-background px-4 py-3"
          >
            {action}
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Why Forge chose this
        </p>

        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {advisor.reasoning.map((reason) => (
            <li key={reason}>
              • {reason}
            </li>
          ))}
        </ul>
      </div>
    </ForgeCard>
  );
}
