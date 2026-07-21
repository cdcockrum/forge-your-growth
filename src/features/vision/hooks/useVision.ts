import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { visionQuery } from "../queries";
import { saveVision } from "../visionService";
import type { VisionInput } from "../types";

export function useVision() {
  const queryClient = useQueryClient();

  const { data: vision } =
    useSuspenseQuery(visionQuery());

  const saveMutation = useMutation({
    mutationFn: (input: VisionInput) =>
      saveVision(input),
    onSuccess: async (savedVision) => {
      queryClient.setQueryData(
        visionQuery().queryKey,
        savedVision,
      );

      await queryClient.invalidateQueries({
        queryKey: ["vision"],
      });
    },
  });

  return {
    vision,
    saveVision: saveMutation.mutateAsync,
    saving: saveMutation.isPending,
    saveError: saveMutation.error,
  };
}