import { Link } from "@tanstack/react-router";

import { ForgeCard } from "@/components/forge";

const REFLECTION_PROMPTS = [
  "What moved you closer to your Vision today?",
  "Where did you act according to your values?",
  "Which practice felt most meaningful today?",
  "What challenged the person you are becoming?",
  "What deserves more attention tomorrow?",
  "What did you learn about yourself today?",
  "Where did you choose intention over convenience?",
];

type ReflectionPromptProps = {
  date?: Date;
};

export function ReflectionPrompt({
  date = new Date(),
}: ReflectionPromptProps) {
  const dayIndex =
    getDayOfYear(date) %
    REFLECTION_PROMPTS.length;

  const prompt =
    REFLECTION_PROMPTS[dayIndex];

  return (
    <ForgeCard padding="large">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        Reflection tonight
      </p>

      <blockquote className="mt-4 max-w-3xl text-xl font-extrabold leading-relaxed tracking-tight md:text-2xl">
        “{prompt}”
      </blockquote>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Close the loop by noticing what changed,
        what worked, and what should guide tomorrow.
      </p>

      <Link
        to="/review"
        className="mt-5 inline-flex text-xs font-semibold text-muted-foreground transition hover:text-foreground"
      >
        Open Review
      </Link>
    </ForgeCard>
  );
}

function getDayOfYear(
  date: Date,
): number {
  const start = new Date(
    date.getFullYear(),
    0,
    0,
  );

  const difference =
    date.getTime() -
    start.getTime();

  return Math.floor(
    difference /
      (1000 * 60 * 60 * 24),
  );
}