import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Compass,
} from "lucide-react";

import {
  ForgeCard,
} from "@/components/forge";

type SimulationScenario = {
  title: string;

  description: string;

  probability: number;

  trajectory: string;

  recommendations: string[];
};

type AdvisorSimulationPanelProps = {
  bestCase: SimulationScenario;

  expectedCase: SimulationScenario;

  worstCase: SimulationScenario;
};

export function AdvisorSimulationPanel({
  bestCase,
  expectedCase,
  worstCase,
}: AdvisorSimulationPanelProps) {
  return (
    <ForgeCard padding="large">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-border bg-background p-3">
          <Compass className="size-5 text-accent" />
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            Simulation
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Possible trajectories
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            These are different ways the current pattern could develop. They
            are possibilities to consider, not predictions of what will happen.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        <ScenarioCard
          eyebrow="Upside"
          plausibility="Plausible upside"
          supportLabel="What strengthens this path"
          scenario={bestCase}
          icon={ArrowUpRight}
        />

        <ScenarioCard
          eyebrow="Current course"
          plausibility="Most plausible"
          supportLabel="What keeps it moving"
          scenario={expectedCase}
          icon={ArrowRight}
          emphasized
        />

        <ScenarioCard
          eyebrow="Risk"
          plausibility="Worth watching"
          supportLabel="How to respond"
          scenario={worstCase}
          icon={ArrowDownRight}
        />
      </div>
    </ForgeCard>
  );
}

function ScenarioCard({
  eyebrow,
  plausibility,
  supportLabel,
  scenario,
  icon: Icon,
  emphasized = false,
}: {
  eyebrow: string;

  plausibility: string;

  supportLabel: string;

  scenario: SimulationScenario;

  icon: typeof Compass;

  emphasized?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 ${
        emphasized
          ? "border-accent/40 bg-accent/5"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>

          <h3 className="mt-2 text-lg font-black tracking-tight">
            {scenario.title}
          </h3>
        </div>

        <Icon className="size-4 shrink-0 text-accent" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          {plausibility}
        </span>

        <span className="rounded-full border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          {formatTrajectory(
            scenario.trajectory,
          )}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {scenario.description}
      </p>

      {scenario.recommendations.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {supportLabel}
          </p>

          <div className="mt-3 space-y-2">
            {scenario.recommendations.map(
              (recommendation) => (
                <p
                  key={recommendation}
                  className="text-sm leading-6 text-muted-foreground"
                >
                  {recommendation}
                </p>
              ),
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function formatTrajectory(
  trajectory: string,
): string {
  return trajectory
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}