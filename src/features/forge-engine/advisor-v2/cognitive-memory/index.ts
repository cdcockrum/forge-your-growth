export {
  buildCognitiveMemorySnapshot,
} from "./cognitiveMemoryBuilder";

export type {
  BuildCognitiveMemorySnapshotOptions,
} from "./cognitiveMemoryBuilder";

export type {
  CognitiveAssumptionSnapshot,
  CognitiveBeliefSnapshot,
  CognitiveConfidenceSnapshot,
  CognitiveMemory,
  CognitiveMemorySnapshot,
  CognitiveMemoryStatus,
  CognitiveRevision,
} from "./cognitiveMemory.types";

export {
  compareCognitiveMemory,
} from "./cognitiveMemoryComparator";

export {
  clearCognitiveMemory,
  getPreviousCognitiveSnapshot,
  saveCognitiveSnapshot,
} from "./cognitiveMemoryStore";

export {
  detectRevision,
} from "./revisionDetector";

export type {
  RevisionAnalysis,
} from "./revisionDetector";