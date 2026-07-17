import { supabase } from "@/integrations/supabase/client";
import type { SessionStatus } from "@/features/forge/types";

type CompleteSessionOptions = {
  durationMinutes?: number;
  notes?: string | null;
};

export async function completeSession(
  sessionId: string,
  options: CompleteSessionOptions = {},
) {
  const updates: {
    status: SessionStatus;
    completed: boolean;
    completed_at: string;
    duration_minutes?: number;
    notes?: string | null;
  } = {
    status: "completed",
    completed: true,
    completed_at: new Date().toISOString(),
  };

  if (options.durationMinutes !== undefined) {
    updates.duration_minutes = options.durationMinutes;
  }

  if (options.notes !== undefined) {
    updates.notes = options.notes;
  }

  const { error } = await supabase
    .from("practice_sessions")
    .update(updates)
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}

export async function startSession(sessionId: string) {
  const { error } = await supabase
    .from("practice_sessions")
    .update({
      status: "in_progress" satisfies SessionStatus,
      completed: false,
      completed_at: null,
    })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}

export async function skipSession(sessionId: string) {
  const { error } = await supabase
    .from("practice_sessions")
    .update({
      status: "skipped" satisfies SessionStatus,
      completed: false,
      completed_at: null,
    })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}

export async function restoreSession(sessionId: string) {
  const { error } = await supabase
    .from("practice_sessions")
    .update({
      status: "scheduled" satisfies SessionStatus,
      completed: false,
      completed_at: null,
    })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}

export async function removeSession(sessionId: string) {
  const { error } = await supabase
    .from("practice_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}