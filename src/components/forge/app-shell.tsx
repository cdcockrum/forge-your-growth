import {
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";

import {
  BookOpen,
  Calendar,
  Compass,
  Flame,
  History,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Target,
  Telescope,
  BrainCircuit,
  X,
} from "lucide-react";

import {
  useQueryClient,
} from "@tanstack/react-query";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  ForgeCommandPalette,
} from "@/components/forge";

import {
  supabase,
} from "@/integrations/supabase/client";

const NAV = [
  {
    to: "/today",
    label: "Today",
    icon: Target,
  },
  {
    to: "/advisor",
    label: "Advisor",
    icon: Sparkles,
  },

  {
    label:
      "Reasoning",

    to:
      "/reasoning",

    icon:
      BrainCircuit,
  },

  {
    to: "/plan",
    label: "Practice",
    icon: Calendar,
  },
  {
    to: "/observatory",
    label: "Observatory",
    icon: Telescope,
  },
  {
    to: "/intelligence",
    label: "Insights",
    icon: Sparkles,
  },

  // Workspace

  {
    to: "/vision",
    label: "Profile",
    icon: LayoutDashboard,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/progress",
    label: "Progress",
    icon: LineChart,
  },
  {
    to: "/skills",
    label: "Skills",
    icon: Flame,
  },
  {
    to: "/journey",
    label: "Journey",
    icon: Compass,
  },
  {
    to: "/review",
    label: "Review",
    icon: BookOpen,
  },
  {
    to: "/timeline",
    label: "Timeline",
    icon: History,
  },
] as const;

const MOBILE_PRIMARY = [
  {
    to: "/today",
    label: "Today",
    icon: Target,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/plan",
    label: "Practice",
    icon: Calendar,
  },
  {
    to: "/advisor",
    label: "Advisor",
    icon: Sparkles,
  },
] as const;

const MOBILE_MORE = [
  {
    to: "/observatory",
    label: "Observatory",
    description:
      "Explore long-term trends and patterns.",
    icon: Telescope,
  },
  {
    to: "/intelligence",
    label: "Insights",
    description:
      "Review Forge’s current intelligence.",
    icon: Sparkles,
  },
  {
    to: "/vision",
    label: "Profile",
    description:
      "Revisit your vision and direction.",
    icon: LayoutDashboard,
  },
  {
    to: "/progress",
    label: "Progress",
    description:
      "See how your practice is developing.",
    icon: LineChart,
  },
  {
    to: "/skills",
    label: "Skills",
    description:
      "Manage the abilities you are developing.",
    icon: Flame,
  },
  {
    to: "/journey",
    label: "Journey",
    description:
      "Explore the story of your growth.",
    icon: Compass,
  },
  {
    to: "/review",
    label: "Review",
    description:
      "Reflect on your recent experience.",
    icon: BookOpen,
  },
  {
    to: "/timeline",
    label: "Timeline",
    description:
      "Review your history over time.",
    icon: History,
  },

  {
    label: "Reasoning",
    to: "/reasoning",
    description:
    "Inspect Forge’s evidence, memory, calibration, assumptions, and conclusions.",
    icon: BrainCircuit,
  }

] as const;

function isActivePath(
  pathname: string,
  route: string,
): boolean {
  return (
    pathname === route ||
    pathname.startsWith(
      `${route}/`,
    )
  );
}

