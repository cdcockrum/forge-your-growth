import type {
  ForgeMemory,
} from "./memory.types";

export class MemoryConsolidator {
  static consolidate(
    memories: ForgeMemory[],
  ): ForgeMemory[] {
    const consolidated: ForgeMemory[] = [];

    const bySkill = new Map<
      string,
      ForgeMemory[]
    >();

    for (const memory of memories) {
      if (!memory.skillId) {
        consolidated.push(memory);
        continue;
      }

      const existing =
        bySkill.get(memory.skillId) ??
        [];

      existing.push(memory);

      bySkill.set(
        memory.skillId,
        existing,
      );
    }

    for (const skillMemories of bySkill.values()) {
      consolidated.push(
        ...this.consolidateSkill(
          skillMemories,
        ),
      );
    }

    return consolidated;
  }

  private static consolidateSkill(
    memories: ForgeMemory[],
  ): ForgeMemory[] {
    const completed =
      memories.filter(
        (m) =>
          m.type ===
          "observation",
      );

    if (
      completed.length >= 5
    ) {
      return [
        {
          ...completed[0],

          id:
            crypto.randomUUID(),

          type:
            "pattern",

          title:
            "Consistent practice",

          summary:
            `${completed.length} successful practice sessions indicate this skill is becoming habitual.`,

          importance:
            "major",

          confidence:
            Math.min(
              1,
              0.55 +
                completed.length *
                  0.05,
            ),

          evidence:
            completed.map(
              (m) =>
                m.title,
            ),
        },
      ];
    }

    return memories;
  }
}