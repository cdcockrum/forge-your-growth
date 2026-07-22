import type {
  EvidenceGraph,
  EvidenceNode,
} from "./evidence.types";

export function createEvidenceGraph(
  nodes: EvidenceNode[],
): EvidenceGraph {
  return {
    nodes,
  };
}