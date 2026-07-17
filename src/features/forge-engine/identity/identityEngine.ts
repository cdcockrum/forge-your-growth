import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import { IDENTITY_DEFINITIONS } from "./identityDefinitions";
import type {
  CalculateIdentityProgressOptions,
  IdentityDefinition,
  IdentityEngineResult,
  IdentityProgress,
} from "./identity.types";
import {
  calculateLevel,
  calculateSessionIdentityXp,
  isCompletedSession,
  normalizeSkillName,
} from "./identity.utils";

export function calculateIdentityProgress({
  sessions,
  skills,
}: CalculateIdentityProgressOptions): IdentityEngineResult {
  const completedSessions = sessions.filter(
    isCompletedSession,
  );

  const skillById = new Map(
    skills.map((skill) => [skill.id, skill]),
  );

  const identities = IDENTITY_DEFINITIONS.map(
    (identity) =>
      calculateIdentity({
        identity,
        completedSessions,
        skillById,
      }),
  ).filter(
    (identity) =>
      identity.completedSessions > 0 ||
      identity.contributingSkillIds.length > 0,
  );

  const sortedByXp = [...identities].sort(
    (first, second) =>
      second.xp - first.xp ||
      second.completedMinutes -
        first.completedMinutes ||
      first.identity.name.localeCompare(
        second.identity.name,
      ),
  );

  return {
    identities: sortedByXp,
    strongestIdentity: sortedByXp[0] ?? null,
    fastestDevelopingIdentity:
      sortedByXp[0] ?? null,
  };
}

function calculateIdentity({
  identity,
  completedSessions,
  skillById,
}: {
  identity: IdentityDefinition;
  completedSessions: PracticeSession[];
  skillById: Map<string, Skill>;
}): IdentityProgress {
  let xp = 0;
  let completedMinutes = 0;
  let completedSessionCount = 0;

  const contributingSkillIds = new Set<string>();

  for (const session of completedSessions) {
    if (!session.skill_id) {
      continue;
    }

    const skill = skillById.get(session.skill_id);

    if (!skill || !skillMatchesIdentity(skill, identity)) {
      continue;
    }

    contributingSkillIds.add(skill.id);
    completedSessionCount += 1;
    completedMinutes +=
      session.duration_minutes ?? 0;
    xp += calculateSessionIdentityXp(
      session,
      skill,
    );
  }

  for (const skill of skillById.values()) {
    if (skillMatchesIdentity(skill, identity)) {
      contributingSkillIds.add(skill.id);
    }
  }

  const level = calculateLevel(xp);

  return {
    identity,
    xp,
    level: level.level,
    levelProgress: level.levelProgress,
    xpIntoLevel: level.xpIntoLevel,
    xpForNextLevel: level.xpForNextLevel,
    completedSessions: completedSessionCount,
    completedMinutes,
    contributingSkillIds: [
      ...contributingSkillIds,
    ],
  };
}

function skillMatchesIdentity(
  skill: Skill,
  identity: IdentityDefinition,
): boolean {
  const searchableText = normalizeSkillName(
    [
      skill.name,
      skill.description ?? "",
      skill.notes ?? "",
    ].join(" "),
  );

  return identity.skillKeywords.some(
    (keyword) =>
      searchableText.includes(
        normalizeSkillName(keyword),
      ),
  );
}