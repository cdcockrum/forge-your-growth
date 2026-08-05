import type {
  Database,
} from "@/integrations/supabase/types";

import {
  supabase,
} from "@/integrations/supabase/client";

type AdvisorRecommendationRow =
  Database["public"]["Tables"]["advisor_recommendations"]["Row"];

type AdvisorRecommendationPriority =
  | "low"
  | "medium"
  | "high";

export type AdvisorRecommendationBeliefContext = {
  key: string;

  statement: string;

  confidence: number;
};

export type StartAdvisorRecommendationInput = {
  recommendationKey: string;

  title: string;

  explanation: string;

  confidence: number;

  priority:
    AdvisorRecommendationPriority;

  baselineSnapshotDate: string;

  evaluationWindowDays?: number;

  belief:
   AdvisorRecommendationBeliefContext | null;
};

export type DismissAdvisorRecommendationInput = {
  recommendationKey: string;

  title: string;

  explanation: string;

  confidence: number;

  priority:
    AdvisorRecommendationPriority;

  baselineSnapshotDate: string;
};

export async function getActiveAdvisorRecommendation(
  recommendationKey: string,
): Promise<
  AdvisorRecommendationRow | null
> {
  const userId =
    await requireUserId();

  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .eq(
      "recommendation_key",
      recommendationKey,
    )
    .in(
      "lifecycle_status",
      [
        "pending",
        "in-progress",
      ],
    )
    .order(
      "recommended_at",
      {
        ascending: false,
      },
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load the active Advisor recommendation: ${error.message}`,
    );
  }

  return data;
}

export async function getAdvisorRecommendationHistory(): Promise<
  AdvisorRecommendationRow[]
> {
  const userId =
    await requireUserId();

  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .order(
      "recommended_at",
      {
        ascending: false,
      },
    );

  if (error) {
    throw new Error(
      `Unable to load Advisor recommendation history: ${error.message}`,
    );
  }

  return data ?? [];
}

export async function startAdvisorRecommendation(
  input: StartAdvisorRecommendationInput,
): Promise<
  AdvisorRecommendationRow
> {
  const userId =
    await requireUserId();

  const existing =
    await getActiveAdvisorRecommendation(
      input.recommendationKey,
    );

  if (existing) {
    return existing;
  }

  const recommendedAt =
    new Date();

  const evaluationDueAt =
    addDays(
      recommendedAt,
      input.evaluationWindowDays ??
        7,
    );

  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .insert({
      user_id:
        userId,

      recommendation_key:
        input.recommendationKey,

      title:
        input.title.trim(),

      explanation:
        input.explanation.trim(),

      confidence:
        normalizeScore(
          input.confidence,
        ),

      priority:
        input.priority,

      response:
        "accepted",

      lifecycle_status:
        "in-progress",

      recommended_at:
        recommendedAt.toISOString(),

      accepted_at:
        recommendedAt.toISOString(),

      evaluation_due_at:
        evaluationDueAt.toISOString(),

      baseline_snapshot_date:
        input.baselineSnapshotDate,

      belief_key:
        input.belief?.key ??
        null,

      belief_statement:
        input.belief?.statement
          .trim() ??
        null,

      belief_confidence:
        input.belief
          ? normalizeScore(
              input.belief.confidence,
            )
          : null,

       })
    .select("*")
    .single();

  if (!error) {
    return data;
  }

  // A rapid second request may encounter the
  // partial unique index. Recover by returning
  // the already-created active record.
  if (error.code === "23505") {
    const active =
      await getActiveAdvisorRecommendation(
        input.recommendationKey,
      );

    if (active) {
      return active;
    }
  }

  throw new Error(
    `Unable to start the Advisor recommendation: ${error.message}`,
  );
}

export async function getLatestAdvisorRecommendation(
  recommendationKey: string,
): Promise<
  AdvisorRecommendationRow | null
> {
  const userId =
    await requireUserId();

  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .select("*")
    .eq(
      "user_id",
      userId,
    )
    .eq(
      "recommendation_key",
      recommendationKey,
    )
    .order(
      "recommended_at",
      {
        ascending: false,
      },
    )
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load the latest Advisor recommendation response: ${error.message}`,
    );
  }

  return data;
}

export async function dismissAdvisorRecommendation(
  input: DismissAdvisorRecommendationInput,
): Promise<
  AdvisorRecommendationRow
> {
  const userId =
    await requireUserId();

  const active =
    await getActiveAdvisorRecommendation(
      input.recommendationKey,
    );

  if (active) {
    const {
      data,
      error,
    } = await supabase
      .from(
        "advisor_recommendations",
      )
      .update({
        response:
          "rejected",

        lifecycle_status:
          "dismissed",

        evaluated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        active.id,
      )
      .eq(
        "user_id",
        userId,
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Unable to dismiss the Advisor recommendation: ${error.message}`,
      );
    }

    return data;
  }

  const now =
    new Date().toISOString();

  const {
    data,
    error,
  } = await supabase
    .from(
      "advisor_recommendations",
    )
    .insert({
      user_id:
        userId,

      recommendation_key:
        input.recommendationKey,

      title:
        input.title.trim(),

      explanation:
        input.explanation.trim(),

      confidence:
        normalizeScore(
          input.confidence,
        ),

      priority:
        input.priority,

      response:
        "rejected",

      lifecycle_status:
        "dismissed",

      recommended_at:
        now,

      evaluated_at:
        now,

      baseline_snapshot_date:
        input.baselineSnapshotDate,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Unable to dismiss the Advisor recommendation: ${error.message}`,
    );
  }

  return data;
}

async function requireUserId(): Promise<
  string
> {
  const {
    data,
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(
      `Unable to verify the current user: ${error.message}`,
    );
  }

  if (!data.user) {
    throw new Error(
      "You must be signed in to use Advisor learning.",
    );
  }

  return data.user.id;
}

function addDays(
  date: Date,
  days: number,
): Date {
  const result =
    new Date(
      date.getTime(),
    );

  result.setUTCDate(
    result.getUTCDate() +
      Math.max(
        1,
        Math.round(days),
      ),
  );

  return result;
}

function normalizeScore(
  value: number,
): number {
  const normalized =
    Math.abs(value) > 1
      ? value / 100
      : value;

  return Math.max(
    0,
    Math.min(
      normalized,
      1,
    ),
  );
}