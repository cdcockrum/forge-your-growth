export type MemoryCategory =
  | "strength"
  | "pattern"
  | "warning"
  | "habit"
  | "identity";

export type ForgeMemory = {
  id: string;
  category: MemoryCategory;
  statement: string;
  confidence: number;
  evidenceCount: number;
  lastObserved: string;
};

export type MemoryResult = {
  memories: ForgeMemory[];
  strongest: ForgeMemory[];
};