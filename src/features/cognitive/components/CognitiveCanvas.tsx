import {
  useMemo,
  useState,
} from "react";

import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type NodeMouseHandler,
  type NodeTypes,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  useCognitiveWorkspace,
} from "../hooks/useCognitiveWorkspace";

import type {
  CognitiveGraphNode,
} from "../types";

import {
  CognitiveInspector,
} from "./CognitiveInspector";

import {
  CognitiveNode,
} from "./CognitiveNode";

const nodeTypes: NodeTypes = {
  cognitive: CognitiveNode,
};

export function CognitiveCanvas() {
  const workspace =
    useCognitiveWorkspace();

  const [
    selectedNode,
    setSelectedNode,
  ] = useState<CognitiveGraphNode | null>(
    null,
  );

const focusedNodeId =
  selectedNode?.id ?? null;

const connectedNodeIds =
  useMemo(() => {
    if (!focusedNodeId) {
      return new Set<string>();
    }

    const connected =
      new Set<string>([
        focusedNodeId,
      ]);

    for (const edge of workspace.edges) {
      if (
        edge.source === focusedNodeId
      ) {
        connected.add(
          edge.target,
        );
      }

      if (
        edge.target === focusedNodeId
      ) {
        connected.add(
          edge.source,
        );
      }
    }

    return connected;
  }, [
    focusedNodeId,
    workspace.edges,
  ]);
  const graphNodes =
    useMemo(
      () =>
        workspace.nodes.map(
          (node) => ({
            ...node,

            style: {
              ...node.style,

              opacity:
                !focusedNodeId ||
                connectedNodeIds.has(node.id)
                    ? 1
                    : 0.22,

              transition:
                "opacity 180ms ease",
            },
          }),
        ),
      [
        connectedNodeIds,
        focusedNodeId,
        workspace.nodes,
      ],
    );

  const graphEdges =
    useMemo(
      () =>
        workspace.edges.map(
          (edge) => {
            const isConnected =
                !focusedNodeId ||
                edge.source === focusedNodeId ||
                edge.target === focusedNodeId;

            return {
              ...edge,

              animated:
                Boolean(
                  focusedNodeId &&
                    isConnected,
                ),

              markerEnd: {
                type:
                  MarkerType.ArrowClosed,
              },

              style: {
                ...edge.style,

                opacity:
                  isConnected
                    ? 1
                    : 0.12,

                strokeWidth:
                  focusedNodeId &&
                  isConnected
                    ? 2.5
                    : 1.5,

                transition:
                  "opacity 180ms ease, stroke-width 180ms ease",
              },

              labelStyle: {
                fontSize: 11,
                fontWeight: 700,
                opacity:
                  isConnected
                    ? 1
                    : 0.15,
              },

              labelBgPadding: [
                6,
                4,
              ] as [
                number,
                number,
              ],

              labelBgBorderRadius:
                6,
            };
          },
        ),
      [
        focusedNodeId,
        workspace.edges,
      ],
    );

  const handleNodeClick: NodeMouseHandler<CognitiveGraphNode> = (
    _event,
    node,
  ) => {
    setSelectedNode(node);
  };



  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Explainable Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
          Forge Mind
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Explore how Forge connects your identity,
          beliefs, patterns, predictions, and
          recommendations.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-[70vh] min-h-[520px] overflow-hidden rounded-3xl border border-border bg-background">
          <ReactFlow
            nodes={
              graphNodes
            }
            edges={
              graphEdges
            }
            nodeTypes={
              nodeTypes
            }
            onNodeClick={
              handleNodeClick
            }
            
            onPaneClick={() => {
              setSelectedNode(
                null,
              );

              setSelectedNode(
                null,
              );
            }}
            fitView
            fitViewOptions={{
              padding: 0.25,
            }}
            nodesDraggable
            nodesConnectable={
              false
            }
            elementsSelectable
          >
            <Background
              variant={
                BackgroundVariant.Dots
              }
              gap={20}
              size={1}
            />

            <MiniMap
              pannable
              zoomable
            />

            <Controls />
          </ReactFlow>
        </div>

        <CognitiveInspector
          node={
            selectedNode
          }
          onClose={() =>
            setSelectedNode(
              null,
            )
          }
        />
      </div>
    </div>
  );
}