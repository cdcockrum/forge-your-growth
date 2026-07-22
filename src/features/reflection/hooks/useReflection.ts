import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getReflectionByDate,
  getReflections,
  saveReflection,
} from "../reflectionService";

import type {
  CreateReflectionInput,
} from "../types";

export const reflectionKeys = {
  all: ["reflections"] as const,

  history: ({
    startDate,
    endDate,
  }: {
    startDate?: string;
    endDate?: string;
  } = {}) =>
    [
      ...reflectionKeys.all,
      "history",
      startDate ?? null,
      endDate ?? null,
    ] as const,

  byDate: (reflectionDate: string) =>
    [
      ...reflectionKeys.all,
      "date",
      reflectionDate,
    ] as const,
};

export function useReflections({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
} = {}) {
  return useQuery({
    queryKey:
      reflectionKeys.history({
        startDate,
        endDate,
      }),

    queryFn: () =>
      getReflections({
        startDate,
        endDate,
      }),
  });
}

export function useReflectionByDate(
  reflectionDate: string,
) {
  return useQuery({
    queryKey:
      reflectionKeys.byDate(
        reflectionDate,
      ),

    queryFn: () =>
      getReflectionByDate(
        reflectionDate,
      ),

    enabled:
      Boolean(reflectionDate),
  });
}

export function useSaveReflection() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      input: CreateReflectionInput,
    ) => saveReflection(input),

    onSuccess: (reflection) => {
      queryClient.setQueryData(
        reflectionKeys.byDate(
          reflection.reflection_date,
        ),
        reflection,
      );

      void queryClient.invalidateQueries({
        queryKey:
          reflectionKeys.all,
      });
    },
  });
}