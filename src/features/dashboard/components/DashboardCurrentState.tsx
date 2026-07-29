import {
  Activity,
  Clock3,
  Flame,
  Gauge,
} from "lucide-react";
import { ReactNode } from "react";

type DashboardCurrentStateProps = {
  forgeHealth: {
    score: number;
    grade: string;
    breakdown: {
      completion: number;
      consistency: number;
      balance: number;
      reflection: number;
    };
  };

  forgePoints: {
    score: number;
  };

  consistency: number;
  completedThisWeek: number;
  totalSessions: number;
  totalHours: number;
};

export function DashboardCurrentState({
  forgeHealth,
  forgePoints,
  consistency,
  completedThisWeek,
  totalSessions,
  totalHours,
}: DashboardCurrentStateProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Current State
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-extrabold tracking-tighter">
              {forgeHealth.score}
            </p>

            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Forge Score
            </p>
          </div>

          <span className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent">
            {forgeHealth.grade}
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{
              width: `${Math.max(
                0,
                Math.min(100, forgeHealth.score),
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2">
        <Metric
          icon={<Flame className="size-4" />}
          label="Forge Points"
          value={forgePoints.score.toLocaleString()}
          description="Practice and reflection"
        />

        <Metric
          icon={<Activity className="size-4" />}
          label="Consistency"
          value={`${consistency}%`}
          description={`${completedThisWeek} of ${totalSessions} sessions`}
        />

        <Metric
          icon={<Clock3 className="size-4" />}
          label="Practice"
          value={`${totalHours}h`}
          description="Completed this week"
        />

        <Metric
          icon={<Gauge className="size-4" />}
          label="Balance"
          value={`${forgeHealth.breakdown.balance}`}
          description="Across life areas"
        />
      </div>

      <details className="border-t border-border px-5 py-4">
        <summary className="cursor-pointer list-none text-xs font-bold text-muted-foreground transition hover:text-foreground">
          View score breakdown
        </summary>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <Breakdown
            label="Completion"
            value={forgeHealth.breakdown.completion}
          />

          <Breakdown
            label="Consistency"
            value={forgeHealth.breakdown.consistency}
          />

          <Breakdown
            label="Balance"
            value={forgeHealth.breakdown.balance}
          />

          <Breakdown
            label="Reflection"
            value={forgeHealth.breakdown.reflection}
          />
        </div>
      </details>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="border-b border-r border-border p-4 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}

        <p className="font-mono text-[9px] uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-extrabold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Breakdown({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}