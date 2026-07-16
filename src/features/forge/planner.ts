import type { PracticeSession } from "./types";
import type {
  GeneratedPracticeSession,
  GenerateWeeklySessionsOptions,
} from "./planner.types";
import {
  clamp,
  createDailyLoad,
  getIntensity,
  getPreferredDayIndexes,
  parseDateString,
  rankCandidateDays,
} from "./planner.utils";
import { scoreCandidateDay } from "./planner.scoring";

/**
 * Generates only the missing practice sessions for one Monday–Sunday
 * week. Existing sessions are preserved and count toward each skill's
 * weekly target.
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

    const candidates = rankCandidateDays(
      preferredIndexes,
      dailyLoad,
      monday,
    )
      .map(candidate => scoreCandidateDay(candidate, skill))
      .sort((a, b) => b.score - a.score);
    let sessionsCreated = 0;

    for (const candidate of candidates) {
      if (sessionsCreated >= sessionsNeeded) {
        break;
      }

      const key = `${skill.id}:${candidate.date}`;

      if (existingKeys.has(key)) {
        continue;
      }

      generated.push({
        user_id: userId,
        skill_id: skill.id,
        scheduled_date: candidate.date,
        scheduled_time: null,
        duration_minutes: skill.session_minutes,
        title: skill.name,
        notes: skill.notes,
        completed: false,
        completed_at: null,
        reflection: null,
        intensity: getIntensity(skill.difficulty),
        sort_order: dailyLoad[candidate.dayIndex],
        planning_score: candidate.score,
        planning_reasons: candidate.reasons,
      });

      existingKeys.add(key);
      dailyLoad[candidate.dayIndex] += 1;
      sessionsCreated += 1;
    }
  }

  return sortGeneratedSessions(generated);
}

function sortGeneratedSessions(
  sessions: GeneratedPracticeSession[],
): GeneratedPracticeSession[] {
  return sessions.sort((a, b) => {
    const dateComparison = a.scheduled_date.localeCompare(
      b.scheduled_date,
    );

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return a.sort_order - b.sort_order;
  });
}

export type {
  CandidateDay,
  GeneratedPracticeSession,
  GenerateWeeklySessionsOptions,
} from "./planner.types";

export type { PracticeSession };