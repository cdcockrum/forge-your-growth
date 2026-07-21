import { Link } from "@tanstack/react-router";

import { ForgeCard } from "@/components/forge";

type NorthStarCardProps = {
  text: string;
};

export function NorthStarCard({
  text,
}: NorthStarCardProps) {
  if (!text.trim()) {
    return (
      <ForgeCard
        variant="dashed"
        padding="large"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Your North Star
        </p>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight">
          Define the sentence that guides you.
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Add a North Star to your Vision so Forge can
          connect today’s work to your larger direction.
        </p>

        <Link
          to="/vision"
          className="mt-5 inline-flex rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition hover:bg-foreground/90"
        >
          Add your North Star
        </Link>
      </ForgeCard>
    );
  }

  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Your North Star
      </p>

      <blockquote className="mt-4 max-w-3xl text-2xl font-extrabold leading-snug tracking-tight md:text-3xl">
        “{text}”
      </blockquote>

      <Link
        to="/vision"
        className="mt-5 inline-flex text-xs font-semibold text-muted-foreground transition hover:text-foreground"
      >
        Edit Vision
      </Link>
    </ForgeCard>
  );
}