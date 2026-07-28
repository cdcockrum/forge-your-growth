import {
  ArrowUpRight,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type RecommendationPriority =
  | "low"
  | "medium"
  | "high";

type RecommendationCardProps = {
  title: string;
  explanation: string;
  priority: RecommendationPriority;
};

export function RecommendationCard({
  title,
  explanation,
  priority,
}: RecommendationCardProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Primary Recommendation
          </p>

          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {explanation}
          </p>
        </div>

        <div className="shrink-0">
          <PriorityBadge
            priority={
              priority
            }
          />
        </div>
      </div>

      <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-sm font-semibold">
        <ArrowUpRight className="size-4" />

        Highest-leverage next step
      </div>
    </ForgeCard>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: RecommendationPriority;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Priority
      </p>

      <p className="mt-1 text-sm font-black uppercase tracking-wider">
        {priority}
      </p>
    </div>
  );
}