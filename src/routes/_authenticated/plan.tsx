import { Suspense, useState } from "react";
import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";
import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Check,
  CirclePlay,
  Plus,
  RotateCcw,
  SkipForward,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/forge/app-shell";
import {
  iso,
  lifeAreasQuery,
  sessionsInRangeQuery,
  skillsQuery,
  todayIso,
  weekBounds,
} from "@/features/forge/queries";
import {
  DAYS,
  DAY_LABELS,
  type LifeArea,
  type PracticeSession,
  type Skill,
} from "@/features/forge/types";
import {
  assessWeeklyPlan,
  type PlanAssessmentItem,
  type WeeklyPlanAssessment,
} from "@/features/forge-engine";
import {
  createFocusItem,
  deleteFocusItem,
  focusItemsQuery,
  toggleFocusComplete,
  type FocusItem,
} from "@/features/focus";
import { generateCurrentWeek } from "@/features/focus/services/planningService";
import {
  completeSession,
  removeSession,
  restoreSession,
  skipSession,
  startSession,
} from "@/features/focus/services/sessionService";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute(
  "/_authenticated/plan",
)({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(
        skillsQuery(),
      ),
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        focusItemsQuery(),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
    ]);
  },
  component: PlanPage,
});

function PlanPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-10 md:pt-12">
      <Suspense fallback={<PlanLoadingState />}>
        <PlanContent />
      </Suspense>
    </main>
  );
}

function PlanLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      <div className="h-52 animate-pulse rounded-2xl bg-muted" />

      <div className="h-64 animate-pulse rounded-2xl bg-muted" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {Array.from(
          { length: 7 },
          (_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-xl border border-border bg-surface/50"
            />
          ),
        )}
      </div>
    </div>
  );
}

