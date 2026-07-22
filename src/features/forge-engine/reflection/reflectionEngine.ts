import type {
  ReflectionEntry,
  ReflectionSummary,
} from "./reflection.types";

function compactText(
  values: Array<string | null | undefined>,
): string[] {
  return values
    .map((value) => value?.trim() ?? "")
    .filter(Boolean);
}

function mostRecentReflection(
  reflections: ReflectionEntry[],
): ReflectionEntry | null {
  if (reflections.length === 0) {
    return null;
  }

  return [...reflections].sort((a, b) =>
    b.reflectionDate.localeCompare(
      a.reflectionDate,
    ),
  )[0];
}

export function buildReflectionSummary(
  reflections: ReflectionEntry[],
): ReflectionSummary | null {
  const latest =
    mostRecentReflection(reflections);

  if (!latest) {
    return null;
  }

  const strengths = compactText(
    reflections.map(
      (reflection) => reflection.proudOf,
    ),
  );

  const obstacles = compactText(
    reflections.map(
      (reflection) => reflection.obstacle,
    ),
  );

  const lessons = compactText(
    reflections.map(
      (reflection) => reflection.lesson,
    ),
  );

  const nextSteps = compactText(
    reflections.map(
      (reflection) => reflection.nextStep,
    ),
  );

  const headline =
    latest.energy === "high"
      ? "You are working from a position of strong energy."
      : latest.energy === "low"
        ? "Your recent reflection suggests that recovery deserves attention."
        : "Your energy appears steady, with room for intentional adjustment.";

  const recommendation =
    latest.stress === "high"
      ? "Reduce friction before increasing intensity. Protect the next important practice and simplify the rest."
      : latest.focus === "poor"
        ? "Choose one clearly defined next action and remove competing priorities."
        : latest.nextStep ||
          "Repeat what worked and carry one clear lesson into the next practice.";

  return {
    energy: latest.energy,
    focus: latest.focus,
    stress: latest.stress,
    strengths,
    obstacles,
    lessons,
    nextSteps,
    headline,
    recommendation,
  };
}