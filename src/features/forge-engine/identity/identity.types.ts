export type IdentityKey =
  | "scholar"
  | "artist"
  | "polyglot"
  | "martial_artist"
  | "athlete"
  | "musician"
  | "engineer"
  | "leader"
  | "craftsperson";

export type IdentityDefinition = {
  key: IdentityKey;
  name: string;
  description: string;
  skillKeywords: string[];
};

export type IdentityProgress = {
  identity: IdentityDefinition;
  xp: number;
  level: number;
  levelProgress: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  completedSessions: number;
  completedMinutes: number;
  contributingSkillIds: string[];
};

export type IdentityEngineResult = {
  identities: IdentityProgress[];
  strongestIdentity: IdentityProgress | null;
  fastestDevelopingIdentity: IdentityProgress | null;
};

export type CalculateIdentityProgressOptions = {
  sessions: import("@/features/forge/types").PracticeSession[];
  skills: import("@/features/forge/types").Skill[];
};