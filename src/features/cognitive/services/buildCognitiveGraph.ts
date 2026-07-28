import type {
  Edge,
} from "@xyflow/react";

import type {
  ForgeState,
} from "@/features/forge-engine";

import type {
  CognitiveGraphNode,
  CognitiveWorkspace,
} from "../types";

import {
  layoutGraph,
} from "./layoutGraph";

export function buildCognitiveGraph(
  forge: ForgeState,
): CognitiveWorkspace {
  const strongestIdentity =
    forge.identity.strongestIdentity;

  const strongestBelief =
    forge.beliefs.strongest[0];

  const strongestContradiction =
    forge.contradictions.strongest;

  const strongestPattern =
    forge.patterns.strongestPattern;

  const strongestPrediction =
    forge.predictions.strongest;

  const identityConfidence =
    strongestIdentity
      ? Math.min(
          100,
          strongestIdentity.completedSessions *
            10,
        )
      : undefined;

  const nodes: CognitiveGraphNode[] = [
    {
      id: "you",
      type: "cognitive",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        category: "person",

        title: "You",

        subtitle:
          "The person Forge is learning to understand.",

        reasoning: [
          "Forge organizes its conclusions around your activity, identity, direction, and accumulated evidence.",
        ],
      },
    },

    {
      id: "identity",
      type: "cognitive",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        category: "identity",

        title:
          strongestIdentity?.identity.name ??
          "Identity still emerging",

        subtitle: strongestIdentity
          ? "Your strongest currently supported identity."
          : "Complete more practices so Forge can identify a stable direction.",

        confidence:
          identityConfidence,

        evidence: strongestIdentity
          ? [
              `${strongestIdentity.completedSessions} completed practices support this identity.`,
            ]
          : [],

        reasoning: strongestIdentity
          ? [
              "Forge identifies this as the identity receiving the strongest support from recent completed practices.",
            ]
          : [
              "Forge does not yet have enough completed practice evidence to identify a strongest identity.",
            ],
      },
    },
  ];

  if (strongestBelief) {
    nodes.push({
      id: "belief",
      type: "cognitive",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        category: "belief",

        title:
          strongestBelief.statement,

        subtitle:
          `${strongestBelief.supportingEvidence.length} supporting signals.`,

        confidence:
          strongestBelief.confidence,

        evidence:
          strongestBelief.supportingEvidence,

        reasoning: [
          "Forge formed this belief from repeated identity and practice evidence.",
        ],
      },
    });
  }

  if (strongestContradiction) {
    nodes.push({
      id: "contradiction",
      type: "cognitive",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        category: "contradiction",

        title:
          strongestContradiction.title,

        subtitle:
          strongestContradiction.explanation,

        confidence:
          contradictionSeverityToConfidence(
            strongestContradiction.severity,
          ),

        evidence:
          strongestContradiction.evidence,

        reasoning: [
          strongestContradiction.explanation,
        ],
      },
    });
  }

  if (strongestPattern) {
    nodes.push({
      id: "pattern",
      type: "cognitive",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        category: "pattern",

        title:
          strongestPattern.title,

        subtitle:
          strongestPattern.description,

        confidence:
          patternConfidenceToNumber(
            strongestPattern.confidence,
          ),

        evidence: [
          `Observed ${strongestPattern.evidenceCount} times.`,
        ],

        reasoning: [
          "Forge identified this pattern because the same signal has appeared repeatedly in the current observation period.",
        ],

        recommendation:
          strongestPattern.recommendation,
      },
    });
  }

  if (strongestPrediction) {
    nodes.push({
      id: "prediction",
      type: "cognitive",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        category: "prediction",

        title:
          strongestPrediction.title,

        subtitle:
          strongestPrediction.description,

        confidence:
          strongestPrediction.confidence,

        evidence:
          strongestPrediction.evidence,

        reasoning: [
          "Forge generated this prediction from current progress, momentum, beliefs, contradictions, and recurring patterns.",
        ],

        recommendation:
          strongestPrediction.recommendation,
      },
    });
  }

  nodes.push({
    id: "recommendation",
    type: "cognitive",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      category: "recommendation",

      title:
        forge.advisor.title,

      subtitle:
        forge.advisor.message,

      confidence:
        forge.advisor.confidence,

      evidence:
        forge.evidence.strongest.map(
          (node) =>
            node.statement,
        ),

      reasoning:
        forge.advisor.reasoning,

      recommendation:
        forge.advisor.actions[0],
    },
  });

  const edges: Edge[] = [
    {
      id: "you-to-identity",
      source: "you",
      target: "identity",
      type: "smoothstep",
      label: "develops",
    },
  ];

  if (strongestBelief) {
    edges.push({
      id: "identity-to-belief",
      source: "identity",
      target: "belief",
      type: "smoothstep",
      label: "supports",
    });
  }

  if (strongestContradiction) {
    edges.push({
      id: "identity-to-contradiction",
      source: "identity",
      target: "contradiction",
      type: "smoothstep",
      label: "conflicts with",
    });
  }

  if (strongestPattern) {
    edges.push({
      id: strongestBelief
        ? "belief-to-pattern"
        : "identity-to-pattern",

      source: strongestBelief
        ? "belief"
        : "identity",

      target: "pattern",
      type: "smoothstep",

      label: strongestBelief
        ? "reinforces"
        : "reveals",
    });
  }

  if (strongestPrediction) {
    if (strongestPattern) {
      edges.push({
        id: "pattern-to-prediction",
        source: "pattern",
        target: "prediction",
        type: "smoothstep",
        label: "suggests",
      });
    }

    if (strongestContradiction) {
      edges.push({
        id: "contradiction-to-prediction",
        source: "contradiction",
        target: "prediction",
        type: "smoothstep",
        label: "influences",
      });
    }

    if (
      !strongestPattern &&
      !strongestContradiction
    ) {
      edges.push({
        id: "identity-to-prediction",
        source: "identity",
        target: "prediction",
        type: "smoothstep",
        label: "projects",
      });
    }

    edges.push({
      id: "prediction-to-recommendation",
      source: "prediction",
      target: "recommendation",
      type: "smoothstep",
      label: "guides",
    });
  } else {
    if (strongestPattern) {
      edges.push({
        id: "pattern-to-recommendation",
        source: "pattern",
        target: "recommendation",
        type: "smoothstep",
        label: "informs",
      });
    }

    if (strongestContradiction) {
      edges.push({
        id: "contradiction-to-recommendation",
        source: "contradiction",
        target: "recommendation",
        type: "smoothstep",
        label: "requires",
      });
    }

    if (
      !strongestPattern &&
      !strongestContradiction
    ) {
      edges.push({
        id: "identity-to-recommendation",
        source: "identity",
        target: "recommendation",
        type: "smoothstep",
        label: "directs",
      });
    }
  }

  return {
    nodes:
      layoutGraph(
        nodes,
        edges,
      ),

    edges,
  };
}

function contradictionSeverityToConfidence(
  severity:
    | "low"
    | "medium"
    | "high",
): number {
  switch (severity) {
    case "high":
      return 90;

    case "medium":
      return 70;

    case "low":
      return 45;
  }
}

function patternConfidenceToNumber(
  confidence:
    | "low"
    | "medium"
    | "high",
): number {
  switch (confidence) {
    case "high":
      return 90;

    case "medium":
      return 70;

    case "low":
      return 45;
  }
}