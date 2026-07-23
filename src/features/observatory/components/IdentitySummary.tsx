import type {
  ForgeState,
} from "@/features/forge-engine";

type IdentitySummaryProps = {
  forge: ForgeState;
};

function capitalize(
  value: string,
) {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function Stat({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>

      {subtext ? (
        <p className="mt-1 text-sm text-muted-foreground">
          {subtext}
        </p>
      ) : null}
    </div>
  );
}

export function IdentitySummary({
  forge,
}: IdentitySummaryProps) {
  const identity =
    forge.identity.strongestIdentity;

  const trait =
    forge.traits.dominantTrait;

  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Identity Summary
        </p>

        <h3 className="mt-2 text-xl font-semibold">
          Your current trajectory
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Forge's current interpretation of
          who you are becoming.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Identity"
          value={
            identity?.identity.name ??
            "Emerging"
          }
          subtext={
            identity
              ? `Level ${identity.level}`
              : undefined
          }
        />

        <Stat
          label="Dominant Trait"
          value={
            trait
              ? capitalize(
                  trait.trait,
                )
              : "Emerging"
          }
          subtext={
            trait
              ? `${trait.evidence} observations`
              : undefined
          }
        />

        <Stat
          label="Momentum"
          value={capitalize(
            forge.momentum.direction,
          )}
          subtext={`${capitalize(
            forge.momentum.burnoutRisk,
          )} burnout risk`}
        />

        <Stat
          label="Practice"
          value={
            forge.progress.completedSessions
          }
          subtext={`${Math.round(
            forge.progress.completionRate,
          )}% completed`}
        />
      </div>

      {identity ? (
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>
              Identity Progress
            </span>

            <span>
              {Math.round(
                identity.levelProgress,
              )}
              %
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-700"
              style={{
                width: `${identity.levelProgress}%`,
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}