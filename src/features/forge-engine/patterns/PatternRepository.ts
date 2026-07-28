import type {
  ForgePattern,
} from "./pattern.types";

export function consolidatePatterns(
  patterns: ForgePattern[],
): ForgePattern[] {
  const patternsById =
    new Map<
      string,
      ForgePattern
    >();

  for (const pattern of patterns) {
    const existing =
      patternsById.get(
        pattern.id,
      );

    if (
      !existing ||
      pattern.evidenceCount >
        existing.evidenceCount
    ) {
      patternsById.set(
        pattern.id,
        pattern,
      );
    }
  }

  return [
    ...patternsById.values(),
  ];
}