import {
  Check,
  Flame,
  Hammer,
} from "lucide-react";

type SetupProgressProps = {
  currentStep: 1 | 2 | 3 | 4;
};

type SetupStep = {
  label: string;
  title: string;
  description: string;
};

const STEPS: SetupStep[] = [
  {
    label: "The First Strike",
    title: "Vision",
    description:
      "Who are you intentionally becoming?",
  },
  {
    label: "The Second Strike",
    title: "Life Areas",
    description:
      "Where will that transformation occur?",
  },
  {
    label: "The Third Strike",
    title: "Skills",
    description:
      "What abilities will shape that future self?",
  },
  {
    label: "The Fourth Strike",
    title: "First Week",
    description:
      "Turn intention into a sustainable rhythm.",
  },
];

export function SetupProgress({
  currentStep,
}: SetupProgressProps) {
  const activeStep =
    STEPS[currentStep - 1];

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="border-b border-border px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
              <Hammer
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                {activeStep.label}
              </p>

              <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                {activeStep.title}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                {activeStep.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Flame
              aria-hidden="true"
              className="size-4"
            />

            Strike {currentStep} of{" "}
            {STEPS.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-px bg-border">
        {STEPS.map(
          (step, index) => {
            const stepNumber =
              index + 1;

            const complete =
              stepNumber <
              currentStep;

            const active =
              stepNumber ===
              currentStep;

            return (
              <div
                key={step.label}
                className={[
                  "min-w-0 bg-background px-2 py-3 text-center sm:px-4",
                  active
                    ? "bg-foreground text-background"
                    : "",
                ].join(" ")}
                aria-current={
                  active
                    ? "step"
                    : undefined
                }
              >
                <div className="flex items-center justify-center">
                  <span
                    className={[
                      "flex size-6 items-center justify-center rounded-full text-[10px] font-bold",
                      active
                        ? "bg-background text-foreground"
                        : complete
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {complete ? (
                      <Check className="size-3.5" />
                    ) : (
                      stepNumber
                    )}
                  </span>
                </div>

                <p
                  className={[
                    "mt-2 truncate text-[10px] font-semibold sm:text-xs",
                    active
                      ? "text-background"
                      : complete
                        ? "text-foreground"
                        : "text-muted-foreground",
                  ].join(" ")}
                >
                  {step.title}
                </p>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}