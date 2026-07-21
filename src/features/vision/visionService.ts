import { supabase } from "@/integrations/supabase/client";

import type {
  Vision,
  VisionInput,
} from "./types";

export async function getVision(): Promise<Vision | null> {
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const user = authData.user;

  if (!user) {
    throw new Error("You must be signed in to view your Vision.");
  }

  const { data, error } = await supabase
    .from("visions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Vision | null;
}

export async function saveVision(
  input: VisionInput,
): Promise<Vision> {
  const {
    data: authData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  const user = authData.user;

  if (!user) {
    throw new Error("You must be signed in to save your Vision.");
  }

  const { data, error } = await supabase
    .from("visions")
    .upsert(
      {
        user_id: user.id,
        mission: input.mission.trim(),
        core_values: input.core_values,
        identities: input.identities,
        themes: input.themes,
        north_star: input.north_star.trim(),
      },
      {
        onConflict: "user_id",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Vision;
}