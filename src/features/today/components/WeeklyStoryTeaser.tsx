import { Link } from "@tanstack/react-router";

import { ForgeCard } from "@/components/forge";

import type {
  WeeklyNarrative,
} from "@/features/forge-engine";

type WeeklyStoryTeaserProps = {
  narrative: WeeklyNarrative;
};

export function WeeklyStoryTeaser({
  narrative,
}: WeeklyStoryTeaserProps) {
  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        This week’s story
      </p>

      <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
        {narrative.title}
      </h2>

      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
        {narrative.opening}
      </p>

      <Link
        to="/story"
        className="mt-5 inline-flex text-xs font-semibold text-muted-foreground transition hover:text-foreground"
      >
        Read the full story →
      </Link>
    </ForgeCard>
  );
}