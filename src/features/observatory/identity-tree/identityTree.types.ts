import type {
  Trait,
} from "@/features/forge-engine/traits";

export type IdentityTreeSkillNode = {
  id: string;
  name: string;
  score: number;
};

export type IdentityTreeBranch = {
  trait: Trait;
  label: string;
  score: number;
  evidence: number;
  strength: number;
  strongestSkill: string | null;
  skills: IdentityTreeSkillNode[];
};

export type IdentityTreeViewModel = {
  title: string;
  subtitle: string;
  totalScore: number;
  dominantTrait: Trait | null;
  branches: IdentityTreeBranch[];
};