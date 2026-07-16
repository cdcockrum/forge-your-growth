import {
  DAYS,
  type PracticeSession,
  type Skill,
} from "@/features/forge/types";
import type {
  AdaptivePlanningResult,
  DayPerformance,
  SkillAdaptation,
} from "./adaptation.types";

type AnalyzeAdaptivePlanningOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
};

const DAY_INDEX = new Map(
  DAYS.map((day, index) => [day, index]),
);

export function analyzeAdaptivePlanning({
  sessions,
  skills,
}: AnalyzeAdaptivePlanningOptions): AdaptivePlanningResult {
  const adaptations = skills
    .filter((skill) => !skill.archived)
    .map((skill) =>
      analyzeSkill({
        skill,
        sessions: sessions.filter(
          (session) => session.skill_id === skill.id,
        ),
      }),
    );

  return {
    skills: adaptations,
  };
}

function analyzeSkill({
  skill,
  sessions,
}: {
  skill: Skill;
  sessions: PracticeSession[];
}): SkillAdaptation {
  const dayPerformance = calculateDayPerformance(sessions);

  const daysWithHistory = dayPerformance.filter(
    (day) => day.scheduledSessions > 0,
  );

  const recommendedDays = [...dayPerformance]
    .filter((day) => day.scheduledSessions > 0)
    .sort((a, b) => {
      return (
        b.completionRate - a.completionRate ||
        b.completedSessions - a.completedSessions ||
        a.scheduledSessions - b.scheduledSessions ||
        getDayIndex(a.day) - getDayIndex(b.day)
      );
    })
    .slice(0, Math.min(skill.target_frequency, 7))
    .map((day) => day.day);

  const confidence = getConfidence(sessions.length);
  const reasons = buildReasons({
    skill,
    dayPerformance,
    recommendedDays,
    confidence,
  });

  return {
    skillId: skill.id,
    skillName: skill.name,
    currentPreferredDays: skill.preferred_days,
    recommendedDays:
      recommendedDays.length > 0
        ? recommendedDays
        : skill.preferred_days,
    dayPerformance: daysWithHistory,
    confidence,
    reasons,
  };
}

function calculateDayPerformance(
  sessions: PracticeSession[],
): DayPerformance[] {
  return DAYS.map((day) => {
    const matchingSessions = sessions.filter(
      (session) =>
        getDayKey(session.scheduled_date) === day,
    );

    const completedSessions = matchingSessions.filter(
      isCompleted,
    ).length;

    const skippedSessions = matchingSessions.filter(
      (session) => session.status === "skipped",
    ).length;

    const includedSessions = matchingSessions.filter(
      (session) => session.status !== "skipped",
    );

    const completionRate =
      includedSessions.length === 0
        ? 0
        : Math.round(
            (completedSessions / includedSessions.length) *
              100,
          );

    return {
      day,
      scheduledSessions: matchingSessions.length,
      completedSessions,
      skippedSessions,
      completionRate,
    };
  });
}

function buildReasons({
  skill,
  dayPerformance,
  recommendedDays,
  confidence,
}: {
  skill: Skill;
  dayPerformance: DayPerformance[];
  recommendedDays: string[];
  confidence: SkillAdaptation["confidence"];
}): string[] {
  const reasons: string[] = [];

  if (confidence === "low") {
    reasons.push(
      "More completed history is needed before Forge can make a strong recommendation.",
    );
  }

  const strongestDay = [...dayPerformance]
    .filter((day) => day.scheduledSessions > 0)
    .sort(
      (a, b) =>
        b.completionRate - a.completionRate ||
        b.completedSessions - a.completedSessions,
    )[0];

  if (strongestDay && strongestDay.completionRate >= 70) {
    reasons.push(
      `${formatDay(strongestDay.day)} has a ${strongestDay.completionRate}% completion rate.`,
    );
  }

  const weakestDay = [...dayPerformance]
    .filter((day) => day.scheduledSessions >= 2)
    .sort(
      (a, b) =>
        a.completionRate - b.completionRate ||
        b.scheduledSessions - a.scheduledSessions,
    )[0];

  if (
    weakestDay &&
    weakestDay.completionRate < 50
  ) {
    reasons.push(
      `${formatDay(weakestDay.day)} has produced lower follow-through.`,
    );
  }

  const changed =
    recommendedDays.length > 0 &&
    !sameDays(
      recommendedDays,
      skill.preferred_days.slice(
        0,
        recommendedDays.length,
      ),
    );

  if (changed) {
    reasons.push(
      "Recommended days prioritize the user’s demonstrated completion pattern.",
    );
  } else if (recommendedDays.length > 0) {
    reasons.push(
      "The existing preferred days already align with observed behavior.",
    );
  }

  return reasons;
}

function getConfidence(
  sessionCount: number,
): SkillAdaptation["confidence"] {
  if (sessionCount >= 12) {
    return "high";
  }

  if (sessionCount >= 5) {
    return "medium";
  }

  return "low";
}

function getDayKey(dateValue: string): string {
  const [year, month, day] = dateValue
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);
  const mondayIndex = (date.getDay() + 6) % 7;

  return DAYS[mondayIndex];
}

function getDayIndex(day: string): number {
  return DAY_INDEX.get(
    day as (typeof DAYS)[number],
  ) ?? 7;
}

function isCompleted(
  session: PracticeSession,
): boolean {
  return (
    session.status === "completed" ||
    session.completed === true
  );
}

function formatDay(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function sameDays(
  first: string[],
  second: string[],
): boolean {
  if (first.length !== second.length) {
    return false;
  }

  return first.every(
    (day, index) => day === second[index],
  );
}