function PlanContent() {
  const queryClient = useQueryClient();
  const { start, end, monday } = weekBounds();

  const { data: skills } = useSuspenseQuery(
    skillsQuery(),
  );

  const { data: areas } = useSuspenseQuery(
    lifeAreasQuery(),
  );

  const { data: sessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const { data: allFocusItems } =
    useSuspenseQuery(focusItemsQuery());

  const focusItems = allFocusItems.filter(
    (item) =>
      item.scheduled_date !== null &&
      item.scheduled_date >= start &&
      item.scheduled_date <= end,
  );

  const [generating, setGenerating] =
    useState(false);

  const assessment = assessWeeklyPlan({
    sessions,
    skills,
    lifeAreas: areas,
  });

  const dayList = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(monday);
      date.setDate(
        monday.getDate() + index,
      );

      return {
        date,
        iso: iso(date),
        key: DAYS[index],
      };
    },
  );

  async function generateWeek() {
    if (skills.length === 0) {
      toast.error(
        "Add at least one skill before generating a week.",
      );
      return;
    }

    try {
      setGenerating(true);

      const result =
        await generateCurrentWeek();

      if (result.created === 0) {
        toast.info(
          "This week is already fully planned.",
        );
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      toast.success(
        `Forged ${result.created} ${
          result.created === 1
            ? "practice session"
            : "practice sessions"
        }.`,
      );
    } catch (error) {
      console.error(
        "Generate week error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "The week could not be generated.",
        ),
      );
    } finally {
      setGenerating(false);
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
        )}`}
        title={
          <>
            The{" "}
            <span className="text-accent">
              week ahead
            </span>
            .
          </>
        }
        action={
          <button
            type="button"
            onClick={generateWeek}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="size-3.5" />

            {generating
              ? "Forging..."
              : "Generate week"}
          </button>
        }
      />

      <WeekAssessment
        assessment={assessment}
      />

      <WeeklyFocus
        items={focusItems}
        weekStart={start}
      />

      {skills.length === 0 ? (
        <EmptyPlanState />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {dayList.map((day) => {
            const daySessions =
              sessions.filter(
                (session) =>
                  session.scheduled_date ===
                  day.iso,
              );

            const isToday =
              day.iso === todayIso();

            return (
              <section
                key={day.iso}
                className={`rounded-xl border p-3 ${
                  isToday
                    ? "border-foreground bg-surface"
                    : "border-border bg-surface/50"
                }`}
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest ${
                      isToday
                        ? "font-bold text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {DAY_LABELS[day.key]}
                  </span>

                  <span className="text-lg font-extrabold tracking-tight">
                    {day.date.getDate()}
                  </span>
                </div>

                <div className="min-h-[80px] space-y-2">
                  {daySessions.map(
                    (session) => {
                      const skill =
                        skills.find(
                          (item) =>
                            item.id ===
                            session.skill_id,
                        );

                      const area = skill
                        ? areas.find(
                            (item) =>
                              item.id ===
                              skill.life_area_id,
                          )
                        : undefined;

                      return (
                        <PlanSlot
                          key={session.id}
                          session={session}
                          area={area}
                        />
                      );
                    },
                  )}

                  <AddSlot
                    date={day.iso}
                    skills={skills}
                    existingSessions={
                      daySessions
                    }
                  />
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

type WeeklyFocusProps = {
  items: FocusItem[];
  weekStart: string;
};

function WeeklyFocus({
  items,
  weekStart,
}: WeeklyFocusProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] =
    useState("");

  const [adding, setAdding] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const completedCount = items.filter(
    (item) => item.completed,
  ).length;

  async function refreshFocus() {
    await queryClient.invalidateQueries({
      queryKey: ["focus-items"],
    });
  }

  async function addItem(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    try {
      setAdding(true);

      const { data, error } =
        await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "User not authenticated.",
        );
      }

      await createFocusItem({
        user_id: data.user.id,
        title: trimmedTitle,
        notes: null,
        scheduled_date: weekStart,
        completed: false,
        completed_at: null,
        priority: 2,
        sort_order: items.length,
        chronicle: false,
        category: null,
      });

      setTitle("");

      await refreshFocus();

      toast.success(
        "Focus item added.",
      );
    } catch (error) {
      console.error(
        "Focus add error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Focus item could not be added.",
        ),
      );
    } finally {
      setAdding(false);
    }
  }

  async function toggleItem(
    item: FocusItem,
  ) {
    try {
      setUpdatingId(item.id);

      await toggleFocusComplete(item);
      await refreshFocus();
    } catch (error) {
      console.error(
        "Focus update error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Focus item could not be updated.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeItem(
    item: FocusItem,
  ) {
    try {
      setUpdatingId(item.id);

      await deleteFocusItem(item.id);
      await refreshFocus();

      toast.success(
        "Focus item removed.",
      );
    } catch (error) {
      console.error(
        "Focus removal error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Focus item could not be removed.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Focus
          </p>

          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
            What must happen this week?
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Responsibilities and commitments
            outside your deliberate practice.
          </p>
        </div>

        {items.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground">
            {completedCount} of{" "}
            {items.length} complete
          </p>
        )}
      </div>

      <form
        onSubmit={addItem}
        className="mt-5 flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Add something that needs to happen..."
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
        />

        <button
          type="submit"
          disabled={
            adding || !title.trim()
          }
          className="h-11 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {adding
            ? "Adding..."
            : "Add"}
        </button>
      </form>

      {items.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border px-5 py-8 text-center">
          <p className="text-sm font-semibold">
            Nothing has been added yet.
          </p>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Use Focus as a simple weekly
            checklist, with or without a
            guided practice plan.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-border">
          {items.map((item) => {
            const updating =
              updatingId === item.id;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    toggleItem(item)
                  }
                  aria-label={
                    item.completed
                      ? `Mark ${item.title} incomplete`
                      : `Complete ${item.title}`
                  }
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition disabled:opacity-50 ${
                    item.completed
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:border-foreground/40"
                  }`}
                >
                  {item.completed
                    ? "✓"
                    : ""}
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    toggleItem(item)
                  }
                  className={`min-w-0 flex-1 text-left text-sm font-semibold transition disabled:opacity-50 ${
                    item.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </button>

                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    removeItem(item)
                  }
                  className="shrink-0 px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:text-destructive disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

type WeekAssessmentProps = {
  assessment: WeeklyPlanAssessment;
};

function WeekAssessment({
  assessment,
}: WeekAssessmentProps) {
  return (
    <section className="mb-6 rounded-2xl border border-border bg-surface p-6">
      <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
        <div className="rounded-xl bg-foreground p-5 text-background">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-background/55">
            Plan quality
          </p>

          <p className="mt-3 text-5xl font-extrabold tracking-tight">
            {assessment.score}
          </p>

          <p className="mt-2 text-sm font-semibold">
            {getAssessmentLabel(
              assessment.label,
            )}
          </p>

          <p className="mt-2 text-xs leading-5 text-background/60">
            {assessment.totalSessions}{" "}
            {assessment.totalSessions === 1
              ? "session"
              : "sessions"}{" "}
            ·{" "}
            {formatAssessmentMinutes(
              assessment.totalMinutes,
            )}
          </p>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Week assessment
          </p>

          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
            {getAssessmentHeadline(
              assessment.label,
            )}
          </h2>

          {assessment.items.length > 0 && (
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {assessment.items.map(
                (item) => (
                  <AssessmentItem
                    key={item.id}
                    item={item}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AssessmentItem({
  item,
}: {
  item: PlanAssessmentItem;
}) {
  const toneStyles = {
    positive: {
      marker: "bg-emerald-500",
      label: "Strong",
    },
    attention: {
      marker: "bg-amber-500",
      label: "Review",
    },
    neutral: {
      marker:
        "bg-muted-foreground",
      label: "Note",
    },
  } as const;

  const style =
    toneStyles[item.tone];

  return (
    <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
      <span
        className={`mt-1.5 size-2.5 shrink-0 rounded-full ${style.marker}`}
      />

      <div>
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">
          {style.label}
        </p>

        <h3 className="mt-1 text-sm font-bold tracking-tight">
          {item.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function EmptyPlanState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Your growth system begins here
      </p>

      <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
        Add a skill to generate your first
        week.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Define what you want to practice,
        how often you want to practice it,
        and your preferred days. Forge will
        build and assess the weekly plan.
      </p>

      <Link
        to="/skills"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
      >
        <Plus className="size-4" />
        Add your first skill
      </Link>
    </div>
  );
}

type PlanSlotProps = {
  session: PracticeSession;
  area?: LifeArea;
};

function PlanSlot({
  session,
  area,
}: PlanSlotProps) {
  const queryClient = useQueryClient();

  const [updating, setUpdating] =
    useState(false);

  const status =
    session.status ??
    (session.completed
      ? "completed"
      : "scheduled");

  async function refreshSessions() {
    await queryClient.invalidateQueries({
      queryKey: ["sessions"],
    });
  }

  async function runAction(
    action: () => Promise<void>,
    successMessage?: string,
  ) {
    try {
      setUpdating(true);

      await action();
      await refreshSessions();

      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error) {
      console.error(
        "Practice update error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Practice could not be updated.",
        ),
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <article
      className={`group rounded-lg border p-2.5 transition-all ${
        status === "completed"
          ? "bg-muted opacity-60"
          : status === "skipped"
            ? "border-dashed bg-muted/40 opacity-60"
            : status === "in_progress"
              ? "bg-accent/5"
              : "bg-background"
      }`}
      style={{
        borderColor:
          status === "scheduled" &&
          area?.color
            ? `${area.color}33`
            : undefined,
      }}
    >
      {area && (
        <p
          className="truncate font-mono text-[9px] uppercase tracking-widest"
          style={{
            color: area.color,
          }}
        >
          {area.name}
        </p>
      )}

      <div className="mt-0.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-xs font-bold ${
              status === "completed"
                ? "line-through"
                : ""
            }`}
          >
            {session.title}
          </p>

          <p className="text-[10px] text-muted-foreground">
            {session.duration_minutes}m

            {status ===
              "in_progress" &&
              " · In progress"}

            {status === "skipped" &&
              " · Skipped"}
          </p>
        </div>

        {status === "completed" && (
          <Check className="size-3.5 shrink-0 text-accent" />
        )}
      </div>

      <div className="mt-2 flex items-center gap-1">
        {status === "scheduled" && (
          <>
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                runAction(
                  () =>
                    startSession(
                      session.id,
                    ),
                  `${session.title} started.`,
                )
              }
              className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-1 text-[9px] font-semibold transition hover:bg-muted disabled:cursor-wait disabled:opacity-50"
            >
              <CirclePlay className="size-3" />
              Start
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                runAction(
                  () =>
                    completeSession(
                      session.id,
                      {
                        durationMinutes:
                          session.duration_minutes,
                      },
                    ),
                  `${session.title} completed.`,
                )
              }
              className="inline-flex items-center gap-1 rounded-md bg-foreground px-1.5 py-1 text-[9px] font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-wait disabled:opacity-50"
            >
              <Check className="size-3" />
              Done
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                runAction(
                  () =>
                    skipSession(
                      session.id,
                    ),
                  `${session.title} skipped.`,
                )
              }
              className="ml-auto rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-wait disabled:opacity-50"
              aria-label={`Skip ${session.title}`}
              title="Skip"
            >
              <SkipForward className="size-3" />
            </button>
          </>
        )}

        {status ===
          "in_progress" && (
          <>
            <button
              type="button"
              disabled={updating}
              onClick={() =>
                runAction(
                  () =>
                    completeSession(
                      session.id,
                      {
                        durationMinutes:
                          session.duration_minutes,
                      },
                    ),
                  `${session.title} completed.`,
                )
              }
              className="inline-flex items-center gap-1 rounded-md bg-foreground px-1.5 py-1 text-[9px] font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-wait disabled:opacity-50"
            >
              <Check className="size-3" />
              Complete
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={() =>
                runAction(
                  () =>
                    restoreSession(
                      session.id,
                    ),
                  `${session.title} reset.`,
                )
              }
              className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-wait disabled:opacity-50"
              aria-label={`Reset ${session.title}`}
              title="Reset"
            >
              <RotateCcw className="size-3" />
            </button>
          </>
        )}

        {(status === "completed" ||
          status === "skipped") && (
          <button
            type="button"
            disabled={updating}
            onClick={() =>
              runAction(
                () =>
                  restoreSession(
                    session.id,
                  ),
                `${session.title} restored.`,
              )
            }
            className="inline-flex items-center gap-1 rounded-md border border-border px-1.5 py-1 text-[9px] font-semibold transition hover:bg-muted disabled:cursor-wait disabled:opacity-50"
          >
            <RotateCcw className="size-3" />
            Restore
          </button>
        )}

        <button
          type="button"
          disabled={updating}
          onClick={() =>
            runAction(
              () =>
                removeSession(
                  session.id,
                ),
              "Practice removed.",
            )
          }
          className="ml-auto rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-wait disabled:opacity-50"
          aria-label={`Remove ${session.title}`}
          title="Remove"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </article>
  );
}

