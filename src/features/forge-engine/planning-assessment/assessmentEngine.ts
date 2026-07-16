import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";
import type {
  DailyWorkload,
  PlanAssessmentItem,
  WeeklyPlanAssessment,
} from "./assessment.types";

type AssessWeeklyPlanOptions = {
  sessions: PracticeSession[];
  skills: Skill[];
  lifeAreas: LifeArea[];
};

export function assessWeeklyPlan({
  sessions,
  skills,
  lifeAreas,
}: AssessWeeklyPlanOptions): WeeklyPlanAssessment {
  const activeSessions = sessions.filter(
    (session) => session.status !== "skipped",
  );

  const dailyWorkloads =
    calculateDailyWorkloads(activeSessions);

  const totalMinutes = activeSessions.reduce(
    (sum, session) =>
      sum + (session.duration_minutes ?? 0),
    0,
  );

  const busiestDay =
    [...dailyWorkloads].sort(
      (a, b) =>
        b.totalMinutes - a.totalMinutes ||
        b.sessionCount - a.sessionCount,
    )[0] ?? null;

  const items: PlanAssessmentItem[] = [];

  addPlanningVolumeAssessment(
    items,
    activeSessions.length,
    totalMinutes,
  );

  addDailyBalanceAssessment(items, dailyWorkloads);

  addRecoveryAssessment(items, dailyWorkloads);

  addLifeAreaAssessment(
    items,
    activeSessions,
    skills,
    lifeAreas,
  );

  const score = calculateAssessmentScore({
    totalSessions: activeSessions.length,
    totalMinutes,
    dailyWorkloads,
    itemTones: items.map((item) => item.tone),
  });

  return {
    score,
    label: getAssessmentLabel({
      totalSessions: activeSessions.length,
      totalMinutes,
      score,
    }),
    totalSessions: activeSessions.length,
    totalMinutes,
    busiestDay,
    dailyWorkloads,
    items,
  };
}

