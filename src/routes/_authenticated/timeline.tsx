import { Suspense } from "react";
import {
  createFileRoute,
} from "@tanstack/react-router";
import {
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  ForgeCard,
  ForgePage,
} from "@/components/forge";

import {
  achievementsQuery,
  lifeAreasQuery,
  profileQuery,
  sessionsInRangeQuery,
  skillsQuery,
  weekBounds,
} from "@/features/forge/queries";

import {
  buildForgeState,
  type HistoryEvent,
} from "@/features/forge-engine";

import {
  visionQuery,
} from "@/features/vision";

export const Route = createFileRoute(
  "/_authenticated/timeline",
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
        achievementsQuery(),
      ),
      context.queryClient.ensureQueryData(
        visionQuery(),
      ),
    ]);
  },
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <ForgePage>
      <Suspense fallback={<TimelineLoadingState />}>
        <TimelineContent />
      </Suspense>
    </ForgePage>
  );
}

function TimelineLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function TimelineContent() {
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

  const { data: achievements } =
    useSuspenseQuery(achievementsQuery());

  const { data: vision } =
    useSuspenseQuery(visionQuery());

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

  const events = forge.history.events;

  const groupedEvents =
  groupEventsByMonth(events);

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Forge Timeline
        </p>

        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
          Your becoming, over time.
        </h1>

        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {firstName}, these are the moments Forge
          considers meaningful in your current story.
        </p>
      </header>

      {events.length === 0 ? (
        <ForgeCard
          variant="dashed"
          padding="large"
        >
          <h2 className="text-xl font-extrabold">
            Your timeline is still forming.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Complete practices, earn achievements,
            define your Vision, and review your weeks.
            Forge will collect the moments that matter.
          </p>
        </ForgeCard>
      ) : (
        <div className="space-y-10">
            {groupedEvents.map((group) => (
                <section key={group.key}>
                <div className="mb-4 flex items-center gap-4">
                    <h2 className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    {group.label}
                    </h2>

                    <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-4">
                    {group.events.map((event) => (
                    <TimelineEventCard
                        key={`${event.type}-${event.id}-${event.occurredAt}`}
                        event={event}
                    />
                    ))}
                </div>
    </section>
  ))}
</div>
      )}
    </div>
  );
}

function TimelineEventCard({
  event,
}: {
  event: HistoryEvent;
}) {
  return (
    <ForgeCard padding="large">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            {formatEventType(event.type)}
          </p>

          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
            {event.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {event.description}
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="text-xs text-muted-foreground">
            {formatDate(event.occurredAt)}
          </p>

          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Importance {event.importance}
          </p>
        </div>
      </div>
    </ForgeCard>
  );
}

function formatEventType(
  type: HistoryEvent["type"],
): string {
  return type.replaceAll("_", " ");
}

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(value));
}

type TimelineMonthGroup = {
  key: string;
  label: string;
  events: HistoryEvent[];
};

function groupEventsByMonth(
  events: HistoryEvent[],
): TimelineMonthGroup[] {
  const groups = new Map<
    string,
    TimelineMonthGroup
  >();

  for (const event of events) {
    const date = new Date(event.occurredAt);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;

    const label = new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    ).format(date);

    const existing = groups.get(key);

    if (existing) {
      existing.events.push(event);
    } else {
      groups.set(key, {
        key,
        label,
        events: [event],
      });
    }
  }

  return [...groups.values()].sort(
    (first, second) =>
      second.key.localeCompare(first.key),
  );
}