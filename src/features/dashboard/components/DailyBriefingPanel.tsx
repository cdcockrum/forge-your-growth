import type { DailyBriefing } from "@/features/forge-engine/briefing";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { Link } from "@tanstack/react-router";

type Props = {
  briefing: DailyBriefing;
};

export function DailyBriefingPanel({
  briefing,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface">
      <div className="border-b border-border p-8">
        <div className="mb-3 flex items-center gap-2 text-accent">
          <Sparkles className="size-4" />

          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
            Forge Briefing
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {briefing.greeting}
        </p>

        <h2 className="mt-3 text-4xl font-extrabold tracking-tight">
          {briefing.headline}
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
          {briefing.summary}
        </p>
      </div>

      {briefing.recommendedAction && (
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Recommended Action
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {briefing.recommendedAction.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {briefing.recommendedAction.description}
            </p>
          </div>

          <Link
            to="/today"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
          >
            Open Today

            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}