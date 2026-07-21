import { useSuspenseQuery } from "@tanstack/react-query";

import {
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  todayIso,
  weekBounds,
} from "@/features/forge/queries";

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

  const completedThisWeek =
    weekSessions.filter(
      (session) => session.completed,
    ).length;

  const consistency =
    weekSessions.length > 0
      ? Math.round(
          (completedThisWeek /
            weekSessions.length) *
            100,
        )
      : 0;

  const completedMinutes =
    weekSessions
      .filter(
        (session) => session.completed,
      )
      .reduce(
        (sum, session) =>
          sum +
          session.duration_minutes,
        0,
      );

  const totalHours =
    Math.round(
      (completedMinutes / 60) * 10,
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
  };
}