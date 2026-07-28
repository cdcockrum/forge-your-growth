import type {
  Contradiction,
} from "./contradiction.types";

export function contradictionTitle(
  contradiction: Contradiction,
): string {
  return contradiction.title;
}

export function contradictionExplanation(
  contradiction: Contradiction,
): string {
  return contradiction.explanation;
}