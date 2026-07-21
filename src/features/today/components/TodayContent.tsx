import { ForgeSidebarLayout } from "@/components/forge";
import { calculateWeekProgress } from "@/features/today/utils";
import { calculateTodayProgress } from "@/features/today";
import {
  CoachCard,
  ForgeScorePanel,
  IdentityCard,
  MomentumPanel,
  ProgressPanel,
  QuoteCard,
  RecentAchievementCard,
  TodayFocusList,
  TodayPracticeList,
} from "@/features/today/components";
import { useTodayDashboard } from "@/features/today/hooks/useTodayDashboard";
import { MorningGreeting } from "./MorningGreeting";
import { NorthStarCard } from "./NorthStarCard";
import { IdentityBanner } from "./IdentityBanner";
import { ReflectionPrompt } from "./ReflectionPrompt";
import { TodayInsightCard } from "./TodayInsightCard";
import { WeeklyStoryTeaser } from "./WeeklyStoryTeaser";

export function TodayContent() {
  const {
    profile,
    skills,
    areas,
    todaySessions,
    weekSessions,
    achievements,
    focusItems,
    forge,
  } = useTodayDashboard();

  const todayProgress =
    calculateTodayProgress(todaySessions);

  const weekProgress =
    calculateWeekProgress(weekSessions);

  const firstName =
  profile?.full_name?.split(" ")[0] ?? "Friend";

  return (
    <>
      <MorningGreeting firstName={firstName} />

      <NorthStarCard
        text={forge.vision?.north_star ?? ""}
      />

      <IdentityBanner
          identities={forge.vision?.identities ?? []}
      />

      <TodayInsightCard
        insight={forge.insight}
      />
      
      <QuoteCard />

      <CoachCard coach={forge.coach} />

      <ForgeSidebarLayout
        main={
          <div className="space-y-6">
            <TodayPracticeList
              sessions={todaySessions}
              skills={skills}
              areas={areas}
            />

            {focusItems.length > 0 && (
              <TodayFocusList
                items={focusItems}
              />
            )}

            <ReflectionPrompt />

            <WeeklyStoryTeaser
              narrative={forge.narrative}
            />
            
          </div>
        }

        sidebar={
          <>
            <MomentumPanel
              score={forge.momentum.score}
              direction={forge.momentum.direction}
              consistency={forge.momentum.consistency}
              recovery={forge.momentum.recovery}
              adherence={forge.momentum.adherence}
              burnoutRisk={forge.momentum.burnoutRisk}
              message={forge.momentum.message}
            />

            <ForgeScorePanel
              score={forge.forgeScore.score}
              breakdown={forge.forgeScore.breakdown}
            />

            <ProgressPanel
              todayCompleted={todayProgress.completed}
              todayTotal={todayProgress.total}
              todayPercentage={todayProgress.percentage}
              weekCompleted={weekProgress.completed}
              weekTotal={weekProgress.total}
            />

            <IdentityCard identity={forge.identity} />

            <RecentAchievementCard
              achievement={achievements[0] ?? null}
            />
          </>
        }
      />
    </>
  );
}