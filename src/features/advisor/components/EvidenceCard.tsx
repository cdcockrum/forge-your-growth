import {
  ForgeCard,
} from "@/components/forge";

type EvidenceCardProps = {
  evidence: string[];
};

export function EvidenceCard({
  evidence,
}: EvidenceCardProps) {
  return (
    <ForgeCard padding="large">
      <div className="space-y-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Supporting Evidence
          </p>

          <h3 className="mt-2 text-2xl font-black">
            Why Forge believes this
          </h3>
        </div>

        <div className="space-y-3">
          {evidence.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-background p-4"
            >
              <p className="text-sm leading-6">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ForgeCard>
  );
}