import {
  useNavigate,
} from "@tanstack/react-router";

import {
  ForgePage,
  ForgeSection,
  ForgeSidebarLayout,
} from "@/components/forge";

import {
  CoachCard,
  ForgeScorePanel,
  IdentityCard,
  MomentumPanel,
  NextActionCard,
  ProgressPanel,
  QuoteCard,
  RecentAchievementCard,
  TodayFocusList,
} from "@/features/today/components";

import {
  useTodayDashboard,
} from "@/features/today/hooks/useTodayDashboard";

import {
  ForgeMemoryCard,
} from "./ForgeMemoryCard";

import {
  MorningHero,
} from "./MorningHero";

import {
  ReflectionPrompt,
} from "./ReflectionPrompt";

import {
  WeeklyStoryTeaser,
} from "./WeeklyStoryTeaser";

export function TodayContent() {
  const navigate = useNavigate();

  const {
    todaySessions,
    focusItems,
    model,
  } = useTodayDashboard();

  const nextSession =
    todaySessions.find(
      (session) =>
        session.completed !== true &&
        session.status !== "completed" &&
        session.status !== "skipped",
    ) ?? null;

  function handleNextAction() {
    void navigate({
      to: "/plan",
    });
  }

  return (
    <ForgePage>
      <MorningHero
        firstName={
          model.hero.firstName
        }
        advisor={
          model.hero.advisor
        }
        insight={
          model.hero.insight
        }
      />

      <QuoteCard />

      <CoachCard
        coach={model.coach.coach}
      />

      <ForgeSidebarLayout
        main={
          <div className="space-y-12">
            <ForgeSection
              eyebrow="Today"
              title="Take the next meaningful step"
              description="Keep the plan small, deliberate, and achievable."
            >
              <div className="space-y-6">
                {nextSession ? (
                  <NextActionCard
                    title={
                      nextSession.title
                    }
                    duration={
                      nextSession.duration_minutes
                    }
                    description={
                      nextSession.notes?.trim() ||
                      "Complete one deliberate practice and add meaningful evidence to the person you are becoming."
                    }
                    actionLabel="Begin Practice"
                    onAction={
                      handleNextAction
                    }
                  />
                ) : (
                  <NextActionCard
                    title="Choose one meaningful practice"
                    description="Nothing remains scheduled for today. Review your plan and choose one small action you can complete reliably."
                    actionLabel="Plan Today"
                    onAction={
                      handleNextAction
                    }
                  />
                )}

                {focusItems.length > 0 ? (
                  <TodayFocusList
                    items={focusItems}
                  />
                ) : null}
              </div>
            </ForgeSection>

            <ForgeSection
              eyebrow="Understanding"
              title="What Forge is learning"
              description="Your recent actions are beginning to form a clearer story about your direction and identity."
            >
              <div className="space-y-6">
                <WeeklyStoryTeaser
                  narrative={
                    model.story.narrative
                  }
                />

                <ForgeMemoryCard
                  memories={
                    model.memory.memories
                  }
                />
              </div>
            </ForgeSection>

            <ForgeSection
              eyebrow="Reflection"
              title="Close the loop"
              description="Capture what mattered so Forge can learn from today’s experience."
            >
              <ReflectionPrompt />
            </ForgeSection>
          </div>
        }
        sidebar={
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Intelligence
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Your current state
              </h2>
            </div>

            <MomentumPanel
              score={
                model.momentum.score
              }
              direction={
                model.momentum.direction
              }
              consistency={
                model.momentum.consistency
              }
              recovery={
                model.momentum.recovery
              }
              adherence={
                model.momentum.adherence
              }
              burnoutRisk={
                model.momentum.burnoutRisk
              }
              message={
                model.momentum.message
              }
            />

            <IdentityCard
              identity={
                model.identity.identity
              }
            />

            <ForgeScorePanel
              score={
                model.forgeScore.score
              }
              breakdown={
                model.forgeScore.breakdown
              }
            />

            <ProgressPanel
              todayCompleted={
                model.progress.todayCompleted
              }
              todayTotal={
                model.progress.todayTotal
              }
              todayPercentage={
                model.progress.todayPercentage
              }
              weekCompleted={
                model.progress.weekCompleted
              }
              weekTotal={
                model.progress.weekTotal
              }
            />

            <RecentAchievementCard
              achievement={
                model.achievement.achievement
              }
            />
          </div>
        }
      />
    </ForgePage>
  );
}