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
  buildForgeState,
} from "@/features/forge-engine";

import { useVision } from "@/features/vision";


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

  const { vision } = useVision();

  const forge = buildForgeState({
  vision,

  sessions: weekSessions,
  skills,
  lifeAreas: areas,
});


const completedThisWeek =
  forge.progress.completedSessions;

const consistency =
  forge.progress.completionRate;

const totalHours =
  Math.round(
    (forge.progress.totalMinutes / 60) * 10,
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
  forge,
  progress: forge.progress,
  forgeHealth: forge.forgeHealth,
  forgePoints: forge.forgeScore,
  vision: forge.vision,
};
}