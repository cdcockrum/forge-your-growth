import type {
  Json,
} from "@/integrations/supabase/types";

import {
  supabase,
} from "@/integrations/supabase/client";

import type {
  ForgeSnapshotRange,
  ForgeSnapshotRow,
  SaveForgeSnapshotInput,
} from "./snapshot.types";

function toJson(value: unknown): Json {
  return JSON.parse(
    JSON.stringify(value),
  ) as Json;
}

export async function getForgeSnapshots({
  startDate,
  endDate,
}: ForgeSnapshotRange = {}): Promise<
  ForgeSnapshotRow[]
> {
  let query = supabase
    .from("forge_snapshots")
    .select("*")
    .order("snapshot_date", {
      ascending: true,
    });

  if (startDate) {
    query = query.gte(
      "snapshot_date",
      startDate,
    );
  }

  if (endDate) {
    query = query.lte(
      "snapshot_date",
      endDate,
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw new Error(
      `Unable to load Forge snapshots: ${error.message}`,
    );
  }

  return data ?? [];
}

export async function getForgeSnapshotByDate(
  snapshotDate: string,
): Promise<ForgeSnapshotRow | null> {
  const {
    data,
    error,
  } = await supabase
    .from("forge_snapshots")
    .select("*")
    .eq(
      "snapshot_date",
      snapshotDate,
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load Forge snapshot: ${error.message}`,
    );
  }

  return data;
}

export async function saveForgeSnapshot({
  snapshotDate,
  forge,
  reflection = null,
  patterns = null,
}: SaveForgeSnapshotInput): Promise<
  ForgeSnapshotRow
> {
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
      "You must be signed in to save a Forge snapshot.",
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("forge_snapshots")
    .upsert(
      {
        user_id: user.id,
        snapshot_date: snapshotDate,

        forge_score:
          forge.forgeScore.score,

        momentum_score:
          forge.momentum.score,

        completion_rate:
          forge.progress.completionRate,

        completed_sessions:
          forge.progress.completedSessions,

        planned_sessions:
          forge.progress.scheduledSessions,

        energy:
          reflection?.energy ?? null,

        focus:
          reflection?.focus ?? null,

        stress:
          reflection?.stress ?? null,

        progress_snapshot:
          toJson(forge.progress),

        identity_snapshot:
          toJson(forge.identity),

        momentum_snapshot:
          toJson(forge.momentum),

        pattern_snapshot:
          toJson(
            patterns ?? {
              patterns: [],
              strongestPattern: null,
            },
          ),

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "user_id,snapshot_date",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Unable to save Forge snapshot: ${error.message}`,
    );
  }

  return data;
}