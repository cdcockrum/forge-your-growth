import { supabase } from "@/integrations/supabase/client";
import type { FocusItem } from "../types";

export async function createFocusItem(
  item: Partial<FocusItem>,
) {
  const { data, error } = await supabase
    .from("focus_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateFocusItem(
  id: string,
  updates: Partial<FocusItem>,
) {
  const { data, error } = await supabase
    .from("focus_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function toggleFocusComplete(
  item: FocusItem,
) {
  const completed = !item.completed;

  const { data, error } = await supabase
    .from("focus_items")
    .update({
      completed,
      completed_at: completed
        ? new Date().toISOString()
        : null,
    })
    .eq("id", item.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteFocusItem(
  id: string,
) {
  const { error } = await supabase
    .from("focus_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}