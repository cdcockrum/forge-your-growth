export type Trait =
  | "curiosity"
  | "discipline"
  | "creativity"
  | "resilience"
  | "wisdom"
  | "presence"
  | "stewardship"
  | "health";

export type TraitScore = {
  trait: Trait;

  score: number;

  evidence: number;

  strongestSkill: string | null;
};

export type TraitEngineResult = {
  traits: TraitScore[];

  dominantTrait: TraitScore | null;

  fastestGrowingTrait: TraitScore | null;
};