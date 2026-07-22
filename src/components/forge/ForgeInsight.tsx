import type { ReactNode } from "react";

type ForgeInsightProps = {
  title: string;
  children: ReactNode;
};

export function ForgeInsight({
  title,
  children,
}: ForgeInsightProps) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
        Forge Insight
      </p>

      <h3 className="mt-3 text-xl font-bold tracking-tight">
        {title}
      </h3>

      <div className="mt-3 text-base leading-7 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}