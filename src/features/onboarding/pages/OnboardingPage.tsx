import {
  useState,
} from "react";

import {
  useNavigate,
} from "@tanstack/react-router";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Flame,
  Hammer,
  Sparkles,
} from "lucide-react";

import {
  ForgeButton,
} from "@/components/forge";

import {
  OnboardingProgress,
} from "../components";

import {
  completeOnboarding,
} from "../services";

type OnboardingStep = {
  eyebrow: string;
  title: string;
  description: string;
  supportingText: string;
  icon: typeof Sparkles;
};

const STEPS: OnboardingStep[] = [
  {
    eyebrow: "Welcome to Forge",
    title:
      "Understand who you are becoming.",
    description:
      "Forge transforms deliberate practice, reflection, and consistency into evidence about your growth.",
    supportingText:
      "This is not another task manager. It is a calm system for shaping your life through repeated action.",
    icon: Sparkles,
  },
  {
    eyebrow: "The Forge Loop",
    title:
      "Plan. Practice. Reflect. Understand.",
    description:
      "Forge begins with a vision, turns it into weekly practices, and learns from what actually happens.",
    supportingText:
      "You do not need to understand every screen today. Begin with one meaningful practice and let the system develop alongside you.",
    icon: Compass,
  },
  {
    eyebrow: "Identity through evidence",
    title:
      "Actions become evidence.",
    description:
      "Each deliberate practice supports an identity: Artist, Athlete, Scholar, Engineer, and others.",
    supportingText:
      "Forge does not ask you to declare who you are. It watches what you repeatedly do and shows you who you are becoming.",
    icon: BookOpen,
  },
  {
    eyebrow: "The First Strike",
    title:
      "Begin with one sustainable rhythm.",
    description:
      "Steel is not shaped by one blow. It is shaped by many intentional ones.",
    supportingText:
      "Start by describing the person you want to become. Forge will help turn that vision into a practical week.",
    icon: Hammer,
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] =
    useState(0);

  const step = STEPS[stepIndex];

  const Icon = step.icon;

  const isFirst =
    stepIndex === 0;

  const isLast =
    stepIndex ===
    STEPS.length - 1;

  function goBack() {
    setStepIndex((current) =>
      Math.max(0, current - 1),
    );
  }

  function goForward() {
    if (!isLast) {
      setStepIndex(
        (current) =>
          Math.min(
            STEPS.length - 1,
            current + 1,
          ),
      );

      return;
    }

    completeOnboarding();

    void navigate({
      to: "/vision",
      replace: true,
    });
  }

  function skipOnboarding() {
    completeOnboarding();

    void navigate({
      to: "/today",
      replace: true,
    });
  }

  return (
    <main className="flex min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Flame
                aria-hidden="true"
                className="size-5"
              />
            </div>

            <div>
              <p className="font-black tracking-tight">
                Forge
              </p>

              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                Personal Intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={skipOnboarding}
            className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            Skip introduction
          </button>
        </header>

        <div className="mt-8">
          <OnboardingProgress
            currentStep={
              stepIndex + 1
            }
            totalSteps={
              STEPS.length
            }
          />
        </div>

        <section className="flex flex-1 items-center py-12 sm:py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl border bg-card">
                <Icon
                  aria-hidden="true"
                  className="size-6"
                />
              </div>

              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {step.eyebrow}
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl">
                {step.title}
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {step.description}
              </p>
            </div>

            <aside className="rounded-3xl border bg-card p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Forge guidance
              </p>

              <p className="mt-5 text-lg font-semibold leading-relaxed">
                {step.supportingText}
              </p>

              {isLast ? (
                <div className="mt-8 rounded-2xl bg-foreground p-5 text-background">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-background/60">
                    Your next step
                  </p>

                  <p className="mt-3 font-semibold">
                    Describe who you want
                    to become.
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <footer className="flex items-center justify-between gap-4 border-t pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirst}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft className="size-4" />

            Back
          </button>

          <ForgeButton
            type="button"
            size="large"
            onClick={goForward}
            className="gap-2"
          >
            {isLast
              ? "Begin the first strike"
              : "Continue"}

            <ArrowRight className="size-4" />
          </ForgeButton>
        </footer>
      </div>
    </main>
  );
}