import type {
  ForgePipelineSnapshot,
} from "./forgePipeline";

export type PipelineStageStatus = {
  id:
    | "observation"
    | "interpretation"
    | "context"
    | "reasoning"
    | "explanation";
  label: string;
  completed: boolean;
  outputCount: number;
  outputs: string[];
};

export type ForgePipelineDiagnostics = {
  completed: boolean;
  completedStages: number;
  totalStages: number;
  stages: PipelineStageStatus[];
};

function getOutputKeys(
  value: Record<string, unknown>,
): string[] {
  return Object.keys(value).filter(
    (key) => value[key] !== undefined,
  );
}

function buildStageStatus({
  id,
  label,
  value,
}: {
  id: PipelineStageStatus["id"];
  label: string;
  value: Record<string, unknown>;
}): PipelineStageStatus {
  const outputs = getOutputKeys(value);

  return {
    id,
    label,
    completed: outputs.length > 0,
    outputCount: outputs.length,
    outputs,
  };
}

export function buildPipelineDiagnostics(
  snapshot: ForgePipelineSnapshot,
): ForgePipelineDiagnostics {
  const stages: PipelineStageStatus[] = [
    buildStageStatus({
      id: "observation",
      label: "Observation",
      value: snapshot.observation,
    }),
    buildStageStatus({
      id: "interpretation",
      label: "Interpretation",
      value: snapshot.interpretation,
    }),
    buildStageStatus({
      id: "context",
      label: "Context",
      value: snapshot.context,
    }),
    buildStageStatus({
      id: "reasoning",
      label: "Reasoning",
      value: snapshot.reasoning,
    }),
    buildStageStatus({
      id: "explanation",
      label: "Explanation",
      value: snapshot.explanation,
    }),
  ];

  const completedStages = stages.filter(
    (stage) => stage.completed,
  ).length;

  return {
    completed:
      completedStages === stages.length,
    completedStages,
    totalStages: stages.length,
    stages,
  };
}