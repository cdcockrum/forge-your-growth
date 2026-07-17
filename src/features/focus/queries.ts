import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FocusItem } from "./types";

export const focusItemsQuery = () =>
  queryOptions({
    queryKey: ["focus-items"],

    queryFn: async (): Promise<FocusItem[]> => {
      const { data, error } = await supabase
        .from("focus_items")
        .select("*")
        .order("scheduled_date", {
          ascending: true,
          nullsFirst: false,
        })
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: true,
        });

      if (error) throw error;

      return (data ?? []) as FocusItem[];
    },
  });

export const focusItemsForDateQuery = (
  date: string,
) =>
  queryOptions({
    queryKey: ["focus-items", date],

    queryFn: async (): Promise<FocusItem[]> => {
      const { data, error } = await supabase
        .from("focus_items")
        .select("*")
        .eq("scheduled_date", date)
        .order("sort_order", {
          ascending: true,
        });

      if (error) throw error;

      return (data ?? []) as FocusItem[];
    },
  });