import {
  MemoryEngine,
  processAndPersistMemory,
  sessionCompletedSignal,
  sessionSkippedSignal,
} from "@/features/forge-engine/memory";

import type {
  SessionStatus,
} from "@/features/forge/types";

import {
  supabase,
} from "@/integrations/supabase/client";

type CompleteSessionOptions = {
  durationMinutes?: number;
  notes?: string | null;
};

type CompletedSessionSource = {
  id: string;
  user_id: string;
  skill_id: string | null;
  title: string;
  duration_minutes: number;
};

type SkippedSessionSource = {
  id: string;
  user_id: string;
  skill_id: string | null;
  title: string;
};

export async function completeSession(
  sessionId: string,
  options: CompleteSessionOptions = {},
): Promise<void> {
  const completedAt =
    new Date().toISOString();

  const updates: {
    status: SessionStatus;
    completed: boolean;
    completed_at: string;
    duration_minutes?: number;
    notes?: string | null;
  } = {
    status: "completed",
    completed: true,
    completed_at: completedAt,
  };

  if (
    options.durationMinutes !==
    undefined
  ) {
    updates.duration_minutes =
      options.durationMinutes;
  }

  if (
    options.notes !== undefined
  ) {
    updates.notes =
      options.notes;
  }

  const {
    data: session,
    error,
  } = await supabase
    .from("practice_sessions")
    .update(updates)
    .eq("id", sessionId)
    .select(
      `
        id,
        user_id,
        skill_id,
        title,
        duration_minutes
      `,
    )
    .single<CompletedSessionSource>();

  if (error) {
    throw error;
  }

  const signal =
    sessionCompletedSignal({
      userId: session.user_id,
      sessionId: session.id,
      skillId:
        session.skill_id ??
        undefined,
      title: session.title,
      durationMinutes:
        options.durationMinutes ??
        session.duration_minutes,
      completedAt,
    });

  const memory =
    MemoryEngine.processSignal(
      signal,
    );

  await processAndPersistMemory(
    session.user_id,
    memory,
  );
}

export async function startSession(
  sessionId: string,
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("practice_sessions")
    .update({
      status:
        "in_progress" satisfies SessionStatus,
      completed: false,
      completed_at: null,
    })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}

export async function skipSession(
  sessionId: string,
): Promise<void> {
  const skippedAt =
    new Date().toISOString();

  const {
    data: session,
    error,
  } = await supabase
    .from("practice_sessions")
    .update({
      status:
        "skipped" satisfies SessionStatus,
      completed: false,
      completed_at: null,
    })
    .eq("id", sessionId)
    .select(
      `
        id,
        user_id,
        skill_id,
        title
      `,
    )
    .single<SkippedSessionSource>();

  if (error) {
    throw error;
  }

  const signal =
    sessionSkippedSignal({
      userId: session.user_id,
      sessionId: session.id,
      skillId:
        session.skill_id ??
        undefined,
      title: session.title,
      skippedAt,
    });

  const memory =
    MemoryEngine.processSignal(
      signal,
    );

  await processAndPersistMemory(
    session.user_id,
    memory,
  );
}

export async function restoreSession(
  sessionId: string,
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("practice_sessions")
    .update({
      status:
        "scheduled" satisfies SessionStatus,
      completed: false,
      completed_at: null,
    })
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}

export async function removeSession(
  sessionId: string,
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("practice_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw error;
  }
}