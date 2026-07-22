import type {
  AdvisorBriefing,
  ForgeInsight,
} from "@/features/forge-engine";

type MorningHeroProps = {
  firstName: string;
  advisor: AdvisorBriefing;
  insight: ForgeInsight;
};

export function MorningHero({
  firstName,
  advisor,
  insight,
}: MorningHeroProps) {
  const date = new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  ).format(new Date());

  return (
    <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-7 py-8 text-primary-foreground shadow-xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">
        {date}
      </p>

      <h1 className="mt-3 text-4xl font-black tracking-tight">
        Good morning,
        <br />
        {firstName}
      </h1>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">
          Today's guidance
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {advisor.title}
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 opacity-90">
          {advisor.message}
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-80">
          Forge Insight
        </p>

        <p className="mt-2 text-lg font-semibold">
          {insight.headline}
        </p>
      </div>
    </section>
  );
}