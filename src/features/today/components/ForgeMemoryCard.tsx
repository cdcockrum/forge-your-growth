import type {
  ForgeMemory,
} from "@/features/forge-engine";

type DisplayMemory = Pick<
  ForgeMemory,
  "id" | "title" | "summary"
> & {
  /**
   * Supports memories created by the older Forge
   * pipeline while it is being migrated.
   */
  statement?: string;
};

type ForgeMemoryCardProps = {
  memories?: DisplayMemory[];
};

export function ForgeMemoryCard({
  memories = [],
}: ForgeMemoryCardProps) {
  if (memories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-5 py-6">
        <p className="text-sm font-semibold">
          Forge is still learning.
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Meaningful patterns and memories will appear here as
          you practice and reflect.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {memories.map((memory, index) => {
        const body =
          memory.statement?.trim() ||
          memory.summary?.trim() ||
          "A meaningful pattern has been recorded.";

        return (
          <article
            key={
              memory.id ||
              `${memory.title || body}-${index}`
            }
            className="rounded-2xl border border-border bg-surface px-5 py-4"
          >
            <p className="text-sm font-semibold">
              {memory.title?.trim() || "Forge remembers"}
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {body}
            </p>
          </article>
        );
      })}
    </div>
  );
}