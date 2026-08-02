import {
  BrainCircuit,
  Check,
  CircleAlert,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type WisdomInsight = {
  id: string;

  title: string;

  explanation: string;

  confidence: number;
};

type AdvisorWisdomPanelProps = {
  narrative: string;

  insights: WisdomInsight[];

  longTermThemes: string[];

  emergingIdentity: string[];

  cautions: string[];

  opportunities: string[];

  confidence: number;
};

export function AdvisorWisdomPanel({
  narrative,
  insights,
  longTermThemes,
  emergingIdentity,
  cautions,
  opportunities,
  confidence,
}: AdvisorWisdomPanelProps) {
  const percentage =
    Math.round(
      normalizeConfidence(
        confidence,
      ) * 100,
    );

  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-border bg-background p-3">
            <BrainCircuit className="size-5 text-accent" />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
              Distilled understanding
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              What Forge is learning over time
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {narrative}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-border bg-background px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Wisdom confidence
          </p>

          <p className="mt-1 text-sm font-black uppercase tracking-wider">
            {percentage}%
          </p>
        </div>
      </div>

      {insights.length > 0 && (
        <section className="mt-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Strongest insights
          </p>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {insights.map(
              (insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                />
              ),
            )}
          </div>
        </section>
      )}

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <WisdomSection
          icon={Sparkles}
          title="Long-term themes"
          values={longTermThemes}
          emptyMessage="No durable long-term theme has emerged yet."
        />

        <WisdomSection
          icon={Lightbulb}
          title="Emerging identity"
          values={emergingIdentity}
          emptyMessage="Forge is still gathering enough evidence to describe an emerging identity."
        />

        <WisdomSection
          icon={CircleAlert}
          title="Cautions"
          values={cautions}
          emptyMessage="No significant caution is currently strong enough to surface."
        />

        <WisdomSection
          icon={Check}
          title="Opportunities"
          values={opportunities}
          emptyMessage="No clear opportunity has emerged yet."
        />
      </div>
    </ForgeCard>
  );
}

function InsightCard({
  insight,
}: {
  insight: WisdomInsight;
}) {
  const confidence =
    Math.round(
      normalizeConfidence(
        insight.confidence,
      ) * 100,
    );

  return (
    <article className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-black tracking-tight">
          {insight.title}
        </h3>

        <span className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          {confidence}%
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {insight.explanation}
      </p>
    </article>
  );
}

function WisdomSection({
  icon: Icon,
  title,
  values,
  emptyMessage,
}: {
  icon: typeof BrainCircuit;

  title: string;

  values: string[];

  emptyMessage: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-accent" />

        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </p>
      </div>

      {values.length > 0 ? (
        <div className="mt-3 space-y-2">
          {values.map(
            (value) => (
              <p
                key={value}
                className="text-sm leading-6 text-muted-foreground"
              >
                {value}
              </p>
            ),
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}

function normalizeConfidence(
  confidence: number,
): number {
  const normalized =
    confidence > 1
      ? confidence / 100
      : confidence;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}