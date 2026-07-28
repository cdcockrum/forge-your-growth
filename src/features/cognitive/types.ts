import type {
  Edge,
  Node,
} from "@xyflow/react";

export type CognitiveNodeCategory =
  | "person"
  | "identity"
  | "belief"
  | "contradiction"
  | "pattern"
  | "prediction"
  | "recommendation"
  | "evidence";

export type CognitiveNodeData = {
  category: CognitiveNodeCategory;

  title: string;

  subtitle?: string;

  confidence?: number;

  evidence?: string[];

  reasoning?: string[];

  recommendation?: string;
};

export type CognitiveGraphNode =
  Node<
    CognitiveNodeData,
    "cognitive"
  >;

export type CognitiveWorkspace = {
  nodes: CognitiveGraphNode[];

  edges: Edge[];
};