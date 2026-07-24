type OnboardingProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  return (
    <div
      aria-label={`Step ${currentStep} of ${totalSteps}`}
      className="flex items-center gap-2"
    >
      {Array.from(
        {
          length: totalSteps,
        },
        (_, index) => {
          const active =
            index + 1 <= currentStep;

          return (
            <span
              key={index}
              className={[
                "h-1.5 flex-1 rounded-full transition-colors",
                active
                  ? "bg-foreground"
                  : "bg-muted",
              ].join(" ")}
            />
          );
        },
      )}
    </div>
  );
}