import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type AdvisorActionsCardProps = {
  actions: string[];
};

export function AdvisorActionsCard({
  actions,
}: AdvisorActionsCardProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <ForgeCard padding="large">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-5 shrink-0" />

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Recommended Actions
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Turn the recommendation into practice
          </h2>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {actions.map(
          (action, index) => (
            <div
              key={`${index}-${action}`}
              className="flex items-start gap-4 rounded-2xl border border-border p-4"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-bold">
                {index + 1}
              </div>

              <p className="flex-1 pt-1 text-sm leading-6">
                {action}
              </p>

              <ArrowRight className="mt-1.5 size-4 shrink-0 text-muted-foreground" />
            </div>
          ),
        )}
      </div>
    </ForgeCard>
  );
}