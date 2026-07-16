import {
  DAYS,
  type PracticeSession,
  type Skill,
} from "./types";

export type GeneratedPracticeSession = Pick<
  PracticeSession,
  | "user_id"
  | "skill_id"
  | "scheduled_date"
  | "scheduled_time"
  | "duration_minutes"
  | "title"
  | "notes"
  | "completed"
  | "completed_at"
  | "reflection"
  | "intensity"
  | "sort_order"
>;

type GenerateWeeklySessionsOptions = {
  userId: string;
  skills: Skill[];
  weekStart: string;
  existingSessions?: PracticeSession[];
};

const DAY_INDEX = new Map<string, number>(
  DAYS.map((day, index) => [day, index]),
);

/**
 * Generates missing practice sessions for one Monday–Sunday week.
 *
 * Existing sessions are preserved and counted toward each skill's
 * weekly target. The function only returns sessions that still need
 * to be inserted.
 */
export function generateWeeklySessions({
  userId,
  skills,
  weekStart,
  existingSessions = [],
}: GenerateWeeklySessionsOptions): GeneratedPracticeSession[] {
  const monday = parseDateString(weekStart);

  const activeSkills = skills.filter(
    (skill) => !skill.archived && skill.target_frequency > 0,
  );

  const existingKeys = new Set(
    existingSessions
      .filter((session) => session.skill_id)
      .map(
        (session) =>
          `${session.skill_id}:${session.scheduled_date}`,
      ),
  );

  const dailyLoad = createDailyLoad(existingSessions, monday);

  const generated: GeneratedPracticeSession[] = [];

  for (const skill of activeSkills) {
    const existingForSkill = existingSessions.filter(
      (session) => session.skill_id === skill.id,
    );

    const weeklyTarget = clamp(
      Math.floor(skill.target_frequency),
      0,
      7,
    );

    const sessionsNeeded = Math.max(
      0,
      weeklyTarget - existingForSkill.length,
    );

    if (sessionsNeeded === 0) {
      continue;
    }

    const preferredIndexes = getPreferredDayIndexes(
      skill.preferred_days,
    );

    const candidateIndexes = rankCandidateDays(
      preferredIndexes,
      dailyLoad,
    );

    let sessionsCreated = 0;

    for (const dayIndex of candidateIndexes) {
      if (sessionsCreated >= sessionsNeeded) {
        break;
      }

      const scheduledDate = addDays(monday, dayIndex);
      const key = `${skill.id}:${scheduledDate}`;

      // Do not generate the same skill twice on the same day.
      if (existingKeys.has(key)) {
        continue;
      }

      generated.push({
        user_id: userId,
        skill_id: skill.id,
        scheduled_date: scheduledDate,
        scheduled_time: null,
        duration_minutes: skill.session_minutes,
        title: skill.name,
        notes: skill.notes,
        completed: false,
        completed_at: null,
        reflection: null,
        intensity: getIntensity(skill.difficulty),
        sort_order: dailyLoad[dayIndex],
      });

      existingKeys.add(key);
      dailyLoad[dayIndex] += 1;
      sessionsCreated += 1;
    }
  }

  return generated.sort((a, b) => {
    const dateComparison = a.scheduled_date.localeCompare(
      b.scheduled_date,
    );

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.sort_order - b.sort_order;
  });
}

function getPreferredDayIndexes(
  preferredDays: string[],
): number[] {
  const indexes = preferredDays
    .map((day) => DAY_INDEX.get(day))
    .filter((index): index is number => index !== undefined);

  return [...new Set(indexes)];
}

/**
 * Preferred days are considered first.
 *
 * Within preferred and non-preferred groups, days with fewer existing
 * sessions are selected first so the week remains reasonably balanced.
 */
function rankCandidateDays(
  preferredIndexes: number[],
  dailyLoad: number[],
): number[] {
  const preferredSet = new Set(preferredIndexes);

  const preferred = preferredIndexes
    .slice()
    .sort((a, b) => dailyLoad[a] - dailyLoad[b] || a - b);

  const fallback = DAYS.map((_, index) => index)
    .filter((index) => !preferredSet.has(index))
    .sort((a, b) => dailyLoad[a] - dailyLoad[b] || a - b);

  return [...preferred, ...fallback];
}

function createDailyLoad(
  sessions: PracticeSession[],
  monday: Date,
): number[] {
  const load = Array.from({ length: 7 }, () => 0);

  for (const session of sessions) {
    const sessionDate = parseDateString(
      session.scheduled_date,
    );

    const difference = differenceInCalendarDays(
      sessionDate,
      monday,
    );

    if (difference >= 0 && difference <= 6) {
      load[difference] += 1;
    }
  }

  return load;
}

function getIntensity(
  difficulty: number,
): PracticeSession["intensity"] {
  if (difficulty >= 4) {
    return "high";
  }

  if (difficulty <= 1) {
    return "recovery";
  }

  return "deliberate";
}

function parseDateString(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date string: ${value}`);
  }

  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);

  return formatDate(result);
}

function differenceInCalendarDays(
  laterDate: Date,
  earlierDate: Date,
): number {
  const laterUtc = Date.UTC(
    laterDate.getFullYear(),
    laterDate.getMonth(),
    laterDate.getDate(),
  );

  const earlierUtc = Date.UTC(
    earlierDate.getFullYear(),
    earlierDate.getMonth(),
    earlierDate.getDate(),
  );

  return Math.round(
    (laterUtc - earlierUtc) / 86_400_000,
  );
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(Math.max(value, minimum), maximum);
}