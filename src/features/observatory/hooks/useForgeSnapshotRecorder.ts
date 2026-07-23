import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  ForgeState,
} from "@/features/forge-engine/forge.types";

import type {
  PatternSummary,
} from "@/features/forge-engine/patterns";

import type {
  ReflectionEntry,
} from "@/features/forge-engine/reflection";

import {
  useSaveForgeSnapshot,
} from "./useForgeSnapshots";

type UseForgeSnapshotRecorderOptions = {
  snapshotDate: string;
  forge: ForgeState | null | undefined;

  reflection?: ReflectionEntry | null;
  patterns?: PatternSummary | null;

  enabled?: boolean;
};

function buildSnapshotSignature({
  snapshotDate,
  forge,
  reflection,
  patterns,
}: {
  snapshotDate: string;
  forge: ForgeState;
  reflection: ReflectionEntry | null;
  patterns: PatternSummary | null;
}): string {
  return JSON.stringify({
    snapshotDate,

    forgeScore:
      forge.forgeScore.score,

    momentumScore:
      forge.momentum.score,

    completionRate:
      forge.progress.completionRate,

    completedSessions:
      forge.progress.completedSessions,

    scheduledSessions:
      forge.progress.scheduledSessions,

    energy:
      reflection?.energy ?? null,

    focus:
      reflection?.focus ?? null,

    stress:
      reflection?.stress ?? null,

    identity:
      forge.identity,

    patterns,
  });
}

export function useForgeSnapshotRecorder({
  snapshotDate,
  forge,
  reflection = null,
  patterns = null,
  enabled = true,
}: UseForgeSnapshotRecorderOptions) {
  const saveSnapshot =
    useSaveForgeSnapshot();

  const lastSavedSignature =
    useRef<string | null>(null);

  const signature = useMemo(() => {
    if (!forge) {
      return null;
    }

    return buildSnapshotSignature({
      snapshotDate,
      forge,
      reflection,
      patterns,
    });
  }, [
    snapshotDate,
    forge,
    reflection,
    patterns,
  ]);

  useEffect(() => {
    if (
      !enabled ||
      !forge ||
      !snapshotDate ||
      !signature ||
      saveSnapshot.isPending
    ) {
      return;
    }

    if (
      lastSavedSignature.current ===
      signature
    ) {
      return;
    }

    lastSavedSignature.current =
      signature;

    saveSnapshot.mutate(
      {
        snapshotDate,
        forge,
        reflection,
        patterns,
      },
      {
        onError: () => {
          // Allow the same snapshot to retry
          // after a failed background save.
          lastSavedSignature.current =
            null;
        },
      },
    );
  }, [
    enabled,
    forge,
    patterns,
    reflection,
    saveSnapshot,
    signature,
    snapshotDate,
  ]);

  return {
    isSaving:
      saveSnapshot.isPending,

    isSaved:
      saveSnapshot.isSuccess,

    isError:
      saveSnapshot.isError,

    error:
      saveSnapshot.error,
  };
}