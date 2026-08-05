import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  dismissAdvisorRecommendation,
  getActiveAdvisorRecommendation,
  getAdvisorRecommendationHistory,
  getLatestAdvisorRecommendation,
  startAdvisorRecommendation,
} from "./advisorLearningService";

import {
  evaluateDueAdvisorRecommendations,
  getPersistedAdvisorAdaptiveLearning,
} from "./advisorEvaluationService";

export const advisorLearningKeys = {
  all:
    [
      "advisor-learning",
    ] as const,

  recommendations: () =>
    [
      ...advisorLearningKeys.all,
      "recommendations",
    ] as const,

  history: () =>
    [
      ...advisorLearningKeys
        .recommendations(),
      "history",
    ] as const,

  active: (
    recommendationKey:
      string | null,
  ) =>
    [
      ...advisorLearningKeys
        .recommendations(),
      "active",
      recommendationKey,
    ] as const,

  latest: (
  recommendationKey:
    string | null,
) =>
  [
    ...advisorLearningKeys
      .recommendations(),
    "latest",
    recommendationKey,
  ] as const,

  adaptive: () =>
  [
    ...advisorLearningKeys.all,
    "adaptive",
  ] as const,
};

export function useAdvisorAdaptiveLearning() {
  return useQuery({
    queryKey:
      advisorLearningKeys
        .adaptive(),

    queryFn:
      getPersistedAdvisorAdaptiveLearning,
  });
}

export function useActiveAdvisorRecommendation(
  recommendationKey:
    string | null,
) {
  return useQuery({
    queryKey:
      advisorLearningKeys.active(
        recommendationKey,
      ),

    queryFn: () => {
      if (!recommendationKey) {
        return null;
      }

      return getActiveAdvisorRecommendation(
        recommendationKey,
      );
    },

    enabled:
      Boolean(
        recommendationKey,
      ),
  });
}

export function useLatestAdvisorRecommendation(
  recommendationKey:
    string | null,
) {
  return useQuery({
    queryKey:
      advisorLearningKeys.latest(
        recommendationKey,
      ),

    queryFn: () => {
      if (!recommendationKey) {
        return null;
      }

      return getLatestAdvisorRecommendation(
        recommendationKey,
      );
    },

    enabled:
      Boolean(
        recommendationKey,
      ),
  });
}

export function useAdvisorRecommendationHistory() {
  return useQuery({
    queryKey:
      advisorLearningKeys.history(),

    queryFn:
      getAdvisorRecommendationHistory,
  });
}

export function useStartAdvisorRecommendation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      startAdvisorRecommendation,

    onSuccess: async (
      recommendation,
    ) => {
      queryClient.setQueryData(
        advisorLearningKeys.active(
          recommendation
            .recommendation_key,
        ),
        recommendation,
      );

      await queryClient.invalidateQueries({
        queryKey:
          advisorLearningKeys
            .recommendations(),
      });
    },
  });
}

export function useDismissAdvisorRecommendation() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      dismissAdvisorRecommendation,

    onSuccess: async (
      recommendation,
    ) => {
      queryClient.setQueryData(
        advisorLearningKeys.active(
          recommendation
            .recommendation_key,
        ),
        null,
      );

    queryClient.setQueryData(
    advisorLearningKeys.latest(
        recommendation
        .recommendation_key,
    ),
    recommendation,
    );

      await queryClient.invalidateQueries({
        queryKey:
          advisorLearningKeys
            .recommendations(),
      });
    },
  });
}

export function useEvaluateDueAdvisorRecommendations() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      evaluateDueAdvisorRecommendations,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          advisorLearningKeys.all,
      });
    },
  });
}