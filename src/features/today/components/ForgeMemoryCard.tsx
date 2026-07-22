import { ForgeCard } from "@/components/forge";

import type {
  ForgeMemory,
} from "@/features/forge-engine";

type ForgeMemoryCardProps = {
  memories: ForgeMemory[];
};

export function ForgeMemoryCard({
  memories,
}: ForgeMemoryCardProps) {
  if (memories.length === 0) {
    return null;
  }

  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Forge remembers
      </p>

      <div className="mt-5 space-y-4">
        {memories.slice(0, 3).map((memory) => (
          <article
            key={memory.id}
            className="border-b border-border pb-4 last:border-b-0 last:pb-0"
          >
            <p className="text-base font-bold leading-7">
              {memory.statement}
            </p>

            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span className="capitalize">
                {memory.category}
              </span>

              <span className="font-mono">
                {memory.confidence}% confidence
              </span>
            </div>
          </article>
        ))}
      </div>
    </ForgeCard>
  );
}
