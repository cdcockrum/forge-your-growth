import {
  useNavigate,
} from "@tanstack/react-router";

import {
  ForgeSection,
  ForgeSidebarLayout,
} from "@/components/forge";

import {
  ExpandableCard,
  SectionHeader,
  Stagger,
} from "@/components/forge/forge-ui";

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
          <Stagger
            className="space-y-12"
            step={90}
          >
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
                      description="Nothing remains scheduled for today. Choose one small practice you can complete reliably."
                      actionLabel="Choose a Practice"
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
          </Stagger>
        }
        sidebar={
          <Stagger
            className="space-y-6"
            delay={180}
            step={80}
          >
            <div data-tour="today-state-header">
              <SectionHeader
                eyebrow="Intelligence"
                title="Your current state"
                description="A quick view of your momentum, progress, and deeper signals."
              />
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

            <ExpandableCard
              eyebrow="More intelligence"
              title="Explore your deeper signals"
              description="Identity, Forge Score, and recent achievements"
            >
              <div className="space-y-6">
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
            </ExpandableCard>
          </Stagger>
        }
      />
    </div>
  );
}