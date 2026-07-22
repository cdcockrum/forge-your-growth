import { ForgeSection } from "@/components/forge";

import { EvidenceCard } from "./EvidenceCard";

import type {
  IntelligenceViewModel,
} from "@/features/intelligence/services";

type EvidenceTimelineProps = {
  model: IntelligenceViewModel["evidence"];
  highlightedNodeId: string | null;
  onSelectRelated: (nodeId: string) => void;
};

export function EvidenceTimeline({
  model,
  highlightedNodeId,
  onSelectRelated,
}: EvidenceTimelineProps) {
  const nodes = model.nodes;

  return (
    <ForgeSection
      eyebrow="Reasoning"
      title="How Forge reached this conclusion"
      description="Each observation contributes evidence toward today’s recommendation."
    >
      {nodes.length > 0 ? (
        <div className="space-y-5">
          {nodes.map((node, index) => (
            <EvidenceCard
              key={node.id}
              node={node}
              nodes={nodes}
              isLast={index === nodes.length - 1}
              highlighted={
                highlightedNodeId === node.id
              }
              onSelectRelated={onSelectRelated}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-6">
          <p className="font-semibold">
            Forge needs more evidence.
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Complete practices and continue using Forge
            so it can build a clearer reasoning chain.
          </p>
        </div>
      )}
    </ForgeSection>
  );
}