function calculateDailyWorkloads(
  sessions: PracticeSession[],
): DailyWorkload[] {
  const sessionsByDate = new Map<
    string,
    PracticeSession[]
  >();

  for (const session of sessions) {
    const current =
      sessionsByDate.get(session.scheduled_date) ?? [];

    current.push(session);
    sessionsByDate.set(session.scheduled_date, current);
  }

  return [...sessionsByDate.entries()]
    .map(([date, dateSessions]) => ({
      date,
      sessionCount: dateSessions.length,
      totalMinutes: dateSessions.reduce(
        (sum, session) =>
          sum + (session.duration_minutes ?? 0),
        0,
      ),
      highIntensitySessions: dateSessions.filter(
        (session) => session.intensity === "high",
      ).length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function addPlanningVolumeAssessment(
  items: PlanAssessmentItem[],
  totalSessions: number,
  totalMinutes: number,
) {
  if (totalSessions === 0) {
    items.push({
      id: "unplanned-week",
      title: "This week has not been planned yet.",
      description:
        "Generate the week to create a deliberate practice schedule.",
      tone: "neutral",
    });

    return;
  }

  if (totalMinutes >= 900) {
    items.push({
      id: "very-high-volume",
      title: "This is a demanding practice week.",
      description: `${formatMinutes(
        totalMinutes,
      )} are scheduled. Protect recovery and consider whether every session is essential.`,
      tone: "attention",
    });

    return;
  }

  if (totalMinutes >= 360) {
    items.push({
      id: "healthy-volume",
      title: "The week contains meaningful practice volume.",
      description: `${formatMinutes(
        totalMinutes,
      )} of deliberate work are distributed across ${totalSessions} sessions.`,
      tone: "positive",
    });

    return;
  }

  items.push({
    id: "light-volume",
    title: "This is a relatively light practice week.",
    description: `${formatMinutes(
      totalMinutes,
    )} are scheduled. A lighter week may be appropriate for recovery or competing obligations.`,
    tone: "neutral",
  });
}

function addDailyBalanceAssessment(
  items: PlanAssessmentItem[],
  workloads: DailyWorkload[],
) {
  if (workloads.length === 0) {
    return;
  }

  const overloadedDays = workloads.filter(
    (day) =>
      day.sessionCount >= 4 || day.totalMinutes >= 240,
  );

  if (overloadedDays.length > 0) {
    const first = overloadedDays[0];

    items.push({
      id: "daily-overload",
      title: `${formatDate(
        first.date,
      )} may be overloaded.`,
      description: `${first.sessionCount} sessions totaling ${formatMinutes(
        first.totalMinutes,
      )} are scheduled that day.`,
      tone: "attention",
    });

    return;
  }

  const usedDays = workloads.length;
  const largestSessionDifference =
    Math.max(...workloads.map((day) => day.sessionCount)) -
    Math.min(...workloads.map((day) => day.sessionCount));

  if (usedDays >= 4 && largestSessionDifference <= 2) {
    items.push({
      id: "balanced-distribution",
      title: "Practice is distributed evenly.",
      description: `${usedDays} days contain scheduled work without a major concentration on one day.`,
      tone: "positive",
    });
  }
}

function addRecoveryAssessment(
  items: PlanAssessmentItem[],
  workloads: DailyWorkload[],
) {
  const consecutiveHighDays: string[] = [];

  for (
    let index = 1;
    index < workloads.length;
    index += 1
  ) {
    const previous = workloads[index - 1];
    const current = workloads[index];

    const consecutive =
      differenceInDays(previous.date, current.date) === 1;

    if (
      consecutive &&
      previous.highIntensitySessions > 0 &&
      current.highIntensitySessions > 0
    ) {
      consecutiveHighDays.push(current.date);
    }
  }

  if (consecutiveHighDays.length > 0) {
    items.push({
      id: "recovery-spacing",
      title: "Demanding practices are scheduled on consecutive days.",
      description:
        "Consider separating high-intensity sessions when recovery is important.",
      tone: "attention",
    });

    return;
  }

  const highIntensityCount = workloads.reduce(
    (sum, day) => sum + day.highIntensitySessions,
    0,
  );

  if (highIntensityCount > 0) {
    items.push({
      id: "recovery-protected",
      title: "Demanding practices have useful recovery space.",
      description:
        "High-intensity sessions are not heavily concentrated on consecutive days.",
      tone: "positive",
    });
  }
}

function addLifeAreaAssessment(
  items: PlanAssessmentItem[],
  sessions: PracticeSession[],
  skills: Skill[],
  lifeAreas: LifeArea[],
) {
  const skillById = new Map(
    skills.map((skill) => [skill.id, skill]),
  );

  const minutesByArea = new Map<string, number>();

  for (const session of sessions) {
    if (!session.skill_id) {
      continue;
    }

    const areaId =
      skillById.get(session.skill_id)?.life_area_id;

    if (!areaId) {
      continue;
    }

    minutesByArea.set(
      areaId,
      (minutesByArea.get(areaId) ?? 0) +
        (session.duration_minutes ?? 0),
    );
  }

  const representedAreas = lifeAreas.filter(
    (area) =>
      !area.archived &&
      (minutesByArea.get(area.id) ?? 0) > 0,
  );

  if (representedAreas.length >= 3) {
    items.push({
      id: "multiple-life-areas",
      title: "Several parts of life receive attention.",
      description: `${representedAreas.length} life areas are represented in this week’s plan.`,
      tone: "positive",
    });

    return;
  }

  const activeAreas = lifeAreas.filter(
    (area) => !area.archived,
  );

  if (
    activeAreas.length >= 3 &&
    representedAreas.length === 1
  ) {
    items.push({
      id: "single-area-focus",
      title: "The plan is concentrated in one life area.",
      description:
        "That may be intentional, but consider whether another important area needs a small practice this week.",
      tone: "attention",
    });
  }
}

function calculateAssessmentScore({
  totalSessions,
  totalMinutes,
  dailyWorkloads,
  itemTones,
}: {
  totalSessions: number;
  totalMinutes: number;
  dailyWorkloads: DailyWorkload[];
  itemTones: Array<
    PlanAssessmentItem["tone"]
  >;
}): number {
  if (totalSessions === 0) {
    return 0;
  }

  let score = 70;

  score +=
    itemTones.filter((tone) => tone === "positive")
      .length * 8;

  score -=
    itemTones.filter((tone) => tone === "attention")
      .length * 12;

  if (totalMinutes >= 240 && totalMinutes <= 720) {
    score += 8;
  }

  if (dailyWorkloads.length >= 4) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function getAssessmentLabel({
  totalSessions,
  totalMinutes,
  score,
}: {
  totalSessions: number;
  totalMinutes: number;
  score: number;
}): WeeklyPlanAssessment["label"] {
  if (totalSessions === 0) {
    return "unplanned";
  }

  if (totalMinutes >= 900 || score < 55) {
    return "demanding";
  }

  if (totalMinutes < 240) {
    return "light";
  }

  return "balanced";
}

function differenceInDays(
  first: string,
  second: string,
): number {
  const firstDate = parseDate(first);
  const secondDate = parseDate(second);

  return Math.round(
    (secondDate.getTime() - firstDate.getTime()) /
      86_400_000,
  );
}

function parseDate(value: string): Date {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(value: string): string {
  return parseDate(value).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    },
  );
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = minutes / 60;

  return Number.isInteger(hours)
    ? `${hours} hours`
    : `${hours.toFixed(1)} hours`;
}