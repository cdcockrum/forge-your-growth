import {
  ArrowLeft,
  ArrowRight,
  Hammer,
  X,
} from "lucide-react";

import {
  ForgeButton,
} from "@/components/forge";

import type {
  TourPlacement,
} from "../types";

type TourBubbleProps = {
  title: string;
  description: string;
  current: number;
  total: number;
  placement?: TourPlacement;
  completion?: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
};

const PLACEMENT_CLASSES:
  Record<
    TourPlacement,
    string
  > = {
    "top-left":
      "sm:left-8 sm:top-8",
    "top-right":
      "sm:right-8 sm:top-8",
    "bottom-left":
      "sm:bottom-8 sm:left-8",
    "bottom-right":
      "sm:bottom-8 sm:right-8",
    center:
      "sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
  };

export function TourBubble({
  title,
  description,
  current,
  total,
  placement = "bottom-right",
  completion = false,
  onNext,
  onPrevious,
  onClose,
}: TourBubbleProps) {
  const isFirst =
    current === 0;

  const isLast =
    current === total - 1;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Forge guided tour"
      className={[
        "fixed inset-x-4 bottom-4 z-[10001] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl transition-all duration-500",
        "sm:inset-x-auto sm:bottom-auto sm:w-[420px]",
        PLACEMENT_CLASSES[
          placement
        ],
        completion
          ? "sm:w-[500px]"
          : "",
      ].join(" ")}
    >
      <div
        className={
          completion
            ? "p-7 text-center sm:p-10"
            : "p-6 sm:p-7"
        }
      >
        <div
          className={[
            "flex gap-5",
            completion
              ? "flex-col items-center"
              : "items-start justify-between",
          ].join(" ")}
        >
          <div>
            <div
              className={[
                "flex items-center gap-2",
                completion
                  ? "justify-center"
                  : "",
              ].join(" ")}
            >
              <Hammer
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />

              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Forge Guide
              </p>
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>

          {!completion ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Skip guided tour"
              title="Skip tour"
            >
              <X className="size-5" />
            </button>
          ) : null}
        </div>

        <p
          className={[
            "mt-5 text-sm leading-7 text-muted-foreground sm:text-base",
            completion
              ? "mx-auto max-w-md"
              : "",
          ].join(" ")}
        >
          {description}
        </p>

        <div className="mt-7">
          <div className="flex gap-1.5">
            {Array.from(
              {
                length: total,
              },
              (_, index) => (
                <span
                  key={index}
                  className={[
                    "h-1.5 flex-1 rounded-full transition-colors duration-300",
                    index <= current
                      ? "bg-foreground"
                      : "bg-muted",
                  ].join(" ")}
                />
              ),
            )}
          </div>

          <div
            className={[
              "mt-5 flex gap-3",
              completion
                ? "flex-col items-center"
                : "items-center justify-between",
            ].join(" ")}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {current + 1} of{" "}
              {total}
            </span>

            <div className="flex gap-2">
              {!completion ? (
                <ForgeButton
                  type="button"
                  variant="secondary"
                  onClick={
                    onPrevious
                  }
                  disabled={
                    isFirst
                  }
                  aria-label="Previous tour step"
                >
                  <ArrowLeft className="size-4" />
                </ForgeButton>
              ) : null}

              <ForgeButton
                type="button"
                onClick={onNext}
                className="gap-2"
                size={
                  completion
                    ? "large"
                    : undefined
                }
              >
                {isLast
                  ? "Begin Today"
                  : "Next"}

                <ArrowRight className="size-4" />
              </ForgeButton>
            </div>
          </div>

          {!completion ? (
            <button
              type="button"
              onClick={onClose}
              className="mt-5 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Skip tour
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}