import type {
  ForgeMemory,
  MemoryCandidate,
  MemorySignal,
} from "./memory.types";

import {
  MemoryClassifier,
} from "./MemoryClassifier";

import {
  createForgeMemory,
} from "./memory.utils";

export class MemoryEngine {
  static processSignal(
    signal: MemorySignal,
  ): ForgeMemory | null {
    const candidate =
      MemoryClassifier.classify(signal);

    if (!candidate) {
      return null;
    }

    return this.record(candidate);
  }

  static record(
    candidate: MemoryCandidate,
  ): ForgeMemory {
    return createForgeMemory(candidate);
  }

  static retrieve(
    memories: ForgeMemory[],
  ): ForgeMemory[] {
    return [...memories];
  }

  static remove(
    memories: ForgeMemory[],
    id: string,
  ): ForgeMemory[] {
    return memories.filter(
      (memory) =>
        memory.id !== id,
    );
  }

  static clear(): ForgeMemory[] {
    return [];
  }
}