import {
  Award,
  Clock3,
  Layers3,
  Sparkles,
} from "lucide-react";

import type {
  IdentityEngineResult,
  IdentityProgress,
} from "@/features/forge-engine";
import type { Skill } from "@/features/forge/types";

type IdentityOverviewProps = {
  result: IdentityEngineResult;
  skills: Skill[];
};

export function IdentityOverview({
  result,
  skills,
}: IdentityOverviewProps) {
  if (result.identities.length === 0) {
    return <IdentityEmptyState />;
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <header className="max-w-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent" />

          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Developing identities
          </p>
        </div>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
          The person your practice is shaping.
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Completed sessions contribute experience toward the identities
          connected to each skill.
        </p>
      </header>

      {result.strongestIdentity && (
        <StrongestIdentity
          identity={result.strongestIdentity}
          skills={skills}
        />
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {result.identities.map((identity) => (
          <IdentityProgressCard
            key={identity.identity.key}
            identity={identity}
            skills={skills}
          />
        ))}
      </div>
    </section>
  );
}

function StrongestIdentity({
  identity,
  skills,
}: {
  identity: IdentityProgress;
  skills: Skill[];
}) {
  const contributingSkills = getContributingSkills(
    identity,
    skills,
  );

  return (
    <article className="mt-7 overflow-hidden rounded-2xl bg-foreground p-6 text-background">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-background/55">
            Strongest developing identity
          </p>

          <h3 className="mt-3 text-3xl font-extrabold tracking-tight">
            {identity.identity.name}
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-6 text-background/65">
            {identity.identity.description}
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-sm text-background/55">
            Current level
          </p>

          <p className="mt-1 text-5xl font-extrabold tracking-tight">
            {identity.level}
          </p>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between text-xs">
          <span className="text-background/60">
            {identity.xpIntoLevel} of{" "}
            {identity.xpForNextLevel} XP
          </span>

          <span className="font-semibold">
            {identity.levelProgress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/10">
          <div
            className="h-full rounded-full bg-background transition-[width] duration-500"
            style={{
              width: `${identity.levelProgress}%`,
            }}
          />
        </div>
      </div>

      {contributingSkills.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {contributingSkills.map((skill) => (
            <span
              key={skill.id}
              className="rounded-full border border-background/10 bg-background/5 px-3 py-1.5 text-xs text-background/70"
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

function IdentityProgressCard({
  identity,
  skills,
}: {
  identity: IdentityProgress;
  skills: Skill[];
}) {
  const contributingSkills = getContributingSkills(
    identity,
    skills,
  );

  return (
    <article className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
            Level {identity.level}
          </p>

          <h3 className="mt-2 text-xl font-extrabold tracking-tight">
            {identity.identity.name}
          </h3>
        </div>

        <div className="rounded-full bg-accent/10 p-2 text-accent">
          <Award className="size-4" />
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {identity.identity.description}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Next level
          </span>

          <span className="font-semibold">
            {identity.xpIntoLevel}/
            {identity.xpForNextLevel} XP
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{
              width: `${identity.levelProgress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <IdentityMetric
          icon={Layers3}
          label="Sessions"
          value={String(identity.completedSessions)}
        />

        <IdentityMetric
          icon={Clock3}
          label="Time"
          value={formatMinutes(identity.completedMinutes)}
        />
      </div>

      {contributingSkills.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
            Contributing skills
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {contributingSkills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-md bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function IdentityMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />

        <p className="font-mono text-[8px] uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-2 text-lg font-extrabold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function IdentityEmptyState() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        Developing identities
      </p>

      <h2 className="mt-3 text-xl font-extrabold tracking-tight">
        Your identities have not emerged yet.
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
        Complete practices connected to study, creativity, languages,
        athletics, music, engineering, leadership, or craftsmanship.
      </p>
    </section>
  );
}

function getContributingSkills(
  identity: IdentityProgress,
  skills: Skill[],
): Skill[] {
  const contributingIds = new Set(
    identity.contributingSkillIds,
  );

  return skills.filter((skill) =>
    contributingIds.has(skill.id),
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = minutes / 60;

  return Number.isInteger(hours)
    ? `${hours}h`
    : `${hours.toFixed(1)}h`;
}