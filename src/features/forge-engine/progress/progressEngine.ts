import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";
import type {
  CalculateProgressOptions,
  LifeAreaProgress,
  ProgressSummary,
  SkillProgress,
} from "./progress.types";
import {
  addDays,
  differenceInCalendarDays,
  formatLocalDate,
  isCompletedSession,
  parseLocalDate,
} from "./progress.utils";

export function calculateProgress({
  sessions,
  skills,
  lifeAreas,
  today = new Date(),
}: CalculateProgressOptions): ProgressSummary {
  const completedSessions = sessions.filter(
    isCompletedSession,
  );

  const skippedSessions = sessions.filter(
    (session) => session.status === "skipped",
  );

  const includedSessions = sessions.filter(
    (session) => session.status !== "skipped",
  );

  const completionRate =
    includedSessions.length === 0
      ? 0
      : Math.round(
          (completedSessions.length /
            includedSessions.length) *
            100,
        );

  const totalMinutes = completedSessions.reduce(
    (sum, session) =>
      sum + (session.duration_minutes ?? 0),
    0,
  );

  const skillProgress = calculateSkillProgress(
    sessions,
    skills,
    today,
  );

  const areaProgress = calculateLifeAreaProgress(
    completedSessions,
    skills,
    lifeAreas,
  );

  const strongestSkill =
    skillProgress
      .filter((skill) => skill.completedSessions > 0)
      .sort(
        (a, b) =>
          b.completedMinutes - a.completedMinutes ||
          b.completedSessions - a.completedSessions ||
          a.name.localeCompare(b.name),
      )[0] ?? null;

  const neglectedSkill =
    skillProgress
      .filter(
        (skill) =>
          skill.lastPracticedDate !== null &&
          skill.daysSincePracticed !== null,
      )
      .sort(
        (a, b) =>
          (b.daysSincePracticed ?? 0) -
            (a.daysSincePracticed ?? 0) ||
          a.name.localeCompare(b.name),
      )[0] ?? null;

  const { currentStreak, longestStreak } =
    calculatePracticeStreaks(
      completedSessions,
      today,
    );

  return {
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    skippedSessions: skippedSessions.length,
    scheduledSessions: sessions.filter(
      (session) =>
        !isCompletedSession(session) &&
        session.status !== "skipped",
    ).length,
    completionRate,
    totalMinutes,
    currentStreak,
    longestStreak,
    strongestSkill,
    neglectedSkill,
    skills: skillProgress,
    lifeAreas: areaProgress,
  };
}

function calculateSkillProgress(
  sessions: PracticeSession[],
  skills: Skill[],
  today: Date,
): SkillProgress[] {
  return skills
    .filter((skill) => !skill.archived)
    .map((skill) => {
      const skillSessions = sessions.filter(
        (session) => session.skill_id === skill.id,
      );

      const completed = skillSessions.filter(
        isCompletedSession,
      );

      const included = skillSessions.filter(
        (session) => session.status !== "skipped",
      );

      const latestDate =
        completed
          .map((session) => session.scheduled_date)
          .sort((a, b) => b.localeCompare(a))[0] ?? null;

      return {
        skillId: skill.id,
        name: skill.name,
        completedSessions: completed.length,
        completedMinutes: completed.reduce(
          (sum, session) =>
            sum + (session.duration_minutes ?? 0),
          0,
        ),
        completionRate:
          included.length === 0
            ? 0
            : Math.round(
                (completed.length / included.length) *
                  100,
              ),
        lastPracticedDate: latestDate,
        daysSincePracticed: latestDate
          ? Math.max(
              0,
              differenceInCalendarDays(
                today,
                parseLocalDate(latestDate),
              ),
            )
          : null,
      };
    });
}

function calculateLifeAreaProgress(
  completedSessions: PracticeSession[],
  skills: Skill[],
  lifeAreas: LifeArea[],
): LifeAreaProgress[] {
  const skillById = new Map(
    skills.map((skill) => [skill.id, skill]),
  );

  const totalMinutes = completedSessions.reduce(
    (sum, session) =>
      sum + (session.duration_minutes ?? 0),
    0,
  );

  return lifeAreas
    .filter((area) => !area.archived)
    .map((area) => {
      const areaSessions = completedSessions.filter(
        (session) => {
          if (!session.skill_id) {
            return false;
          }

          return (
            skillById.get(session.skill_id)
              ?.life_area_id === area.id
          );
        },
      );

      const completedMinutes = areaSessions.reduce(
        (sum, session) =>
          sum + (session.duration_minutes ?? 0),
        0,
      );

      return {
        areaId: area.id,
        name: area.name,
        color: area.color,
        completedSessions: areaSessions.length,
        completedMinutes,
        percentageOfPractice:
          totalMinutes === 0
            ? 0
            : Math.round(
                (completedMinutes / totalMinutes) *
                  100,
              ),
      };
    })
    .sort(
      (a, b) =>
        b.completedMinutes - a.completedMinutes ||
        a.name.localeCompare(b.name),
    );
}

function calculatePracticeStreaks(
  completedSessions: PracticeSession[],
  today: Date,
): {
  currentStreak: number;
  longestStreak: number;
} {
  const completedDates = new Set(
    completedSessions.map(
      (session) => session.scheduled_date,
    ),
  );

  if (completedDates.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  const sortedDates = [...completedDates].sort();

  let longestStreak = 1;
  let runningStreak = 1;

  for (let index = 1; index < sortedDates.length; index += 1) {
    const previous = parseLocalDate(
      sortedDates[index - 1],
    );
    const current = parseLocalDate(
      sortedDates[index],
    );

    const difference =
      differenceInCalendarDays(current, previous);

    if (difference === 1) {
      runningStreak += 1;
      longestStreak = Math.max(
        longestStreak,
        runningStreak,
      );
    } else {
      runningStreak = 1;
    }
  }

  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);

  const todayKey = formatLocalDate(normalizedToday);
  const yesterdayKey = formatLocalDate(
    addDays(normalizedToday, -1),
  );

  let cursor: Date;

  if (completedDates.has(todayKey)) {
    cursor = normalizedToday;
  } else if (completedDates.has(yesterdayKey)) {
    cursor = addDays(normalizedToday, -1);
  } else {
    return {
      currentStreak: 0,
      longestStreak,
    };
  }

  let currentStreak = 0;

  while (
    completedDates.has(formatLocalDate(cursor))
  ) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    currentStreak,
    longestStreak,
  };
}