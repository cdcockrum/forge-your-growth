import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  CirclePlay,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import { toast } from "sonner";

import {
  ForgeCard,
  ForgeEmptyState,
  ForgeSection,
} from "@/components/forge";

import type {
  LifeArea,
  PracticeSession,
  Skill,
} from "@/features/forge/types";

import {
  completeSession,
  restoreSession,
  skipSession,
  startSession,
} from "@/features/focus/services/sessionService";

type TodayPracticeListProps = {
  sessions: PracticeSession[];
  skills: Skill[];
  areas: LifeArea[];
};

export function TodayPracticeList({
  sessions,
  skills,
  areas,
}: TodayPracticeListProps) {
  const completed = countCompleted(sessions);
  const included = countIncluded(sessions);

  return (
    <section>
      <ForgeSection
        eyebrow="Today’s practices"
        title="What you are forging today."
        action={
          sessions.length > 0 ? (
            <p className="text-sm font-semibold text-muted-foreground">
              {completed}/{included} complete
            </p>
          ) : undefined
        }
      />

      {sessions.length === 0 ? (
        <ForgeEmptyState
          eyebrow="The anvil is clear"
          title="Nothing is scheduled for today."
          description="Use the weekly plan to add a practice today or enjoy the recovery time you intentionally created."
          className="mt-4 py-14"
        />
      ) : (
        <div className="mt-4 space-y-3">
          {sessions.map((session) => {
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
              <TodayPracticeCard
                key={session.id}
                session={session}
                skill={skill}
                area={area}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

type TodayPracticeCardProps = {
  session: PracticeSession;
  skill?: Skill;
  area?: LifeArea;
};

function TodayPracticeCard({
  session,
  skill,
  area,
}: TodayPracticeCardProps) {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

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
    successMessage: string,
  ) {
    try {
      setUpdating(true);

      await action();
      await refreshSessions();

      toast.success(successMessage);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Practice could not be updated.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <ForgeCard
      padding="medium"
      variant={getCardVariant(status)}
      className={
        status === "in_progress"
          ? "border-accent/40 bg-accent/5 shadow-sm"
          : ""
      }
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {area && (
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: area.color,
                }}
              />
            )}

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {area?.name ?? "Practice"}
            </p>
          </div>

          <h3
            className={[
              "mt-2 text-xl font-extrabold tracking-tight",
              status === "completed"
                ? "text-muted-foreground line-through"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {session.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>
              {session.duration_minutes} minutes
            </span>

            {skill && (
              <span>
                Difficulty {skill.difficulty}/5
              </span>
            )}

            {status === "in_progress" && (
              <span className="font-semibold text-accent">
                In progress
              </span>
            )}

            {status === "completed" && (
              <span className="font-semibold text-foreground">
                Completed
              </span>
            )}

            {status === "skipped" && (
              <span className="font-semibold">
                Skipped
              </span>
            )}
          </div>

          {session.notes && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {session.notes}
            </p>
          )}
        </div>

        <PracticeActions
          session={session}
          status={status}
          updating={updating}
          runAction={runAction}
        />
      </div>
    </ForgeCard>
  );
}

type PracticeStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "skipped";

type PracticeActionsProps = {
  session: PracticeSession;
  status: PracticeStatus;
  updating: boolean;
  runAction: (
    action: () => Promise<void>,
    successMessage: string,
  ) => Promise<void>;
};

function PracticeActions({
  session,
  status,
  updating,
  runAction,
}: PracticeActionsProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {status === "scheduled" && (
        <>
          <button
            type="button"
            disabled={updating}
            onClick={() =>
              runAction(
                () => startSession(session.id),
                `${session.title} started.`,
              )
            }
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold transition hover:bg-muted disabled:opacity-50"
          >
            <CirclePlay className="size-4" />
            Start
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={() =>
              runAction(
                () =>
                  completeSession(session.id, {
                    durationMinutes:
                      session.duration_minutes,
                  }),
                `${session.title} completed.`,
              )
            }
            className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-50"
          >
            <Check className="size-4" />
            Complete
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={() =>
              runAction(
                () => skipSession(session.id),
                `${session.title} skipped.`,
              )
            }
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label={`Skip ${session.title}`}
            title="Skip"
          >
            <SkipForward className="size-4" />
          </button>
        </>
      )}

      {status === "in_progress" && (
        <>
          <button
            type="button"
            disabled={updating}
            onClick={() =>
              runAction(
                () =>
                  completeSession(session.id, {
                    durationMinutes:
                      session.duration_minutes,
                  }),
                `${session.title} completed.`,
              )
            }
            className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-50"
          >
            <Check className="size-4" />
            Finish
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={() =>
              runAction(
                () => restoreSession(session.id),
                `${session.title} reset.`,
              )
            }
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label={`Reset ${session.title}`}
            title="Reset"
          >
            <RotateCcw className="size-4" />
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
              () => restoreSession(session.id),
              `${session.title} restored.`,
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold transition hover:bg-muted disabled:opacity-50"
        >
          <RotateCcw className="size-4" />
          Restore
        </button>
      )}
    </div>
  );
}

function getCardVariant(
  status: PracticeStatus,
): "default" | "muted" | "dashed" {
  if (status === "completed") {
    return "muted";
  }

  if (status === "skipped") {
    return "dashed";
  }

  return "default";
}

function countCompleted(
  sessions: PracticeSession[],
): number {
  return sessions.filter(
    (session) =>
      session.status === "completed" ||
      session.completed,
  ).length;
}

function countIncluded(
  sessions: PracticeSession[],
): number {
  return sessions.filter(
    (session) => session.status !== "skipped",
  ).length;
}