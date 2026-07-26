import type {
  ForgeMemory,
} from "./memory.types";

export class MemoryEngine {
  static record(
    memory: ForgeMemory,
  ) {
    return memory;
  }

  static retrieve() {
    return [];
  }

  static remove(
    id: string,
  ) {}

  static clear() {}
}