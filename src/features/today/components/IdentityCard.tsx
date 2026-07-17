import type {
  IdentityEngineResult,
  IdentityProgress,
} from "@/features/forge-engine";

type IdentityCardProps = {
  identity: IdentityEngineResult;
};

export function IdentityCard({
  identity,
}: IdentityCardProps) {
  const visibleIdentities = identity.identities.slice(0, 3);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Developing identities
      </p>

      {identity.strongestIdentity ? (
        <>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Strongest identity
            </p>

            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              {identity.strongestIdentity.identity.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {identity.strongestIdentity.identity.description}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {visibleIdentities.map((item) => (
              <IdentityRow
                key={item.identity.key}
                identity={item}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4">
          <h2 className="text-lg font-extrabold tracking-tight">
            Your identities will emerge through practice.
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Complete practices and Forge will begin showing the
            identities your work is strengthening.
          </p>
        </div>
      )}
    </section>
  );
}

function IdentityRow({
  identity,
}: {
  identity: IdentityProgress;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">
            {identity.identity.name}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Level {identity.level} · {identity.xp} XP
          </p>
        </div>

        <p className="text-xs font-semibold">
          {identity.levelProgress}%
        </p>
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
  );
}