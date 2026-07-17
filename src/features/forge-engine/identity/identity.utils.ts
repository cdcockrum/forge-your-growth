import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";

export function isCompletedSession(
  session: PracticeSession,
): boolean {
  return (
    session.status === "completed" ||
    session.completed === true
  );
}

export function calculateSessionIdentityXp(
  session: PracticeSession,
  skill: Skill,
): number {
  let xp = 10;

  if (skill.difficulty >= 4) {
    xp += 5;
  }

  if ((session.duration_minutes ?? 0) >= 60) {
    xp += 3;
  }

  if (session.reflection?.trim()) {
    xp += 2;
  }

  return xp;
}

export function calculateLevel(xp: number): {
  level: number;
  levelProgress: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
} {
  const safeXp = Math.max(0, xp);

  const xpPerLevel = 100;

  const level = Math.floor(safeXp / xpPerLevel) + 1;

  const xpIntoLevel = safeXp % xpPerLevel;

  const xpForNextLevel = xpPerLevel;

  const levelProgress = Math.round(
    (xpIntoLevel / xpForNextLevel) * 100,
  );

  return {
    level,
    levelProgress,
    xpIntoLevel,
    xpForNextLevel,
  };
}

export function normalizeSkillName(
  value: string,
): string {
  return value.trim().toLowerCase();
}