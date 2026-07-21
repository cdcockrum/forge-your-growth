import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Compass, Flame, Calendar, Target, BookOpen, LineChart, LogOut, Sparkles, BookOpenText, History,} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";


const NAV = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/today", label: "Today", icon: Target },
  { to: "/plan", label: "Plan", icon: Calendar },
  { to: "/vision", label: "Vision", icon: Sparkles },
  { to: "/areas", label: "Areas", icon: Compass },
  { to: "/skills", label: "Skills", icon: Flame },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/story", label: "Story", icon: BookOpenText },
  { to: "/review", label: "Review", icon: BookOpen },
  { to: "/timeline", label: "Timeline", icon: History, },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-surface sticky top-0 h-screen">
        <div className="px-5 py-6 flex items-center gap-3 border-b border-border">
          <div className="size-8 bg-foreground rounded-sm flex items-center justify-center">
            <div className="size-2 bg-background rotate-45" />
          </div>
          <span className="text-sm font-extrabold tracking-tighter uppercase">Forge</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
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
      <main className="flex-1 min-w-0 pb-24 md:pb-8">{children}</main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-border px-2 py-2 flex justify-around items-center z-40">
        {NAV.slice(0, 5).map((item) => {
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`size-5 ${active ? "text-accent" : ""}`} />
              <span className="text-[9px] font-extrabold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
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
