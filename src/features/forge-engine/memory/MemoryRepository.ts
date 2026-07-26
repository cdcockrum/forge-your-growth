import {
  supabase,
} from "@/integrations/supabase/client";

import type {
  Database,
} from "@/integrations/supabase/types";

type ForgeMemoryRow =
  Database["public"]["Tables"]["forge_memories"]["Row"];

type ForgeMemoryInsert =
  Database["public"]["Tables"]["forge_memories"]["Insert"];

type ForgeMemoryUpdate =
  Database["public"]["Tables"]["forge_memories"]["Update"];

export class MemoryRepository {
  static async getAll(
    userId: string,
  ): Promise<ForgeMemoryRow[]> {
    const {
      data,
      error,
    } = await supabase
      .from("forge_memories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  static async getRecent(
    userId: string,
    limit = 20,
  ): Promise<ForgeMemoryRow[]> {
    const safeLimit = Math.max(
      1,
      Math.min(limit, 100),
    );

    const {
      data,
      error,
    } = await supabase
      .from("forge_memories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(safeLimit);

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  static async insert(
    record: ForgeMemoryInsert,
  ): Promise<ForgeMemoryRow> {
    const {
      data,
      error,
    } = await supabase
      .from("forge_memories")
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async update(
    id: string,
    updates: ForgeMemoryUpdate,
  ): Promise<ForgeMemoryRow> {
    const {
      data,
      error,
    } = await supabase
      .from("forge_memories")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async remove(
    id: string,
  ): Promise<void> {
    const {
      error,
    } = await supabase
      .from("forge_memories")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  static async findBySource({
    userId,
    sourceType,
    sourceId,
  }: {
    userId: string;
    sourceType: string;
    sourceId: string;
  }): Promise<ForgeMemoryRow | null> {
    const {
      data,
      error,
    } = await supabase
      .from("forge_memories")
      .select("*")
      .eq("user_id", userId)
      .eq("source_type", sourceType)
      .eq("source_id", sourceId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}