import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getForgeSnapshotByDate,
  getForgeSnapshots,
  saveForgeSnapshot,
} from "../snapshotService";

import type {
  ForgeSnapshotRange,
  SaveForgeSnapshotInput,
} from "../snapshot.types";

export const forgeSnapshotKeys = {
  all: ["forge-snapshots"] as const,

  history: ({
    startDate,
    endDate,
  }: ForgeSnapshotRange = {}) =>
    [
      ...forgeSnapshotKeys.all,
      "history",
      startDate ?? null,
      endDate ?? null,
    ] as const,

  byDate: (snapshotDate: string) =>
    [
      ...forgeSnapshotKeys.all,
      "date",
      snapshotDate,
    ] as const,
};

export function useForgeSnapshots(
  range: ForgeSnapshotRange = {},
) {
  return useQuery({
    queryKey:
      forgeSnapshotKeys.history(range),

    queryFn: () =>
      getForgeSnapshots(range),
  });
}

export function useForgeSnapshotByDate(
  snapshotDate: string,
) {
  return useQuery({
    queryKey:
      forgeSnapshotKeys.byDate(
        snapshotDate,
      ),

    queryFn: () =>
      getForgeSnapshotByDate(
        snapshotDate,
      ),

    enabled:
      Boolean(snapshotDate),
  });
}

export function useSaveForgeSnapshot() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: SaveForgeSnapshotInput,
    ) => saveForgeSnapshot(input),

    onSuccess: (snapshot) => {
      queryClient.setQueryData(
        forgeSnapshotKeys.byDate(
          snapshot.snapshot_date,
        ),
        snapshot,
      );

      void queryClient.invalidateQueries({
        queryKey:
          forgeSnapshotKeys.all,
      });
    },
  });
}