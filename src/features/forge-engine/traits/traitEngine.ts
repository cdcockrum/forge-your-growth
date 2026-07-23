import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import {
  getTraitsForSkill,
} from "./traitRegistry";

import type {
  Trait,
  TraitEngineResult,
  TraitScore,
} from "./trait.types";

type BuildTraitEngineOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
};

type TraitAccumulator = {
  score: number;
  evidence: number;
  skillScores: Map<string, number>;
};

const allTraits: Trait[] = [
  "curiosity",
  "discipline",
  "creativity",
  "resilience",
  "wisdom",
  "presence",
  "stewardship",
  "health",
];

function isCompleted(
  session: PracticeSession,
): boolean {
  return (
    session.completed === true ||
    session.status === "completed"
  );
}

function calculateSessionWeight({
  session,
  skill,
}: {
  session: PracticeSession;
  skill: Skill;
}): number {
  const difficulty =
    Math.max(
      1,
      skill.difficulty ?? 1,
    );

  const duration =
    Math.max(
      1,
      session.duration_minutes ?? 1,
    );

  const durationWeight =
    Math.min(duration / 30, 3);

  const difficultyWeight =
    Math.min(difficulty / 3, 2);

  return Number(
    (
      durationWeight *
      difficultyWeight
    ).toFixed(2),
  );
}

function strongestSkillFrom(
  skillScores: Map<string, number>,
): string | null {
  let strongestSkill: string | null =
    null;

  let strongestScore =
    Number.NEGATIVE_INFINITY;

  for (const [
    skillName,
    score,
  ] of skillScores) {
    if (score > strongestScore) {
      strongestSkill = skillName;
      strongestScore = score;
    }
  }

  return strongestSkill;
}

export function buildTraitEngine({
  sessions,
  skills,
}: BuildTraitEngineOptions): TraitEngineResult {
  const skillById = new Map(
    skills.map((skill) => [
      skill.id,
      skill,
    ]),
  );

  const traitMap = new Map<
    Trait,
    TraitAccumulator
  >(
    allTraits.map((trait) => [
      trait,
      {
        score: 0,
        evidence: 0,
        skillScores: new Map<
          string,
          number
        >(),
      },
    ]),
  );

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

    const traits =
      getTraitsForSkill(
        skill.name,
      );

    if (traits.length === 0) {
      continue;
    }

    const sessionWeight =
      calculateSessionWeight({
        session,
        skill,
      });

    for (const trait of traits) {
      const accumulator =
        traitMap.get(trait);

      if (!accumulator) {
        continue;
      }

      accumulator.score +=
        sessionWeight;

      accumulator.evidence += 1;

      accumulator.skillScores.set(
        skill.name,
        (
          accumulator.skillScores.get(
            skill.name,
          ) ?? 0
        ) + sessionWeight,
      );
    }
  }

  const traits: TraitScore[] =
    allTraits
      .map((trait) => {
        const accumulator =
          traitMap.get(trait);

        return {
          trait,
          score: Number(
            (
              accumulator?.score ?? 0
            ).toFixed(2),
          ),
          evidence:
            accumulator?.evidence ?? 0,
          strongestSkill:
            strongestSkillFrom(
              accumulator?.skillScores ??
                new Map(),
            ),
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score,
      );

  const dominantTrait =
    traits.find(
      (trait) =>
        trait.evidence > 0,
    ) ?? null;

  return {
    traits,
    dominantTrait,

    // Growth requires historical trait snapshots.
    // Until those exist, this remains null.
    fastestGrowingTrait: null,
  };
}