export function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname =
    useRouterState({
      select: (state) =>
        state.location.pathname,
    });

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const desktopPrimary =
    NAV.slice(0, 5);

  const workspace =
    NAV.slice(5);

  const [
    commandOpen,
    setCommandOpen,
  ] = useState(false);

  const [
    moreOpen,
    setMoreOpen,
  ] = useState(false);

  const moreIsActive =
    MOBILE_MORE.some(
      (item) =>
        isActivePath(
          pathname,
          item.to,
        ),
    );

  useEffect(() => {
    function handleCommandShortcut(
      event: KeyboardEvent,
    ) {
      const commandKey =
        event.metaKey ||
        event.ctrlKey;

      if (
        commandKey &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        setCommandOpen(
          (current) =>
            !current,
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

  useEffect(() => {
    setMoreOpen(false);
  }, [
    pathname,
  ]);

  useEffect(() => {
    if (!moreOpen) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        setMoreOpen(false);
      }
    }

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    moreOpen,
  ]);

  async function handleSignOut() {
    await queryClient.cancelQueries();

    queryClient.clear();

    const {
      error,
    } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Unable to sign out:",
        error,
      );

      return;
    }

    await navigate({
      to: "/auth",
      replace: true,
    });
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <ForgeCommandPalette
        open={commandOpen}
        onOpenChange={
          setCommandOpen
        }
      />

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 flex-col border-r border-border bg-surface md:flex">
        {/* Brand */}
        <div className="border-b border-border px-5 py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 via-red-500 to-amber-600 shadow-lg">
              <div className="absolute h-1.5 w-6 rounded-full bg-white/90" />

              <div className="absolute mt-2 h-3 w-2 rounded-sm bg-white/90" />

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

        {/* Desktop navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {desktopPrimary.map(
              (item) => {
                const active =
                  isActivePath(
                    pathname,
                    item.to,
                  );

                return (
                  <Link
                    key={
                      item.to
                    }
                    to={item.to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-4" />

                    <span>
                      {item.label}
                    </span>
                  </Link>
                );
              },
            )}
          </div>

          <div className="my-6 border-t border-border" />

          <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Workspace
          </p>

          <div className="space-y-1">
            {workspace.map(
              (item) => {
                const active =
                  isActivePath(
                    pathname,
                    item.to,
                  );

                return (
                  <Link
                    key={
                      item.to
                    }
                    to={item.to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-4" />

                    <span>
                      {item.label}
                    </span>
                  </Link>
                );
              },
            )}
          </div>
        </nav>

        <button
          type="button"
          onClick={() =>
            setCommandOpen(true)
          }
          className="mx-3 mb-3 flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <span className="flex items-center gap-3">
            <Search className="size-4" />

            Search & Guides
          </span>

          <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            Ctrl K
          </span>
        </button>

        {/* Sign out */}
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={
              handleSignOut
            }
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />

            <span>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 pb-28 md:pb-8">
        {children}
      </main>

      {/* Mobile More sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMoreOpen(false)
            }
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-more-title"
            className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-4xl border-t border-border bg-surface px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-4 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-border" />

            <header className="flex items-start justify-between gap-4 px-1">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
                  Forge Workspace
                </p>

                <h2
                  id="mobile-more-title"
                  className="mt-2 text-2xl font-black tracking-tight"
                >
                  Explore more
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Review your growth,
                  intelligence, and
                  long-term direction.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() =>
                  setMoreOpen(false)
                }
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="mt-6 grid gap-2">
              {MOBILE_MORE.map(
                (item) => {
                  const active =
                    isActivePath(
                      pathname,
                      item.to,
                    );

                  return (
                    <Link
                      key={
                        item.to
                      }
                      to={item.to}
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                          active
                            ? "bg-background/15"
                            : "bg-muted"
                        }`}
                      >
                        <item.icon className="size-5" />
                      </span>

                      <span className="min-w-0">
                        <span className="block text-sm font-black">
                          {item.label}
                        </span>

                        <span
                          className={`mt-1 block text-xs leading-5 ${
                            active
                              ? "text-background/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {
                            item.description
                          }
                        </span>
                      </span>
                    </Link>
                  );
                },
              )}
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false);
                  setCommandOpen(true);
                }}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background p-4 text-left"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted">
                  <Search className="size-5" />
                </span>

                <span>
                  <span className="block text-sm font-black">
                    Search & Guides
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    Find pages and replay
                    onboarding guides.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={
                  handleSignOut
                }
                className="mt-2 flex w-full items-center gap-4 rounded-2xl p-4 text-left text-muted-foreground"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted">
                  <LogOut className="size-5" />
                </span>

                <span className="text-sm font-black">
                  Sign out
                </span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto flex max-w-md items-center justify-around">
          {MOBILE_PRIMARY.map(
            (item) => {
              const active =
                isActivePath(
                  pathname,
                  item.to,
                );

              return (
                <Link
                  key={
                    item.to
                  }
                  to={item.to}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ${
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

                  <span className="max-w-full truncate text-[8px] font-extrabold uppercase tracking-[-0.02em] sm:text-[9px]">
                    {item.label}
                  </span>
                </Link>
              );
            },
          )}

          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={
              moreOpen
            }
            onClick={() =>
              setMoreOpen(true)
            }
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ${
              moreOpen ||
              moreIsActive
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                moreOpen ||
                moreIsActive
                  ? "bg-foreground text-background"
                  : "bg-transparent"
              }`}
            >
              <Menu className="size-4.5" />
            </span>

            <span className="text-[8px] font-extrabold uppercase tracking-[-0.02em] sm:text-[9px]">
              More
            </span>
          </button>
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
    <header className="mb-8 flex items-end justify-between gap-4 animate-reveal">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </p>

        <h1 className="text-balance text-3xl font-extrabold leading-[0.95] tracking-tight md:text-4xl">
          {title}
        </h1>
      </div>

      {action}
    </header>
  );
}