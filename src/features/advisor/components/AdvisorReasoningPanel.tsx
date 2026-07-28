import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  ForgeCard,
  ForgeConfidence,
} from "@/components/forge";

type AdvisorReasoningPanelProps = {
  confidence: number;

  evidence: string[];

  reasoning: string[];
};

export function AdvisorReasoningPanel({
  confidence,
  evidence,
  reasoning,
}: AdvisorReasoningPanelProps) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <ForgeCard padding="medium">
      <button
        onClick={() =>
          setExpanded(!expanded)
        }
        className="flex w-full items-center justify-between"
      >
        <span className="font-semibold">
          Why does Forge think this?
        </span>

        {expanded ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      {expanded && (
        <div className="mt-6 space-y-6">

          <ForgeConfidence
            value={confidence}
          />

          <div>
            <h4 className="mb-2 font-semibold">
              Evidence
            </h4>

            <ul className="space-y-2">
              {evidence.map(
                (item) => (
                  <li key={item}>
                    • {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">
              Reasoning
            </h4>

            <ul className="space-y-2">
              {reasoning.map(
                (item) => (
                  <li key={item}>
                    • {item}
                  </li>
                ),
              )}
            </ul>
          </div>

        </div>
      )}
    </ForgeCard>
  );
}