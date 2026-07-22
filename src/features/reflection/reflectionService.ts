import {
  supabase,
} from "@/integrations/supabase/client";

import type {
  CreateReflectionInput,
  ReflectionRow,
} from "./types";

export async function getReflections({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
} = {}): Promise<ReflectionRow[]> {
  let query = supabase
    .from("daily_reflections")
    .select("*")
    .order("reflection_date", {
      ascending: false,
    });

  if (startDate) {
    query = query.gte(
      "reflection_date",
      startDate,
    );
  }

  if (endDate) {
    query = query.lte(
      "reflection_date",
      endDate,
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw new Error(
      `Unable to load reflections: ${error.message}`,
    );
  }

  return data ?? [];
}

export async function getReflectionByDate(
  reflectionDate: string,
): Promise<ReflectionRow | null> {
  const {
    data,
    error,
  } = await supabase
    .from("daily_reflections")
    .select("*")
    .eq(
      "reflection_date",
      reflectionDate,
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load reflection: ${error.message}`,
    );
  }

  return data;
}

export async function saveReflection(
  input: CreateReflectionInput,
): Promise<ReflectionRow> {
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Unable to verify user: ${authError.message}`,
    );
  }

  const user = authData.user;

  if (!user) {
    throw new Error(
      "You must be signed in to save a reflection.",
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("daily_reflections")
    .upsert(
      {
        user_id: user.id,
        reflection_date:
          input.reflectionDate,
        energy: input.energy,
        focus: input.focus,
        stress: input.stress,
        proud_of:
          input.proudOf.trim(),
        obstacle:
          input.obstacle.trim(),
        lesson:
          input.lesson.trim(),
        next_step:
          input.nextStep.trim(),
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "user_id,reflection_date",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Unable to save reflection: ${error.message}`,
    );
  }

  return data;
}