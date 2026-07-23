import type {
  Trait,
} from "./trait.types";

export const traitRegistry: Record<
  string,
  Trait[]
> = {
  writing: [
    "creativity",
    "discipline",
  ],

  painting: [
    "creativity",
  ],

  piano: [
    "discipline",
    "creativity",
  ],

  guitar: [
    "creativity",
  ],

  french: [
    "curiosity",
  ],

  japanese: [
    "curiosity",
  ],

  reading: [
    "wisdom",
    "curiosity",
  ],

  meditation: [
    "presence",
  ],

  running: [
    "resilience",
    "health",
  ],

  strength: [
    "discipline",
    "health",
  ],

  fitness: [
    "resilience",
    "health",
  ],

  volunteering: [
    "stewardship",
  ],
};

export function getTraitsForSkill(
  skillName: string,
): Trait[] {
  const normalizedName =
    skillName.trim().toLowerCase();

  return (
    traitRegistry[normalizedName] ??
    []
  );
}