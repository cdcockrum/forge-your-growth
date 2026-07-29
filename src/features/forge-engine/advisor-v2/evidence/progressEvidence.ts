// src/features/forge-engine/advisor-v2/evidence/progressEvidence.ts

import type {
  ProgressSummary,
} from "../../progress";

import type {
  AdvisorEvidence,
} from "../advisor.types";

function getCompletionPolarity(
  completionRate: number,
): AdvisorEvidence["polarity"] {
  if (completionRate >= 70) {
    return "positive";
  }

  if (completionRate < 40) {
    return "negative";
  }

  return "neutral";
}

function getStreakPolarity(
  currentStreak: number,
): AdvisorEvidence["polarity"] {
  if (currentStreak >= 3) {
    return "positive";
  }

  if (currentStreak === 0) {
    return "neutral";
  }

  return "positive";
}

export function buildProgressEvidence(
  progress: ProgressSummary,
): AdvisorEvidence[] {
  const evidence: AdvisorEvidence[] = [];

  /*
   * Avoid describing completion performance when no
   * sessions have been scheduled. A zero-percent rate
   * would otherwise be interpreted as negative evidence
   * even though no meaningful opportunity existed.
   */
  if (progress.scheduledSessions > 0) {
    evidence.push({
      id: "progress-completion-rate",
      category: "progress",
      source: "completionRate",
      statement:
        `Practice completion rate is ${Math.round(
          progress.completionRate,
        )}%.`,
      confidence: 0.95,
      impact: 0.9,
      polarity:
        getCompletionPolarity(
          progress.completionRate,
        ),
      tags: [
        "progress",
        "completion",
        "consistency",
        "practice",
      ],
    });
  }

  if (progress.completedSessions > 0) {
    evidence.push({
      id: "progress-completed-sessions",
      category: "progress",
      source: "completedSessions",
      statement:
        `${progress.completedSessions} ${
          progress.completedSessions === 1
            ? "practice session has"
            : "practice sessions have"
        } been completed.`,
      confidence: 1,
      impact: 0.7,
      polarity: "positive",
      tags: [
        "progress",
        "sessions",
        "practice",
        "activity",
      ],
    });
  }

  if (progress.totalMinutes > 0) {
    evidence.push({
      id: "progress-total-minutes",
      category: "progress",
      source: "totalMinutes",
      statement:
        `${progress.totalMinutes} total practice ${
          progress.totalMinutes === 1
            ? "minute has"
            : "minutes have"
        } been completed.`,
      confidence: 1,
      impact: 0.65,
      polarity: "positive",
      tags: [
        "progress",
        "duration",
        "practice",
        "effort",
      ],
    });
  }

  evidence.push({
    id: "progress-current-streak",
    category: "progress",
    source: "currentStreak",
    statement:
      progress.currentStreak > 0
        ? `The current practice streak is ${progress.currentStreak} ${
            progress.currentStreak === 1
              ? "day"
              : "days"
          }.`
        : "There is no active practice streak.",
    confidence: 1,
    impact:
      progress.currentStreak >= 3
        ? 0.8
        : 0.55,
    polarity:
      getStreakPolarity(
        progress.currentStreak,
      ),
    tags: [
      "progress",
      "streak",
      "consistency",
    ],
  });

  if (progress.strongestSkill) {
    evidence.push({
      id: `progress-strongest-skill-${progress.strongestSkill.skillId}`,
      category: "progress",
      source: "strongestSkill",
      statement:
        `${progress.strongestSkill.name} is currently the strongest practice area with a ${Math.round(
          progress.strongestSkill.completionRate,
        )}% completion rate.`,
      confidence: 0.9,
      impact: 0.75,
      polarity: "positive",
      tags: [
        "progress",
        "skill",
        "strength",
        "completion",
      ],
    });
  }

  if (progress.neglectedSkill) {
    evidence.push({
      id: `progress-neglected-skill-${progress.neglectedSkill.skillId}`,
      category: "progress",
      source: "neglectedSkill",
      statement:
        `${progress.neglectedSkill.name} currently shows the greatest need for renewed attention.`,
      confidence: 0.9,
      impact: 0.85,
      polarity: "negative",
      tags: [
        "progress",
        "skill",
        "neglect",
        "attention",
      ],
    });
  }

  return evidence;
}