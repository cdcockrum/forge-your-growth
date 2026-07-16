import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LifeArea, Skill, PracticeSession, Reflection } from "./types";

export const lifeAreasQuery = () =>
  queryOptions({
    queryKey: ["life_areas"],
    queryFn: async (): Promise<LifeArea[]> => {
      const { data, error } = await supabase
        .from("life_areas")
        .select("*")
        .eq("archived", false)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as LifeArea[];
    },
  });

export const skillsQuery = () =>
  queryOptions({
    queryKey: ["skills"],
    queryFn: async (): Promise<Skill[]> => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Skill[];
    },
  });

export const sessionsInRangeQuery = (start: string, end: string) =>
  queryOptions({
    queryKey: ["sessions", start, end],
    queryFn: async (): Promise<PracticeSession[]> => {
      const { data, error } = await supabase
        .from("practice_sessions")
        .select("*")
        .gte("scheduled_date", start)
        .lte("scheduled_date", end)
        .order("scheduled_date", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as PracticeSession[];
    },
  });

export const reflectionQuery = (weekStart: string) =>
  queryOptions({
    queryKey: ["reflection", weekStart],
    queryFn: async (): Promise<Reflection | null> => {
      const { data, error } = await supabase
        .from("reflections")
        .select("*")
        .eq("week_start", weekStart)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Reflection | null;
    },
  });

export const profileQuery = () =>
  queryOptions({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export function weekBounds(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(date);
  monday.setDate(date.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: iso(monday), end: iso(sunday), monday, sunday };
}

export function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function todayIso() {
  return iso(new Date());
}
