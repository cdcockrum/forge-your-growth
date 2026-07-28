import {
  X,
} from "lucide-react";

import {
  ForgeConfidence,
} from "@/components/forge";

import type {
  CognitiveGraphNode,
} from "../types";

import {
  Timeline,
  useTimeline,
} from "../timeline";

type CognitiveInspectorProps = {
  node: CognitiveGraphNode | null;
  onClose: () => void;
};

export function CognitiveInspector({
  node,
  onClose,
}: CognitiveInspectorProps) {

  const timeline =
  useTimeline();
  if (!node) {
    return (
      <aside className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-border bg-background p-6">
        <div className="max-w-xs text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            Node Inspector
          </p>

          <h2 className="mt-3 text-xl font-black tracking-tight">
            Select a thought
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Choose a node to inspect the evidence, reasoning, and recommendation behind it.
          </p>
        </div>
      </aside>
    );
  }

  

  const {
    data,
  } = node;

  return (
    <aside className="rounded-3xl border border-border bg-background p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
            {data.category}
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            {data.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-border p-2 transition hover:bg-muted"
          aria-label="Close node inspector"
        >
          <X className="size-4" />
        </button>
      </div>

      {data.subtitle && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {data.subtitle}
        </p>
      )}

      {data.confidence !== undefined && (
        <section className="mt-6">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Confidence
          </p>

          <ForgeConfidence
            value={data.confidence}
          />
        </section>
      )}

      {data.evidence &&
        data.evidence.length > 0 && (
          <section className="mt-7 border-t border-border pt-6">
            <h3 className="text-sm font-black">
              Evidence
            </h3>

            <ul className="mt-3 space-y-3">
              {data.evidence.map(
                (item, index) => (
                  <li
                    key={`${index}-${item}`}
                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span className="font-mono text-xs">
                      {index + 1}.
                    </span>

                    <span>
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </section>
        )}

      {data.reasoning &&
        data.reasoning.length > 0 && (
          <section className="mt-7 border-t border-border pt-6">
            <h3 className="text-sm font-black">
              Reasoning
            </h3>

            <ul className="mt-3 space-y-3">
              {data.reasoning.map(
                (item, index) => (
                  <li
                    key={`${index}-${item}`}
                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span className="font-mono text-xs">
                      {index + 1}.
                    </span>

                    <span>
                      {item}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </section>
        )}

        <section className="mt-7 border-t border-border pt-6">
          <Timeline
            timeline={timeline}
          />
        </section>

      {data.recommendation && (
        <section className="mt-7 rounded-2xl border border-border bg-muted/30 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Recommended response
          </p>

          <p className="mt-2 text-sm leading-6">
            {data.recommendation}
          </p>
        </section>
      )}
    </aside>
  );
}