import type {
  CognitiveMemorySnapshot,
} from "./cognitiveMemory.types";

let previousSnapshot:
  CognitiveMemorySnapshot | null =
  null;

export function getPreviousCognitiveSnapshot():
  CognitiveMemorySnapshot | null {
  return previousSnapshot;
}

export function saveCognitiveSnapshot(
  snapshot: CognitiveMemorySnapshot,
): void {
  previousSnapshot =
    structuredClone(
      snapshot,
    );
}

export function clearCognitiveMemory(): void {
  previousSnapshot =
    null;
}