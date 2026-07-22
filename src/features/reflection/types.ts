import type {
  FocusLevel,
  ReflectionEntry,
  ReflectionLevel,
} from "@/features/forge-engine/reflection";

import type {
  Database,
} from "@/integrations/supabase/types";

export type ReflectionRow =
  Database["public"]["Tables"]["daily_reflections"]["Row"];

export type CreateReflectionInput = {
  reflectionDate: string;

  energy: ReflectionLevel;
  focus: FocusLevel;
  stress: ReflectionLevel;

  proudOf: string;
  obstacle: string;
  lesson: string;
  nextStep: string;
};

export type ReflectionFormValues = {
  energy: ReflectionLevel;
  focus: FocusLevel;
  stress: ReflectionLevel;

  proudOf: string;
  obstacle: string;
  lesson: string;
  nextStep: string;
};

export const defaultReflectionFormValues: ReflectionFormValues = {
  energy: "medium",
  focus: "good",
  stress: "medium",

  proudOf: "",
  obstacle: "",
  lesson: "",
  nextStep: "",
};

function isReflectionLevel(
  value: string,
): value is ReflectionLevel {
  return (
    value === "low" ||
    value === "medium" ||
    value === "high"
  );
}

function isFocusLevel(
  value: string,
): value is FocusLevel {
  return (
    value === "poor" ||
    value === "good" ||
    value === "excellent"
  );
}

export function mapReflectionRow(
  row: ReflectionRow,
): ReflectionEntry {
  if (!isReflectionLevel(row.energy)) {
    throw new Error(
      `Invalid reflection energy value: ${row.energy}`,
    );
  }

  if (!isFocusLevel(row.focus)) {
    throw new Error(
      `Invalid reflection focus value: ${row.focus}`,
    );
  }

  if (!isReflectionLevel(row.stress)) {
    throw new Error(
      `Invalid reflection stress value: ${row.stress}`,
    );
  }

  return {
    id: row.id,
    reflectionDate:
      row.reflection_date,

    energy: row.energy,
    focus: row.focus,
    stress: row.stress,

    proudOf: row.proud_of,
    obstacle: row.obstacle,
    lesson: row.lesson,
    nextStep: row.next_step,
  };
}