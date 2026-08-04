import {
  useNavigate,
} from "@tanstack/react-router";

import {
  ChevronDown,
} from "lucide-react";

import {
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
  const navigate =
    useNavigate();

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
    <div className="space-y-8">
      <div data-tour="today-hero">
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
      </div>

      <div data-tour="today-quote">
        <QuoteCard />
      </div>

      <div data-tour="today-coach">
        <CoachCard
          coach={
            model.coach.coach
          }
        />
      </div>

      <ForgeSidebarLayout
        main={
          <div className="space-y-12">
            <section data-tour="today-next-action">
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

                  <div data-tour="today-focus">
                    {focusItems.length > 0 ? (
                      <TodayFocusList
                        items={
                          focusItems
                        }
                      />
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-5 py-6">
                        <p className="text-sm font-semibold">
                          Today’s Focus
                        </p>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Important commitments that are not deliberate practice will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ForgeSection>
            </section>

            <section data-tour="today-learning">
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
                      model.memory?.memories ??
                      []
                    }
                  />
                </div>
              </ForgeSection>
            </section>

            <section data-tour="today-reflection">
              <ForgeSection
                eyebrow="Reflection"
                title="Close the loop"
                description="Capture what mattered so Forge can learn from today’s experience."
              >
                <ReflectionPrompt />
              </ForgeSection>
            </section>
          </div>
        }
        sidebar={
          <div className="space-y-6">
            <div data-tour="today-state-header">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Intelligence
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Your current state 
              </h2>
            </div>

            <div data-tour="today-momentum">
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
            </div>

            <div data-tour="today-progress">
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
            </div>

            <details className="group rounded-3xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    More intelligence
                  </p>

                  <p className="mt-1 text-sm font-bold leading-5">
                    Identity, Forge Score, and achievements
                  </p>
                </div>

                <ChevronDown
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>

              <div className="space-y-6 border-t border-border p-5">
                <div data-tour="today-identity">
                  <IdentityCard
                    identity={
                      model.identity.identity
                    }
                  />
                </div>

                <div data-tour="today-forge-score">
                  <ForgeScorePanel
                    score={
                      model.forgeScore.score
                    }
                    breakdown={
                      model.forgeScore.breakdown
                    }
                  />
                </div>

                <div data-tour="today-achievement">
                  <RecentAchievementCard
                    achievement={
                      model.achievement.achievement
                    }
                  />
                </div>
              </div>
            </details>
          </div>
        }
      />
    </div>
  );
}