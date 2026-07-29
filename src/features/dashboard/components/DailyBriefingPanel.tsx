import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import type {
  DailyBriefing,
} from "@/features/forge-engine/briefing";

type Props = {
  briefing: DailyBriefing;
};

export function DailyBriefingPanel({
  briefing,
}: Props) {
  const primaryPriority =
    briefing.priorities[0] ?? null;

  const primaryStrength =
    briefing.strengths[0] ?? null;

  const primaryWatchItem =
    briefing.watchItems[0] ?? null;

  const primaryOpportunity =
    briefing.opportunities[0] ?? null;

  return (
    <section className="animate-reveal overflow-hidden rounded-[2rem] border border-border bg-surface">
      <div className="relative overflow-hidden border-b border-border px-5 py-7 md:px-8 md:py-10">
        <div className="pointer-events-none absolute right-0 top-0 select-none p-3 font-mono text-[72px] font-black uppercase leading-none opacity-[0.025] md:text-[120px]">
          Briefing
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Sparkles className="size-4" />
              </span>

              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                Forge Daily Briefing
              </p>
            </div>

            <ConfidenceBadge
              confidence={briefing.confidence}
            />
          </div>

          <p className="mt-7 text-sm font-semibold text-muted-foreground">
            {briefing.greeting}
          </p>

          <h2 className="mt-3 max-w-4xl text-balance text-3xl font-black leading-[1.02] tracking-tight md:text-5xl">
            {briefing.headline}
          </h2>

          <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {briefing.summary}
          </p>
        </div>
      </div>

      {briefing.recommendedAction && (
        <div className="border-b border-border bg-foreground px-5 py-6 text-background md:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-60">
                Recommended action
              </p>

              <h3 className="mt-2 text-xl font-black tracking-tight md:text-2xl">
                {briefing.recommendedAction.title}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 opacity-70">
                {briefing.recommendedAction.description}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <ConfidenceBadge
                confidence={
                  briefing.recommendedAction.confidence
                }
                inverse
              />

              <Link
                to="/today"
                className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-xs font-black text-foreground transition hover:bg-background/90"
              >
                Open Today
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2">
        {primaryPriority && (
          <BriefingDetail
            eyebrow="Priority"
            title={primaryPriority.title}
            description={primaryPriority.reason}
            confidence={primaryPriority.confidence}
            icon={
              <TriangleAlert className="size-4" />
            }
          />
        )}

        {primaryStrength && (
          <BriefingDetail
            eyebrow="Strength"
            title={primaryStrength.title}
            description={primaryStrength.description}
            confidence={primaryStrength.confidence}
            icon={
              <ShieldCheck className="size-4" />
            }
          />
        )}

        {primaryWatchItem && (
          <BriefingDetail
            eyebrow="Watch"
            title={primaryWatchItem.title}
            description={primaryWatchItem.description}
            confidence={primaryWatchItem.confidence}
            icon={<Eye className="size-4" />}
          />
        )}

        {primaryOpportunity && (
          <BriefingDetail
            eyebrow="Opportunity"
            title={primaryOpportunity.title}
            description={primaryOpportunity.description}
            confidence={primaryOpportunity.confidence}
            icon={
              <Lightbulb className="size-4" />
            }
          />
        )}
      </div>

      {briefing.evidence.length > 0 && (
        <div className="border-t border-border px-5 py-5 md:px-8">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-xs font-black">
                <CheckCircle2 className="size-4 text-accent" />
                Why Forge reached this conclusion
              </span>

              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {briefing.evidence.length}{" "}
                {briefing.evidence.length === 1
                  ? "evidence item"
                  : "evidence items"}
              </span>
            </summary>

            <div className="mt-4 grid gap-2">
              {briefing.evidence.map(
                (evidence, index) => (
                  <div
                    key={`${evidence.source}-${index}`}
                    className="rounded-xl bg-muted/60 px-4 py-3"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                      {evidence.source}
                    </p>

                    <p className="mt-1 text-sm leading-6">
                      {evidence.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </details>
        </div>
      )}
    </section>
  );
}

function BriefingDetail({
  eyebrow,
  title,
  description,
  confidence,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  confidence: number;
  icon: ReactNode;
}) {
  return (
    <article className="border-t border-border p-5 md:min-h-52 md:border-l md:p-7 md:first:border-l-0">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-accent">
          {icon}

          <span className="font-mono text-[9px] uppercase tracking-[0.22em]">
            {eyebrow}
          </span>
        </span>

        <span className="font-mono text-[9px] text-muted-foreground">
          {Math.round(confidence)}%
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function ConfidenceBadge({
  confidence,
  inverse = false,
}: {
  confidence: number;
  inverse?: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] ${
        inverse
          ? "border-background/20 bg-background/10 text-background/70"
          : "border-border bg-background text-muted-foreground"
      }`}
    >
      {Math.round(confidence)}% confidence
    </span>
  );
}