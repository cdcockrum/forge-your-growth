import { supabase } from "@/integrations/supabase/client";
import type { FocusItem } from "../types";

export type CreateFocusItemInput = {
  user_id: string;
  title: string;
  notes?: string | null;
  scheduled_date?: string | null;
  completed?: boolean;
  completed_at?: string | null;
  priority?: number;
  sort_order?: number;
  chronicle?: boolean;
  category?: string | null;
};

export type UpdateFocusItemInput = Partial<
  Omit<
    FocusItem,
    "id" | "user_id" | "created_at" | "updated_at"
  >
>;

export async function createFocusItem(
  item: CreateFocusItemInput,
): Promise<FocusItem> {
  const { data, error } = await supabase
    .from("focus_items")
    .insert(item)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as FocusItem;
}

export async function updateFocusItem(
  id: string,
  updates: UpdateFocusItemInput,
): Promise<FocusItem> {
  const { data, error } = await supabase
    .from("focus_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as FocusItem;
}

export async function toggleFocusComplete(
  item: FocusItem,
): Promise<FocusItem> {
  const completed = !item.completed;

  return updateFocusItem(item.id, {
    completed,
    completed_at: completed
      ? new Date().toISOString()
      : null,
  });
}

export async function deleteFocusItem(
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from("focus_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}