type AddSlotProps = {
  date: string;
  skills: Skill[];
  existingSessions: PracticeSession[];
};

function AddSlot({
  date,
  skills,
  existingSessions,
}: AddSlotProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] =
    useState(false);

  const [
    addingSkillId,
    setAddingSkillId,
  ] = useState<string | null>(null);

  const availableSkills = skills.filter(
    (skill) =>
      !existingSessions.some(
        (session) =>
          session.skill_id === skill.id,
      ),
  );

  async function add(skill: Skill) {
    try {
      setAddingSkillId(skill.id);

      const {
        data,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error(
          "User not authenticated.",
        );
      }

      const {
        error: insertError,
      } = await supabase
        .from("practice_sessions")
        .insert({
          user_id: data.user.id,
          skill_id: skill.id,
          scheduled_date: date,
          scheduled_time: null,
          duration_minutes:
            skill.session_minutes,
          title: skill.name,
          notes: skill.notes,
          status: "scheduled",
          completed: false,
          completed_at: null,
          reflection: null,
          intensity:
            skill.difficulty >= 4
              ? "high"
              : skill.difficulty <= 1
                ? "recovery"
                : "deliberate",
          sort_order:
            existingSessions.length,
        });

      if (insertError) {
        throw insertError;
      }

      await queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      setOpen(false);

      toast.success(
        `${skill.name} added.`,
      );
    } catch (error) {
      console.error(
        "Add practice error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Practice could not be added.",
        ),
      );
    } finally {
      setAddingSkillId(null);
    }
  }

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current,
          )
        }
        className="flex w-full items-center justify-center rounded-lg border border-dashed border-border py-1.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        aria-label="Add practice session"
        aria-expanded={open}
      >
        <Plus className="size-3.5" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-48 overflow-auto rounded-lg border border-border bg-surface p-1 shadow-xl">
          {availableSkills.length ===
          0 ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              Every skill is already
              scheduled today.
            </p>
          ) : (
            availableSkills.map(
              (skill) => (
                <button
                  type="button"
                  key={skill.id}
                  onClick={() =>
                    add(skill)
                  }
                  disabled={
                    addingSkillId !==
                    null
                  }
                  className="w-full truncate rounded px-2 py-1.5 text-left text-xs transition hover:bg-muted disabled:cursor-wait disabled:opacity-50"
                >
                  {addingSkillId ===
                  skill.id
                    ? "Adding..."
                    : skill.name}
                </button>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}

function getAssessmentLabel(
  label: WeeklyPlanAssessment["label"],
): string {
  switch (label) {
    case "balanced":
      return "Balanced week";

    case "demanding":
      return "Demanding week";

    case "light":
      return "Light week";

    case "unplanned":
      return "Not planned";
  }
}

function getAssessmentHeadline(
  label: WeeklyPlanAssessment["label"],
): string {
  switch (label) {
    case "balanced":
      return "The week looks sustainable and intentional.";

    case "demanding":
      return "The week may need more recovery or fewer commitments.";

    case "light":
      return "The week leaves room for recovery or additional focus.";

    case "unplanned":
      return "Generate the week to evaluate its balance.";
  }
}

function formatAssessmentMinutes(
  minutes: number,
): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = minutes / 60;

  return Number.isInteger(hours)
    ? `${hours}h`
    : `${hours.toFixed(1)}h`;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}