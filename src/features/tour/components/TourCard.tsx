import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  X,
} from "lucide-react";

import type {
  TourStep,
} from "@/features/tour/tour.store";

type TourCardProps = {
  step: TourStep;
  stepIndex: number;
  stepCount: number;
  positionStyle?: React.CSSProperties;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
};

export function TourCard({
  step,
  stepIndex,
  stepCount,
  positionStyle,
  onBack,
  onNext,
  onSkip,
}: TourCardProps) {
  const firstStep =
    stepIndex === 0;

  const finalStep =
    stepIndex === stepCount - 1;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="forge-tour-title"
      aria-describedby="forge-tour-description"
      className="pointer-events-auto fixed z-[10002] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl"
      style={positionStyle}
    >
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 shadow-lg">
              <Flame className="size-4 text-white" />
            </div>

            <div>
              <p className="text-sm font-extrabold tracking-tight">
                Forge Guide
              </p>

              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">
                Step {stepIndex + 1} of {stepCount}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Close walkthrough"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="px-5 py-5">
        <h2
          id="forge-tour-title"
          className="text-xl font-extrabold tracking-tight"
        >
          {step.title}
        </h2>

        <p
          id="forge-tour-description"
          className="mt-3 text-sm leading-6 text-white/70"
        >
          {step.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-semibold text-white/50 transition hover:text-white"
        >
          Skip tour
        </button>

        <div className="flex items-center gap-2">
          {!firstStep ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 px-3 text-xs font-bold transition hover:bg-white/10"
            >
              <ArrowLeft className="size-3.5" />

              Back
            </button>
          ) : null}

          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-zinc-950 transition hover:bg-white/90"
          >
            {finalStep ? (
              <>
                Finish

                <Check className="size-3.5" />
              </>
            ) : (
              <>
                Next

                <ArrowRight className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 transition-all duration-300"
          style={{
            width: `${
              ((stepIndex + 1) /
                stepCount) *
              100
            }%`,
          }}
        />
      </div>
    </section>
  );
}