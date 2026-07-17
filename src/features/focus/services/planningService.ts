import { generateWeeklySessions } from "@/features/forge/planner";
import { weekBounds } from "@/features/forge/queries";
import type {
  PracticeSession,
  Skill,
} from "@/features/forge/types";
import { supabase } from "@/integrations/supabase/client";

export async function generateCurrentWeek() {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!userData.user) {
    throw new Error("User not authenticated.");
  }

  const userId = userData.user.id;
  const { start, end } = weekBounds();

  const { data: skillsData, error: skillsError } =
    await supabase
      .from("skills")
      .select("*")
      .eq("archived", false);

  if (skillsError) {
    throw skillsError;
  }

  const { data: sessionsData, error: sessionsError } =
    await supabase
      .from("practice_sessions")
      .select("*")
      .gte("scheduled_date", start)
      .lte("scheduled_date", end);

  if (sessionsError) {
    throw sessionsError;
  }

  const skills = (skillsData ?? []) as Skill[];
  const existingSessions =
    (sessionsData ?? []) as PracticeSession[];

  const generatedSessions = generateWeeklySessions({
    userId,
    weekStart: start,
    skills,
    existingSessions,
  });

  if (generatedSessions.length === 0) {
    return {
      created: 0,
    };
  }

  const databaseSessions = generatedSessions.map(
    ({
      planning_score: _planningScore,
      planning_reasons: _planningReasons,
      ...session
    }) => session,
  );

  const { error: insertError } = await supabase
    .from("practice_sessions")
    .insert(databaseSessions);

  if (insertError) {
    throw insertError;
  }

  return {
    created: databaseSessions.length,
  };
}