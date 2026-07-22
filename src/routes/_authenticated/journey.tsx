import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ForgeCallout,
  ForgePage,
  ForgeSection,
} from "@/components/forge";

export const Route = createFileRoute(
  "/_authenticated/journey",
)({
  component: JourneyPage,
});

function JourneyPage() {
  return (
    <ForgePage>
      <div className="space-y-10">
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Journey
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            See how you are changing.
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Read the story of your growth, review the evidence,
            and notice the patterns forming over time.
          </p>
        </header>

        <ForgeSection
          eyebrow="This week"
          title="Your current story"
        >
          <JourneyLink
            to="/story"
            title="Weekly Story"
            description="Read Forge’s narrative of what moved forward, what struggled, and what deserves attention next."
          />
        </ForgeSection>

        <ForgeSection
          eyebrow="Over time"
          title="Your growth record"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <JourneyLink
              to="/timeline"
              title="Timeline"
              description="Explore the meaningful events Forge has recorded across your journey."
            />

            <JourneyLink
              to="/progress"
              title="Progress"
              description="Review completion, practice time, streaks, skills, and life-area balance."
            />

            <JourneyLink
              to="/review"
              title="Weekly Review"
              description="Reflect on wins, challenges, lessons, energy, and next week’s focus."
            />

            <JourneyLink
              to="/vision"
              title="Vision"
              description="Reconnect with your mission, North Star, values, identities, and life themes."
            />
          </div>
        </ForgeSection>
      </div>
    </ForgePage>
  );
}

type JourneyLinkProps = {
  to:
    | "/story"
    | "/timeline"
    | "/progress"
    | "/review"
    | "/vision";
  title: string;
  description: string;
};

function JourneyLink({
  to,
  title,
  description,
}: JourneyLinkProps) {
  return (
    <Link
      to={to}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ForgeCallout title={title}>
        <p className="leading-6">
          {description}
        </p>

        <p className="mt-4 text-xs font-semibold text-foreground">
          Open →
        </p>
      </ForgeCallout>
    </Link>
  );
}