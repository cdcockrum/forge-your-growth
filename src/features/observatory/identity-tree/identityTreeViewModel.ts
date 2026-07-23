import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import type {
  TraitEngineResult,
} from "@/features/forge-engine/traits";

import {
  getTraitsForSkill,
} from "@/features/forge-engine/traits";

import type {
  IdentityTreeBranch,
  IdentityTreeSkillNode,
  IdentityTreeViewModel,
} from "./identityTree.types";

type BuildIdentityTreeViewModelOptions = {
  traits: TraitEngineResult;
  sessions: PracticeSession[];
  skills: Skill[];
};

function isCompleted(
  session: PracticeSession,
): boolean {
  return (
    session.completed === true ||
    session.status === "completed"
  );
}

function traitLabel(
  trait: IdentityTreeBranch["trait"],
): string {
  return trait
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) =>
      value.toUpperCase(),
    );
}

function buildSkillScores({
  sessions,
  skills,
}: {
  sessions: PracticeSession[];
  skills: Skill[];
}): Map<string, IdentityTreeSkillNode> {
  const skillById = new Map(
    skills.map((skill) => [
      skill.id,
      skill,
    ]),
  );

  const scores = new Map<
    string,
    IdentityTreeSkillNode
  >();

  for (const session of sessions) {
    if (
      !isCompleted(session) ||
      !session.skill_id
    ) {
      continue;
    }

    const skill = skillById.get(
      session.skill_id,
    );

    if (!skill) {
      continue;
    }

    const existing = scores.get(
      skill.id,
    );

    const weight = Math.max(
      1,
      session.duration_minutes / 30,
    );

    scores.set(skill.id, {
      id: skill.id,
      name: skill.name,
      score:
        (existing?.score ?? 0) +
        weight,
    });
  }

  return scores;
}

export function buildIdentityTreeViewModel({
  traits,
  sessions,
  skills,
}: BuildIdentityTreeViewModelOptions): IdentityTreeViewModel {
  const skillScores =
    buildSkillScores({
      sessions,
      skills,
    });

  const branches =
    traits.traits
      .filter(
        (trait) =>
          trait.evidence > 0,
      )
      .map((trait) => {
        const relatedSkills =
          skills
            .filter((skill) =>
              getTraitsForSkill(
                skill.name,
              ).includes(
                trait.trait,
              ),
            )
            .map((skill) =>
              skillScores.get(
                skill.id,
              ),
            )
            .filter(
              (
                skill,
              ): skill is IdentityTreeSkillNode =>
                Boolean(skill),
            )
            .sort(
              (a, b) =>
                b.score - a.score,
            );

        return {
          trait: trait.trait,
          label: traitLabel(
            trait.trait,
          ),
          score: trait.score,
          evidence:
            trait.evidence,
          strength: Math.max(
            1,
            Math.min(
              10,
              Math.round(
                trait.score,
              ),
            ),
          ),
          strongestSkill:
            trait.strongestSkill,
          skills: relatedSkills,
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score,
      );

  const totalScore =
    branches.reduce(
      (total, branch) =>
        total + branch.score,
      0,
    );

  return {
    title: "Identity Tree",
    subtitle:
      "A living view of the traits strengthened by your completed practices.",
    totalScore: Number(
      totalScore.toFixed(2),
    ),
    dominantTrait:
      traits.dominantTrait
        ?.trait ?? null,
    branches,
  };
}