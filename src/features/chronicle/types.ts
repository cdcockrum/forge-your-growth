import type {
  ForgeEvent,
} from "@/features/forge-engine/events";

export type ChronicleDay = {
  date: string;
  label: string;
  events: ForgeEvent[];
};

export type ChronicleViewModel = {
  days: ChronicleDay[];
  totalEvents: number;
  latestEvent: ForgeEvent | null;
};