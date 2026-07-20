import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  deleteFocusItem,
  toggleFocusComplete,
  type FocusItem,
} from "@/features/focus";

import {
  ForgeCard,
  ForgeEmptyState,
  ForgeSection,
} from "@/components/forge";

type TodayFocusListProps = {
  items: FocusItem[];
};

export function TodayFocusList({
  items,
}: TodayFocusListProps) {
  const queryClient = useQueryClient();

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  async function refreshFocus() {
    await queryClient.invalidateQueries({
      queryKey: ["focus-items"],
    });
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

  const completedCount = items.filter(
    (item) => item.completed,
  ).length;

  return (
    <ForgeCard>
      <div className="flex items-end justify-between gap-4">
        <ForgeSection
          eyebrow="Focus"
          title="What needs your attention today?"
          action={
            items.length > 0 ? (
              <p className="text-xs font-semibold text-muted-foreground">
                {completedCount} of {items.length} complete
              </p>
            ) : undefined
          }
        />

        {items.length > 0 && (
          <p className="text-xs font-semibold text-muted-foreground">
            {completedCount} of {items.length} complete
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <ForgeEmptyState
          title="Nothing scheduled for today."
          description="Weekly Focus items assigned to today will appear here."
          className="mt-5 py-8"
        />
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
                  {item.completed ? "✓" : ""}
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
    </ForgeCard>
  );
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
    typeof (
      error as {
        message?: unknown;
      }
    ).message === "string"
  ) {
    return (
      error as {
        message: string;
      }
    ).message;
  }

  return fallback;
}