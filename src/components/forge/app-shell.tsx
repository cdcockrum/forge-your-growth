import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Compass, Flame, Calendar, Target, BookOpen, LineChart, LogOut, Sparkles, BookOpenText, History,} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode, } from "react";
import { ForgeCommandPalette, } from "@/components/forge";

const NAV = [
  { to: "/today", label: "Today", icon: Target, },
  { to: "/plan", label: "Practice", icon: Calendar, },
  { to: "/story", label: "Journey", icon: Compass, },
  { to: "/intelligence", label: "Intelligence", icon: Sparkles, },
  { to: "/vision", label: "Profile", icon: LayoutDashboard, },

  // Workspace 

  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, },
  { to: "/progress", label: "Progress", icon: LineChart, },
  { to: "/skills", label: "Skills", icon: Flame, },
  { to: "/journey", label: "Journey", icon: Compass, },
  { to: "/review", label: "Review", icon: BookOpen, },
  { to: "/timeline", label: "Timeline", icon: History, },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const primary = NAV.slice(0, 5);
  const workspace = NAV.slice(5);
  const [ commandOpen, setCommandOpen, ] = useState(false);

  useEffect(() => {
    function handleCommandShortcut(
      event: KeyboardEvent,
    ) {
      const commandKey =
        event.metaKey ||
        event.ctrlKey;

      if (
        commandKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setCommandOpen(
          (current) => !current,
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleCommandShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleCommandShortcut,
      );
    };
  }, []);

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
     <div className="flex min-h-screen bg-background text-foreground">
      <ForgeCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-surface sticky top-0 h-screen">
        <div className="border-b border-border px-5 py-6">
          <div className="flex items-center gap-4">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 shadow-lg">

              {/* Anvil */}

              <div className="absolute h-1.5 w-6 rounded-full bg-white/90" />

              <div className="absolute mt-2 h-3 w-2 rounded-sm bg-white/90" />

              {/* Spark */}

              <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,0.8)]" />

            </div>

            <div>

              <h1 className="text-lg font-black tracking-tight">
                Forge
              </h1>

              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Personal Intelligence
              </p>

            </div>

          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
    <div className="space-y-1">
      {primary.map((item) => {
        const active =
          pathname === item.to ||
          (item.to !== "/dashboard" &&
            pathname.startsWith(item.to));

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>

    <div className="my-6 border-t border-border" />

    <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
      Workspace
    </p>

    <div className="space-y-1">
      {workspace.map((item) => {
        const active =
          pathname === item.to ||
          pathname.startsWith(item.to);

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 pb-28 md:pb-8">{children}</main>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {primary.map((item) => {
            const active =
              pathname === item.to ||
              (item.to !== "/dashboard" &&
                pathname.startsWith(item.to));

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                    active
                      ? "bg-foreground text-background"
                      : "bg-transparent"
                  }`}
                >
                  <item.icon className="size-4.5" />
                </span>

                <span className="max-w-full truncate text-[9px] font-extrabold uppercase tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-4 mb-8 animate-reveal">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          {eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[0.95] text-balance">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
