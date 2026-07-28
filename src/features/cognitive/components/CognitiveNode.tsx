import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import {
  BookOpen,
  Compass,
  Lightbulb,
  Puzzle,
  Sparkles,
  Star,
  TriangleAlert,
  User,
} from "lucide-react";

import {
  ForgeConfidence,
} from "@/components/forge";

import { ConfidenceBar } from "./ConfidenceBar";

import type {
  CognitiveGraphNode,
} from "../types";

export function CognitiveNode({
  data,
  selected,
}: NodeProps<CognitiveGraphNode>) {
const categoryStyles = {
  person: {
    icon: User,
    accent: "border-slate-500",
  },

  identity: {
    icon: Compass,
    accent: "border-emerald-500",
  },

  belief: {
    icon: Lightbulb,
    accent: "border-blue-500",
  },

  contradiction: {
    icon: TriangleAlert,
    accent: "border-red-500",
  },

  pattern: {
    icon: Puzzle,
    accent: "border-violet-500",
  },

  prediction: {
    icon: Sparkles,
    accent: "border-amber-500",
  },

  recommendation: {
    icon: Star,
    accent: "border-yellow-500",
  },

  evidence: {
    icon: BookOpen,
    accent: "border-cyan-500",
  },
} as const;

    const NODE_WIDTH = 300;
    const NODE_HEIGHT = 240;

  const style =
    categoryStyles[data.category];
  const Icon =
    style.icon;

  return (
    <div
      className={[
        "min-w-[220px] rounded-3xl border bg-background p-5 shadow-sm transition",
        selected
            ? `${style.accent} shadow-xl`
            : "border-border"
      ].join(" ")}
    >
      <Handle
  type="target"
  position={Position.Top}
/>

<div className="flex items-center gap-3">
  <div className="rounded-xl border border-border p-2">
    <Icon className="h-5 w-5" />
  </div>

  <div>
    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
      {data.category}
    </p>

    <h3 className="text-lg font-black">
      {data.title}
    </h3>
  </div>
</div>

{data.subtitle && (
  <p className="mt-4 text-sm leading-6 text-muted-foreground">
    {data.subtitle}
  </p>
)}

{data.confidence !== undefined && (
  <div className="mt-5">
    <ConfidenceBar
      value={data.confidence}
    />
  </div>
)}

<Handle
  type="source"
  position={Position.Bottom}
/>

<div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
  {data.evidence?.length ?? 0} evidence items
</div>

    </div>
  );
}