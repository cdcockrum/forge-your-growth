import { Suspense, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Check, Plus, Sparkles } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { generateCurrentWeek } from "@/services/planningService";

export const Route = createFileRoute("/_authenticated/plan")({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(lifeAreasQuery()),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
    ]);
  },
  component: PlanPage,
});

function PlanPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 md:px-10 md:pt-12">
      <Suspense fallback={null}>
        <PlanContent />
      </Suspense>
    </div>
  );
}

function PlanContent() {
  const queryClient = useQueryClient();
  const { start, end, monday } = weekBounds();

  const { data: skills } = useSuspenseQuery(skillsQuery());
  const { data: areas } = useSuspenseQuery(lifeAreasQuery());
  const { data: sessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const [generating, setGenerating] = useState(false);

  const dayList = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      date,
      iso: iso(date),
      key: DAYS[index],
    };
  });

  async function generateWeek() {
    if (skills.length === 0) {
      toast.error("Add at least one skill before generating a week.");
      return;
    }

    try {
      setGenerating(true);

      const result = await generateCurrentWeek();

      if (result.created === 0) {
        toast.info("This week is already fully planned.");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      toast.success(
        `Forged ${result.created} ${
          result.created === 1 ? "practice session" : "practice sessions"
        }.`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The week could not be generated.";

      toast.error(message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={`Week of ${monday.toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        })}`}
        title={
          <>
            The <span className="text-accent">week ahead</span>.
          </>
        }
        action={
          <button
            type="button"
            onClick={generateWeek}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="size-3.5" />
            {generating ? "Forging..." : "Generate week"}
          </button>
        }
      />

      {skills.length === 0 ? (
        <EmptyPlanState />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
          {dayList.map((day) => {
            const daySessions = sessions.filter(
              (session) => session.scheduled_date === day.iso,
            );

            const isToday = day.iso === todayIso();

            return (
              <div
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
                  {daySessions.map((session) => {
                    const skill = skills.find(
                      (item) => item.id === session.skill_id,
                    );

                    const area = skill
                      ? areas.find(
                          (item) =>
                            item.id === skill.life_area_id,
                        )
                      : undefined;

                    return (
                      <PlanSlot
                        key={session.id}
                        session={session}
                        area={area}
                      />
                    );
                  })}

                  <AddSlot
                    date={day.iso}
                    skills={skills}
                    existingSessions={daySessions}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function EmptyPlanState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Your growth system begins here
      </p>

      <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
        Add a skill to generate your first week.
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Define what you want to practice, how often you want to
        practice it, and your preferred days. Forge will build the
        weekly plan.
      </p>

      <Link
        to="/skills"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90"
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

function PlanSlot({ session, area }: PlanSlotProps) {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  async function remove() {
    try {
      setUpdating(true);

      const { error } = await supabase
        .from("practice_sessions")
        .delete()
        .eq("id", session.id);

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      toast.success("Practice removed.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Practice could not be removed.";

      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  async function toggle() {
    try {
      setUpdating(true);

      const completed = !session.completed;

      const { error } = await supabase
        .from("practice_sessions")
        .update({
          completed,
          completed_at: completed
            ? new Date().toISOString()
            : null,
        })
        .eq("id", session.id);

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Practice could not be updated.";

      toast.error(message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div
      className={`group rounded-lg border p-2.5 text-left transition-all ${
        session.completed
          ? "bg-muted opacity-50"
          : "bg-background"
      }`}
      style={{
        borderColor: area?.color
          ? `${area.color}33`
          : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <button
          type="button"
          onClick={toggle}
          disabled={updating}
          className="min-w-0 flex-1 text-left disabled:cursor-wait"
        >
          {area && (
            <p
              className="truncate font-mono text-[9px] uppercase tracking-widest"
              style={{ color: area.color }}
            >
              {area.name}
            </p>
          )}

          <p
            className={`truncate text-xs font-bold ${
              session.completed ? "line-through" : ""
            }`}
          >
            {session.title}
          </p>

          <p className="text-[10px] text-muted-foreground">
            {session.duration_minutes}m
          </p>
        </button>

        {session.completed ? (
          <Check className="size-3 shrink-0 text-accent" />
        ) : (
          <button
            type="button"
            onClick={remove}
            disabled={updating}
            className="text-[10px] text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:cursor-wait"
            aria-label={`Remove ${session.title}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
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
  const [open, setOpen] = useState(false);
  const [addingSkillId, setAddingSkillId] = useState<string | null>(
    null,
  );

  const availableSkills = skills.filter(
    (skill) =>
      !existingSessions.some(
        (session) => session.skill_id === skill.id,
      ),
  );

  async function add(skill: Skill) {
    try {
      setAddingSkillId(skill.id);

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        throw new Error("User not authenticated.");
      }

      const { error } = await supabase
        .from("practice_sessions")
        .insert({
          user_id: data.user.id,
          skill_id: skill.id,
          scheduled_date: date,
          scheduled_time: null,
          duration_minutes: skill.session_minutes,
          title: skill.name,
          notes: skill.notes,
          completed: false,
          completed_at: null,
          reflection: null,
          intensity:
            skill.difficulty >= 4
              ? "high"
              : skill.difficulty <= 1
                ? "recovery"
                : "deliberate",
          sort_order: existingSessions.length,
        });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      setOpen(false);
      toast.success(`${skill.name} added.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Practice could not be added.";

      toast.error(message);
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
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-center rounded-lg border border-dashed border-border py-1.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        aria-label="Add practice session"
        aria-expanded={open}
      >
        <Plus className="size-3.5" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-48 overflow-auto rounded-lg border border-border bg-surface p-1 shadow-xl">
          {availableSkills.length === 0 ? (
            <p className="px-2 py-2 text-xs text-muted-foreground">
              Every skill is already scheduled today.
            </p>
          ) : (
            availableSkills.map((skill) => (
              <button
                type="button"
                key={skill.id}
                onClick={() => add(skill)}
                disabled={addingSkillId !== null}
                className="w-full truncate rounded px-2 py-1.5 text-left text-xs hover:bg-muted disabled:opacity-50"
              >
                {addingSkillId === skill.id
                  ? "Adding..."
                  : skill.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}