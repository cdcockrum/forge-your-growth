import type {
  MemorySignal,
} from "./memory.types";

import {
  createMemorySignal,
} from "./memorySignals";

export type SessionPatternRecord = {
  id: string;
  userId: string;
  skillId?: string;
  lifeAreaId?: string;

  title: string;

  status:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "skipped";

  scheduledDate: string;
  completedAt?: string | null;
};

export type SessionPatternResult = {
  signals: MemorySignal[];

  completedCount: number;
  skippedCount: number;
  currentStreak: number;
};

export class MemoryPatternDetector {
  static detectSessionPatterns({
    sessions,
    userId,
    skillId,
    lifeAreaId,
    skillName,
    now = new Date().toISOString(),
  }: {
    sessions: SessionPatternRecord[];
    userId: string;
    skillId?: string;
    lifeAreaId?: string;
    skillName: string;
    now?: string;
  }): SessionPatternResult {
    const relevantSessions = sessions
      .filter((session) => {
        if (!skillId) {
          return true;
        }

        return session.skillId === skillId;
      })
      .sort((left, right) =>
        left.scheduledDate.localeCompare(
          right.scheduledDate,
        ),
      );

    const completedSessions =
      relevantSessions.filter(
        (session) =>
          session.status === "completed",
      );

    const skippedSessions =
      relevantSessions.filter(
        (session) =>
          session.status === "skipped",
      );

    const currentStreak =
      calculateCurrentStreak(
        relevantSessions,
      );

    const signals: MemorySignal[] = [];

    if (
      shouldEmitRepeatedCompletion(
        completedSessions.length,
      )
    ) {
      signals.push(
        createMemorySignal({
          type: "repeated_completion",
          sourceType: "system",
          sourceId: buildPatternSourceId({
            prefix: "completion",
            skillId,
            count:
              completedSessions.length,
          }),
          userId,
          skillId,
          lifeAreaId,
          title: `${skillName} is becoming consistent`,
          description:
            `${skillName} has been completed ${completedSessions.length} times in the analyzed period.`,
          occurredAt: now,
          metadata: {
            occurrenceCount:
              completedSessions.length,

            sessionIds:
              completedSessions.map(
                (session) =>
                  session.id,
              ),

            skillName,
          },
        }),
      );
    }

    if (
      shouldEmitRepeatedSkip(
        skippedSessions.length,
      )
    ) {
      signals.push(
        createMemorySignal({
          type: "repeated_skip",
          sourceType: "system",
          sourceId: buildPatternSourceId({
            prefix: "skip",
            skillId,
            count:
              skippedSessions.length,
          }),
          userId,
          skillId,
          lifeAreaId,
          title: `${skillName} may be leaving the active rhythm`,
          description:
            `${skillName} has been skipped ${skippedSessions.length} times in the analyzed period.`,
          occurredAt: now,
          metadata: {
            occurrenceCount:
              skippedSessions.length,

            sessionIds:
              skippedSessions.map(
                (session) =>
                  session.id,
              ),

            skillName,
          },
        }),
      );
    }

    if (
      isStreakMilestone(
        currentStreak,
      )
    ) {
      signals.push(
        createMemorySignal({
          type: "streak_reached",
          sourceType: "system",
          sourceId: buildPatternSourceId({
            prefix: "streak",
            skillId,
            count: currentStreak,
          }),
          userId,
          skillId,
          lifeAreaId,
          title: `${currentStreak}-session ${skillName} streak`,
          description:
            `${skillName} has been completed in ${currentStreak} consecutive scheduled sessions.`,
          occurredAt: now,
          metadata: {
            streakLength:
              currentStreak,

            skillName,
          },
        }),
      );
    }

    return {
      signals,
      completedCount:
        completedSessions.length,
      skippedCount:
        skippedSessions.length,
      currentStreak,
    };
  }
}

function shouldEmitRepeatedCompletion(
  count: number,
): boolean {
  return [
    5,
    10,
    20,
    50,
    100,
  ].includes(count);
}

function shouldEmitRepeatedSkip(
  count: number,
): boolean {
  return [
    3,
    5,
    10,
  ].includes(count);
}

function isStreakMilestone(
  streak: number,
): boolean {
  return [
    3,
    7,
    14,
    30,
    60,
    100,
  ].includes(streak);
}

function calculateCurrentStreak(
  sessions: SessionPatternRecord[],
): number {
  let streak = 0;

  for (
    let index =
      sessions.length - 1;
    index >= 0;
    index -= 1
  ) {
    const session =
      sessions[index];

    if (
      session.status ===
      "completed"
    ) {
      streak += 1;
      continue;
    }

    /*
     * Scheduled and in-progress sessions do not end
     * the streak because their outcome is unresolved.
     */
    if (
      session.status ===
        "scheduled" ||
      session.status ===
        "in_progress"
    ) {
      continue;
    }

    break;
  }

  return streak;
}

function buildPatternSourceId({
  prefix,
  skillId,
  count,
}: {
  prefix: string;
  skillId?: string;
  count: number;
}): string {
  return [
    prefix,
    skillId ?? "general",
    count,
  ].join(":");
}