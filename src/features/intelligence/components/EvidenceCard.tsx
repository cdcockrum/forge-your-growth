import { ForgeBadge } from "@/components/forge";

import type {
  EvidenceNode,
} from "@/features/forge-engine";

type EvidenceCardProps = {
  node: EvidenceNode;
  nodes: EvidenceNode[];
  isLast: boolean;
  highlighted: boolean;
  onSelectRelated: (
    nodeId: string,
  ) => void;
};

export function EvidenceCard({
  node,
  nodes,
  isLast,
  highlighted,
  onSelectRelated,
}: EvidenceCardProps) {
  const relatedNodes = node.relatedIds
    .map((relatedId) =>
      nodes.find(
        (candidate) =>
          candidate.id === relatedId,
      ),
    )
    .filter(
      (
        relatedNode,
      ): relatedNode is EvidenceNode =>
        Boolean(relatedNode),
    );

  return (
    <div
      id={`evidence-${node.id}`}
      className="relative flex scroll-mt-24 gap-4"
    >
      <div className="flex shrink-0 flex-col items-center">
        <div
          className={`flex size-8 items-center justify-center rounded-full text-sm font-bold shadow-sm transition ${
            highlighted
              ? "scale-110 bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          ✓
        </div>

        {!isLast && (
          <div className="mt-2 min-h-8 w-px flex-1 bg-border" />
        )}
      </div>

      <article
        className={`min-w-0 flex-1 rounded-2xl border bg-surface p-5 shadow-sm transition-all duration-300 ${
          highlighted
            ? "border-accent ring-4 ring-accent/15"
            : "border-border"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              {formatLabel(node.source)}
            </p>

            <h3 className="mt-2 text-lg font-bold tracking-tight">
              {node.subject}
            </h3>
          </div>

          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] font-semibold text-primary">
            {node.confidence}% confidence
          </span>
        </div>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {node.statement}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <ForgeBadge>
            {formatLabel(node.category)}
          </ForgeBadge>

          <ForgeBadge>
            {formatLabel(node.source)}
          </ForgeBadge>
        </div>

        {relatedNodes.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Supported by
            </p>

            <div className="mt-3 space-y-2">
              {relatedNodes.map(
                (relatedNode) => (
                  <button
                    key={relatedNode.id}
                    type="button"
                    onClick={() =>
                      onSelectRelated(
                        relatedNode.id,
                      )
                    }
                    className="block w-full rounded-xl bg-muted/50 px-3 py-3 text-left transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <p className="text-xs font-bold">
                      {relatedNode.subject}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {relatedNode.statement}
                    </p>

                    <p className="mt-2 text-[10px] font-semibold text-foreground">
                      View evidence →
                    </p>
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {node.timestamp && (
          <p className="mt-4 text-[10px] text-muted-foreground">
            Observed{" "}
            {formatDate(node.timestamp)}
          </p>
        )}
      </article>
    </div>
  );
}

function formatLabel(
  value: string,
): string {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}
