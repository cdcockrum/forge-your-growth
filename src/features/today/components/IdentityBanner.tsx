import { ForgeCard } from "@/components/forge";

type IdentityBannerProps = {
  identities: string[];
};

export function IdentityBanner({
  identities,
}: IdentityBannerProps) {
  if (identities.length === 0) {
    return null;
  }

  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Today you continue becoming...
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {identities.map((identity) => (
          <div
            key={identity}
            className="rounded-full border border-border bg-muted/40 px-5 py-3 text-base font-semibold"
          >
            {identity}
          </div>
        ))}
      </div>
    </ForgeCard>
  );
}
