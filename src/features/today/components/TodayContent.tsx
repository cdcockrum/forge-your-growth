import {
  ForgeSidebarLayout,
} from "@/components/forge";

import {
  CoachCard,
  ForgeScorePanel,
  IdentityCard,
  MomentumPanel,
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
  MissionCard,
} from "./MissionCard";

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
  const {
    todaySessions,
    focusItems,
    model,
  } = useTodayDashboard();

  return (
    <>
      <MorningHero
        firstName={model.hero.firstName}
        advisor={model.hero.advisor}
        insight={model.hero.insight}
      />

      <QuoteCard />

      <CoachCard
        coach={model.coach.coach}
      />

      <ForgeSidebarLayout
        main={
          <div className="space-y-6">
            <MissionCard
              sessions={todaySessions}
            />

            {focusItems.length > 0 && (
              <TodayFocusList
                items={focusItems}
              />
            )}

            <ReflectionPrompt />

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
        }
        sidebar={
          <>
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
                model.progress
                  .todayCompleted
              }
              todayTotal={
                model.progress.todayTotal
              }
              todayPercentage={
                model.progress
                  .todayPercentage
              }
              weekCompleted={
                model.progress
                  .weekCompleted
              }
              weekTotal={
                model.progress.weekTotal
              }
            />

            <IdentityCard
              identity={
                model.identity.identity
              }
            />

            <RecentAchievementCard
              achievement={
                model.achievement
                  .achievement
              }
            />
          </>
        }
      />
    </>
  );
}