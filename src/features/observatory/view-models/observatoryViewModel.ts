import type {
  ForgeSnapshotRow,
} from "../snapshot.types";

import type {
  ObservatoryViewModel,
} from "./observatory.types";

export function buildObservatoryViewModel(
  snapshots: ForgeSnapshotRow[],
): ObservatoryViewModel {

  return {

    momentum: snapshots.map(
      snapshot => ({
        date: snapshot.snapshot_date,
        value: snapshot.momentum_score ?? 0,
      }),
    ),

    forgeScore: snapshots.map(
      snapshot => ({
        date: snapshot.snapshot_date,
        value: snapshot.forge_score ?? 0,
      }),
    ),

    completionRate: snapshots.map(
      snapshot => ({
        date: snapshot.snapshot_date,
        value: snapshot.completion_rate ?? 0,
      }),
    ),

    energyVsCompletion:
      snapshots
        .filter(
          snapshot =>
            snapshot.energy !== null,
        )
        .map(snapshot => ({
          x:
            snapshot.energy === "low"
              ? 1
              : snapshot.energy === "medium"
                ? 2
                : 3,

          y:
            snapshot.completed_sessions,
        })),

  };

}