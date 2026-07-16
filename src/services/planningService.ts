import { supabase } from "@/integrations/supabase/client";
import { generateWeeklySessions } from "@/features/forge/planner";
import { weekBounds } from "@/features/forge/queries";
import type { Skill, PracticeSession } from "@/features/forge/types";

export async function generateCurrentWeek() {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated.");
  }

  const userId = userData.user.id;

  const { start, end } = weekBounds();

  // Load Skills
  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("*")
    .eq("archived", false);

  if (skillsError) throw skillsError;

  // Load Existing Sessions
  const { data: existingSessions, error: sessionError } =
    await supabase
      .from("practice_sessions")
      .select("*")
      .gte("scheduled_date", start)
      .lte("scheduled_date", end);

  if (sessionError) throw sessionError;

  const sessions = generateWeeklySessions({
    userId,
    weekStart: start,
    skills: (skills ?? []) as Skill[],
    existingSessions:
      (existingSessions ?? []) as PracticeSession[],
  });

  if (sessions.length === 0) {
    return {
      created: 0,
    };
  }

  const { error } = await supabase
    .from("practice_sessions")
    .insert(sessions);

  if (error) throw error;

  return {
    created: sessions.length,
  };
}