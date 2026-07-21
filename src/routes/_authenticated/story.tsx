import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  ForgeCard,
  ForgePage,
  ForgeSection,
} from "@/components/forge";

import {
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  weekBounds,
} from "@/features/forge/queries";

import {
  buildForgeState,
} from "@/features/forge-engine";

import {
  visionQuery,
} from "@/features/vision";

import {
  achievementsQuery,
} from "@/features/forge/queries";

import {
  useSuspenseQuery,
} from "@tanstack/react-query";

export const Route = createFileRoute(
  "/_authenticated/story",
)({
  loader: async ({ context }) => {
    const { start, end } = weekBounds();

    await Promise.all([
      context.queryClient.ensureQueryData(
        profileQuery(),
      ),
      context.queryClient.ensureQueryData(
        skillsQuery(),
      ),
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
      context.queryClient.ensureQueryData(
        visionQuery(),
      ),
      context.queryClient.ensureQueryData(
        achievementsQuery(),
      ),
      
    ]);
  },
  component: StoryPage,
});

function StoryPage() {
  return (
    <ForgePage>
      <Suspense fallback={<StoryLoadingState />}>
        <StoryContent />
      </Suspense>
    </ForgePage>
  );
}

function StoryLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function StoryContent() {
  const { start, end } = weekBounds();

  const { data: profile } =
    useSuspenseQuery(profileQuery());

  const { data: skills } =
    useSuspenseQuery(skillsQuery());

  const { data: areas } =
    useSuspenseQuery(lifeAreasQuery());

  const { data: sessions } =
    useSuspenseQuery(
      sessionsInRangeQuery(start, end),
    );

  const { data: vision } =
    useSuspenseQuery(visionQuery());

  const { data: achievements } =
    useSuspenseQuery(achievementsQuery());

  

  const forge = buildForgeState({
    vision,
    sessions,
    skills,
    lifeAreas: areas,
    achievements: achievements.map(
      (achievement) => ({
        id: achievement.id,
        title: achievement.title,
        earned_at: achievement.earned_at,
      }),
    ),
    review: null,
  });

  const firstName =
    profile?.full_name?.split(" ")[0] ??
    "Friend";

     console.log(
      "Strongest Identity JSON:",
      JSON.stringify(forge.identity.strongestIdentity, null, 2),
    );

    console.log(
      "Fastest Identity JSON:",
      JSON.stringify(forge.identity.fastestDevelopingIdentity, null, 2),
    );

  const story = forge.narrative;

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          This week’s story
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
          {story.title}
        </h1>

        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {firstName}, {story.opening}
        </p>
      </header>

      {story.identityGrowth.length > 0 && (
        <StorySection
          eyebrow="Identity"
          title="Who you strengthened"
          items={story.identityGrowth}
        />
      )}

      {story.victories.length > 0 && (
        <StorySection
          eyebrow="Victories"
          title="What moved forward"
          items={story.victories}
        />
      )}

      {story.obstacles.length > 0 && (
        <StorySection
          eyebrow="Obstacles"
          title="What deserves attention"
          items={story.obstacles}
        />
      )}

      <ForgeCard padding="large">
        <ForgeSection
          eyebrow="Coach"
          title="What Forge noticed"
        />

        <p className="mt-5 text-lg leading-8">
          {story.coachReflection}
        </p>
      </ForgeCard>

      <ForgeCard
        padding="large"
        variant="strong"
      >
        <ForgeSection
          eyebrow="Next week"
          title="Your focus"
        />

        <p className="mt-5 text-2xl font-extrabold leading-snug tracking-tight">
          {story.nextWeekFocus}
        </p>
      </ForgeCard>

      <blockquote className="border-l-2 border-border pl-6 text-xl font-semibold leading-8 text-muted-foreground">
        “{story.closing}”
      </blockquote>
    </div>
  );
}

type StorySectionProps = {
  eyebrow: string;
  title: string;
  items: string[];
};

function StorySection({
  eyebrow,
  title,
  items,
}: StorySectionProps) {
  return (
    <ForgeCard padding="large">
      <ForgeSection
        eyebrow={eyebrow}
        title={title}
      />

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <p
            key={item}
            className="text-base leading-7 text-muted-foreground"
          >
            {item}
          </p>
        ))}
      </div>
    </ForgeCard>
  );
}