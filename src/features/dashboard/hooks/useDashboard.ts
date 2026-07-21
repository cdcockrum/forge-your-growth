import { useSuspenseQuery } from "@tanstack/react-query";

import {
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  todayIso,
  weekBounds,
} from "@/features/forge/queries";

import {
  calculateForgeHealthScore,
  calculateForgeScore,
  calculateProgress,
} from "@/features/forge-engine";


export function useDashboard() {
  const { data: areas } =
    useSuspenseQuery(lifeAreasQuery());

  const { data: skills } =
    useSuspenseQuery(skillsQuery());

  const { data: profile } =
    useSuspenseQuery(profileQuery());

  const { start, end } = weekBounds();

  const { data: weekSessions } =
    useSuspenseQuery(
      sessionsInRangeQuery(start, end),
    );

  const today = todayIso();

  const todaySessions =
    weekSessions.filter(
      (session) =>
        session.scheduled_date === today,
    );

  const forgeHealth =
  calculateForgeHealthScore({
    sessions: weekSessions,
    skills,
    weeklyReviewCompleted: false,
  });

const forgePoints =
  calculateForgeScore({
    sessions: weekSessions,
    skills,
    weeklyReviewCompleted: false,
  });

const progress = calculateProgress({
  sessions: weekSessions,
  skills,
  lifeAreas: areas,
});


const completedThisWeek =
  progress.completedSessions;

const consistency =
  progress.completionRate;

const totalHours =
  Math.round(
    (progress.totalMinutes / 60) * 10,
  ) / 10;

  const currentDate = new Date();

  const dayName =
    currentDate.toLocaleDateString(
      "en",
      {
        weekday: "long",
      },
    );

  const dateStr =
    currentDate.toLocaleDateString(
      "en",
      {
        month: "short",
        day: "numeric",
      },
    );

  const firstName =
    profile?.full_name
      ?.split(" ")[0] ?? "there";

  return {
  areas,
  skills,
  profile,
  weekSessions,
  todaySessions,
  completedThisWeek,
  consistency,
  totalHours,
  dayName,
  dateStr,
  firstName,
  progress,
  forgeHealth,
  forgePoints,
};
}