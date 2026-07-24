import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  BookOpen,
  RotateCcw,
  User,
} from "lucide-react";

import {
  ForgeButton,
  ForgeCard,
  ForgePage,
  ForgeSection,
} from "@/components/forge";

import {
  resetOnboarding,
} from "@/features/onboarding";

export const Route = createFileRoute(
  "/_authenticated/profile",
)({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();

  function replayIntroduction() {
    resetOnboarding();

    void navigate({
      to: "/onboarding",
    });
  }

  return (
    <ForgePage>
      <div className="space-y-8">
        <header>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
            <User
              aria-hidden="true"
              className="size-5"
            />
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Profile
          </p>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
            Your Forge settings.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Manage your introduction, personal settings, and other account-level preferences.
          </p>
        </header>

        <ForgeCard padding="large">
          <ForgeSection
            eyebrow="Learning"
            title="Forge Introduction"
          />

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                <BookOpen
                  aria-hidden="true"
                  className="size-4"
                />
              </div>

              <div>
                <h2 className="font-bold">
                  Replay the introduction
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                  Review the Forge philosophy, core loop, identity system, and First Strike guidance.
                </p>
              </div>
            </div>

            <ForgeButton
              type="button"
              variant="secondary"
              onClick={replayIntroduction}
              className="shrink-0 gap-2"
            >
              <RotateCcw
                aria-hidden="true"
                className="size-4"
              />

              Replay Introduction
            </ForgeButton>
          </div>
        </ForgeCard>

        <ForgeCard padding="large">
          <ForgeSection
            eyebrow="Coming later"
            title="More profile controls"
          />

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            This page can later include appearance, notifications, AI Coach preferences, export tools, and account management.
          </p>
        </ForgeCard>
      </div>
    </ForgePage>
  );
}