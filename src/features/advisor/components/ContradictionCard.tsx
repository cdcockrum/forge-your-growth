import {
  AlertTriangle,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type AdvisorContradiction = {
  title: string;
  explanation: string;
  severity:
    | "low"
    | "medium"
    | "high";
  evidence: string[];
};

type ContradictionCardProps = {
  contradiction:
    | AdvisorContradiction
    | undefined;
};

export function ContradictionCard({
  contradiction,
}: ContradictionCardProps) {
  if (!contradiction) {
    return (
      <ForgeCard
        padding="large"
        variant="dashed"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              Contradictions
            </p>

            <h2 className="mt-3 text-xl font-black tracking-tight">
              No meaningful conflict detected.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Your present behavior does not strongly conflict with the direction Forge can currently observe.
            </p>
          </div>
        </div>
      </ForgeCard>
    );
  }

  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0" />

            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              Strongest Contradiction
            </p>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
            {contradiction.title}
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {contradiction.explanation}
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-border bg-background px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Severity
          </p>

          <p className="mt-1 text-sm font-black uppercase tracking-wider">
            {contradiction.severity}
          </p>
        </div>
      </div>

      {contradiction.evidence.length > 0 && (
        <div className="mt-7 border-t border-border pt-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Evidence
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {contradiction.evidence.map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      )}
    </ForgeCard>
  );
}