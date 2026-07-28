import dagre from "@dagrejs/dagre";

import type {
  Edge,
} from "@xyflow/react";

import type {
  CognitiveGraphNode,
} from "../types";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 190;

export function layoutGraph(
  nodes: CognitiveGraphNode[],
  edges: Edge[],
): CognitiveGraphNode[] {
  const graph =
    new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(
    () => ({}),
  );

  graph.setGraph({
    rankdir: "TB",
    ranksep: 100,
    nodesep: 80,
    marginx: 40,
    marginy: 40,
  });

  for (const node of nodes) {
    graph.setNode(
      node.id,
      {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      },
    );
  }

  for (const edge of edges) {
    graph.setEdge(
      edge.source,
      edge.target,
    );
  }

  dagre.layout(graph);

  return nodes.map(
    (node) => {
      const position =
        graph.node(node.id);

      return {
        ...node,

        position: {
          x:
            position.x -
            NODE_WIDTH / 2,

          y:
            position.y -
            NODE_HEIGHT / 2,
        },
      };
    },
  );
}