import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CheckCircle2, Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/forge/app-shell";
import {
  reflectionQuery,
  sessionsInRangeQuery,
  weekBounds,
} from "@/features/forge/queries";
import type { PracticeSession } from "@/features/forge/types";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/review")({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(
        reflectionQuery(start),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
    ]);
  },
  component: ReviewPage,
});

function ReviewPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-8 md:px-10 md:pt-12">
      <Suspense fallback={<ReviewLoadingState />}>
        <ReviewContent />
      </Suspense>
    </main>
  );
}

function ReviewLoadingState() {
  return (
    <div className="space-y-5">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-2xl bg-muted"
        />
      ))}
    </div>
  );
}

function ReviewContent() {
  const queryClient = useQueryClient();
  const { start, end, monday, sunday } = weekBounds();

  const { data: reflection } = useSuspenseQuery(
    reflectionQuery(start),
  );

  const { data: sessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const [wentWell, setWentWell] = useState("");
  const [difficult, setDifficult] = useState("");
  const [learned, setLearned] = useState("");
  const [focusNextWeek, setFocusNextWeek] = useState("");
  const [feeling, setFeeling] = useState<number | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWentWell(reflection?.went_well ?? "");
    setDifficult(reflection?.difficult ?? "");
    setLearned(reflection?.learned ?? "");
    setFocusNextWeek(
      reflection?.focus_next_week ?? "",
    );
    setFeeling(reflection?.feeling ?? null);
  }, [reflection]);

  const summary = useMemo(
    () => calculateWeekSummary(sessions),
    [sessions],
  );

  const hasReflection =
    wentWell.trim().length > 0 ||
    difficult.trim().length > 0 ||
    learned.trim().length > 0 ||
    focusNextWeek.trim().length > 0 ||
    feeling !== null;

  async function save() {
    try {
      setSaving(true);

      const { data, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error("User not authenticated.");
      }

      const { error: saveError } = await supabase
        .from("reflections")
        .upsert(
          {
            user_id: data.user.id,
            week_start: start,
            went_well: emptyToNull(wentWell),
            difficult: emptyToNull(difficult),
            learned: emptyToNull(learned),
            focus_next_week:
              emptyToNull(focusNextWeek),
            feeling,
          },
          {
            onConflict: "user_id,week_start",
          },
        );

      if (saveError) {
        throw saveError;
      }

      await queryClient.invalidateQueries({
        queryKey: ["reflection"],
      });

      toast.success("Weekly reflection saved.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The reflection could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={`Week of ${monday.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        )} — ${sunday.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`}
        title={
          <>
            Weekly{" "}
            <span className="text-accent">
              reflection
            </span>
            .
          </>
        }
      />

      <WeekSummary
        completed={summary.completed}
        skipped={summary.skipped}
        total={summary.total}
        completedMinutes={summary.completedMinutes}
      />

      <div className="mt-8 space-y-6">
        <Prompt
          eyebrow="Wins"
          label="What went well?"
          description="Notice the practices, choices, or moments that helped you move forward."
          value={wentWell}
          onChange={setWentWell}
        />

        <Prompt
          eyebrow="Challenges"
          label="What was difficult?"
          description="Treat friction as useful information rather than failure."
          value={difficult}
          onChange={setDifficult}
        />

        <Prompt
          eyebrow="Lessons"
          label="What did you learn?"
          description="Capture what this week taught you about your practice and yourself."
          value={learned}
          onChange={setLearned}
        />

        <Prompt
          eyebrow="Direction"
          label="What should next week emphasize?"
          description="Choose a clear focus that can shape the next weekly plan."
          value={focusNextWeek}
          onChange={setFocusNextWeek}
        />

        <EnergySelector
          value={feeling}
          onChange={setFeeling}
        />

        <button
          type="button"
          onClick={save}
          disabled={saving || !hasReflection}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="size-4" />
              Save weekly reflection
            </>
          )}
        </button>
      </div>
    </>
  );
}

type WeekSummaryProps = {
  completed: number;
  skipped: number;
  total: number;
  completedMinutes: number;
};

function WeekSummary({
  completed,
  skipped,
  total,
  completedMinutes,
}: WeekSummaryProps) {
  const completionRate =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <SummaryCard
        label="Completed"
        value={`${completed}/${total}`}
        note={`${completionRate}% of planned practices`}
      />

      <SummaryCard
        label="Time invested"
        value={formatMinutes(completedMinutes)}
        note="Deliberate practice completed"
      />

      <SummaryCard
        label="Skipped"
        value={String(skipped)}
        note="Information for next week"
      />
    </section>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  note: string;
};

function SummaryCard({
  label,
  value,
  note,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-extrabold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {note}
      </p>
    </div>
  );
}

type PromptProps = {
  eyebrow: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
};

function Prompt({
  eyebrow,
  label,
  description,
  value,
  onChange,
}: PromptProps) {
  return (
    <label className="block rounded-2xl border border-border bg-surface p-5">
      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </span>

      <span className="mt-2 block text-lg font-extrabold tracking-tight">
        {label}
      </span>

      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
        {description}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={4}
        placeholder="Type freely..."
        className="mt-4 w-full resize-none rounded-xl border border-border bg-background p-4 text-sm leading-6 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

type EnergySelectorProps = {
  value: number | null;
  onChange: (value: number) => void;
};

function EnergySelector({
  value,
  onChange,
}: EnergySelectorProps) {
  const options = [
    {
      value: 1,
      emoji: "😔",
      label: "Depleted",
    },
    {
      value: 2,
      emoji: "😐",
      label: "Low",
    },
    {
      value: 3,
      emoji: "🙂",
      label: "Steady",
    },
    {
      value: 4,
      emoji: "😊",
      label: "Strong",
    },
    {
      value: 5,
      emoji: "🔥",
      label: "Energized",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        Energy
      </p>

      <h2 className="mt-2 text-lg font-extrabold tracking-tight">
        How did this week feel?
      </h2>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-xl border p-3 text-center transition ${
                selected
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border bg-background hover:border-foreground/20"
              }`}
              aria-pressed={selected}
              aria-label={option.label}
            >
              <span className="block text-2xl">
                {option.emoji}
              </span>

              <span className="mt-2 hidden text-[9px] font-semibold text-muted-foreground sm:block">
                {option.label}
              </span>

              {selected && (
                <CheckCircle2 className="mx-auto mt-2 size-3.5 text-accent" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function calculateWeekSummary(
  sessions: PracticeSession[],
) {
  const completedSessions = sessions.filter(
    (session) =>
      session.status === "completed" ||
      session.completed,
  );

  const skipped = sessions.filter(
    (session) => session.status === "skipped",
  ).length;

  const total = sessions.filter(
    (session) => session.status !== "skipped",
  ).length;

  const completedMinutes = completedSessions.reduce(
    (sum, session) =>
      sum + (session.duration_minutes ?? 0),
    0,
  );

  return {
    completed: completedSessions.length,
    skipped,
    total,
    completedMinutes,
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}