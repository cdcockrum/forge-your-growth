import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Compass, Flame, LineChart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-foreground rounded-sm flex items-center justify-center">
            <div className="size-2 bg-background rotate-45" />
          </div>
          <span className="text-sm font-extrabold tracking-tighter uppercase">Forge</span>
        </div>
        <Link
          to="/auth"
          className="text-xs font-semibold uppercase tracking-widest text-foreground hover:text-accent transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-reveal">
          Personal Growth Operating System
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.95] text-balance animate-reveal [animation-delay:100ms]">
          Become the person <br />
          you <span className="text-accent">want to become</span>.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed animate-reveal [animation-delay:200ms]">
          Forge is not a habit tracker. It's a calm, intentional operating system for personal
          growth — adaptive weekly planning, deliberate practice, and long-term progress across
          every area of your life.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3 animate-reveal [animation-delay:300ms]">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            Begin forging
            <ArrowRight className="size-4" />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Free to start · No credit card
          </span>
        </div>

        {/* Feature grid */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 animate-reveal [animation-delay:400ms]">
          <FeatureCard
            icon={<Compass className="size-5" />}
            label="Life Areas"
            title="Career, Health, Creativity, Languages…"
            body="Define who you want to become in every domain. Vision, priorities, and long-term direction."
          />
          <FeatureCard
            icon={<Flame className="size-5" />}
            label="Deliberate Practice"
            title="Skills that compound"
            body="Track deliberate practice sessions across skills. Frequency, difficulty, and depth."
          />
          <FeatureCard
            icon={<Sparkles className="size-5" />}
            label="AI Coach"
            title="Adaptive weekly planning"
            body="Your practice adapts to what you learned, what worked, and where you're heading."
          />
          <FeatureCard
            icon={<LineChart className="size-5" />}
            label="Progress"
            title="Long-term growth, visualized"
            body="Streaks, hours, completion, skill growth. A quiet record of who you're becoming."
          />
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Excellence is not an act, but a habit.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  label,
  title,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="p-6 bg-surface border border-border rounded-2xl ring-1 ring-black/[0.02]">
      <div className="flex items-center gap-2 text-accent mb-4">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <h3 className="text-lg font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
