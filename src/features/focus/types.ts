export interface FocusItem {
  id: string;

  user_id: string;

  title: string;

  notes: string | null;

  scheduled_date: string | null;

  completed: boolean;

  completed_at: string | null;

  priority: number;

  sort_order: number;

  chronicle: boolean;

  category: string | null;

  created_at: string;

  updated_at: string;
}