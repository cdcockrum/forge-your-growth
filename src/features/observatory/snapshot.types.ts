import type {
  ForgeState,
  PatternSummary,
  ReflectionEntry,
} from "@/features/forge-engine";

import type {
  Database,
} from "@/integrations/supabase/types";

export type ForgeSnapshotRow =
  Database["public"]["Tables"]["forge_snapshots"]["Row"];

export type SaveForgeSnapshotInput = {
  snapshotDate: string;
  forge: ForgeState;
  reflection?: ReflectionEntry | null;
  patterns?: PatternSummary | null;
};

export type ForgeSnapshotRange = {
  startDate?: string;
  endDate?: string;
};