import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  Calendar,
  CircleHelp,
  Compass,
  Flame,
  History,
  LayoutDashboard,
  LineChart,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  useNavigate,
} from "@tanstack/react-router";

import {
  toast,
} from "sonner";

import {
  resetAllTours,
  resetTour,
  startTour,
  type TourId,
} from "@/features/tour";

type NavigationCommand = {
  type: "navigation";
  id: string;
  to: string;
  label: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
};

type GuideCommand = {
  type: "guide";
  id: string;
  tourId: TourId;
  to: string;
  label: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
};

type ActionCommand = {
  type: "action";
  id: string;
  action: "reset-guides";
  label: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
};

type CommandItem =
  | NavigationCommand
  | GuideCommand
  | ActionCommand;

const DESTINATIONS: NavigationCommand[] = [
  {
    type: "navigation",
    id: "navigate-today",
    to: "/today",
    label: "Today",
    description:
      "Open your morning briefing and mission.",
    keywords: [
      "today",
      "morning",
      "mission",
      "practices",
    ],
    icon: Target,
  },
  {
    type: "navigation",
    id: "navigate-plan",
    to: "/plan",
    label: "Practice",
    description:
      "Review and organize your weekly plan.",
    keywords: [
      "plan",
      "practice",
      "schedule",
      "week",
    ],
    icon: Calendar,
  },
  {
    type: "navigation",
    id: "navigate-journey",
    to: "/journey",
    label: "Journey",
    description:
      "Explore your story and growth over time.",
    keywords: [
      "journey",
      "story",
      "timeline",
      "growth",
    ],
    icon: Compass,
  },
  {
    type: "navigation",
    id: "navigate-intelligence",
    to: "/intelligence",
    label: "Intelligence",
    description:
      "Review Forge conclusions and reasoning.",
    keywords: [
      "intelligence",
      "advisor",
      "insight",
      "reasoning",
      "evidence",
    ],
    icon: Sparkles,
  },
  {
    type: "navigation",
    id: "navigate-vision",
    to: "/vision",
    label: "Profile and Vision",
    description:
      "Edit your mission, North Star, and identities.",
    keywords: [
      "profile",
      "vision",
      "mission",
      "north star",
      "identity",
    ],
    icon: User,
  },
  {
    type: "navigation",
    id: "navigate-dashboard",
    to: "/dashboard",
    label: "Dashboard",
    description:
      "Open your detailed Forge overview.",
    keywords: [
      "dashboard",
      "overview",
      "home",
      "metrics",
    ],
    icon: LayoutDashboard,
  },
  {
    type: "navigation",
    id: "navigate-skills",
    to: "/skills",
    label: "Skills",
    description:
      "Manage the skills you are developing.",
    keywords: [
      "skills",
      "practice",
      "abilities",
      "development",
    ],
    icon: Flame,
  },
  {
    type: "navigation",
    id: "navigate-progress",
    to: "/progress",
    label: "Progress",
    description:
      "Review completion, time, and streaks.",
    keywords: [
      "progress",
      "streak",
      "completion",
      "statistics",
    ],
    icon: LineChart,
  },
  {
    type: "navigation",
    id: "navigate-story",
    to: "/story",
    label: "Weekly Story",
    description:
      "Read this week’s Forge narrative.",
    keywords: [
      "story",
      "weekly",
      "narrative",
      "reflection",
    ],
    icon: BookOpen,
  },
  {
    type: "navigation",
    id: "navigate-timeline",
    to: "/timeline",
    label: "Timeline",
    description:
      "Review meaningful moments over time.",
    keywords: [
      "timeline",
      "history",
      "events",
      "archive",
    ],
    icon: History,
  },
  {
    type: "navigation",
    id: "navigate-review",
    to: "/review",
    label: "Weekly Review",
    description:
      "Reflect on wins, challenges, and lessons.",
    keywords: [
      "review",
      "reflection",
      "wins",
      "challenges",
    ],
    icon: BookOpen,
  },
];

const GUIDES: GuideCommand[] = [
  {
    type: "guide",
    id: "guide-vision",
    tourId: "vision",
    to: "/vision",
    label: "Replay Vision Guide",
    description:
      "Review your mission, North Star, values, and future identity.",
    keywords: [
      "guide",
      "tour",
      "help",
      "replay",
      "vision",
      "mission",
      "north star",
    ],
    icon: CircleHelp,
  },
  {
    type: "guide",
    id: "guide-areas",
    tourId: "areas",
    to: "/areas",
    label: "Replay Life Areas Guide",
    description:
      "Review how broad life domains organize your growth system.",
    keywords: [
      "guide",
      "tour",
      "help",
      "replay",
      "areas",
      "life areas",
    ],
    icon: CircleHelp,
  },
  {
    type: "guide",
    id: "guide-skills",
    tourId: "skills",
    to: "/skills",
    label: "Replay Skills Guide",
    description:
      "Review skills, practice frequency, duration, and preferred days.",
    keywords: [
      "guide",
      "tour",
      "help",
      "replay",
      "skills",
      "practice",
    ],
    icon: CircleHelp,
  },
  {
    type: "guide",
    id: "guide-week",
    tourId: "week",
    to: "/plan",
    label: "Replay First Week Guide",
    description:
      "Review week generation, assessment, focus, and scheduling.",
    keywords: [
      "guide",
      "tour",
      "help",
      "replay",
      "week",
      "plan",
      "schedule",
    ],
    icon: CircleHelp,
  },
  {
    type: "guide",
    id: "guide-today",
    tourId: "today",
    to: "/today",
    label: "Replay Today Guide",
    description:
      "Review your daily workspace, momentum, reflection, and progress.",
    keywords: [
      "guide",
      "tour",
      "help",
      "replay",
      "today",
      "daily",
      "momentum",
    ],
    icon: CircleHelp,
  },
];

const ACTIONS: ActionCommand[] = [
  {
    type: "action",
    id: "reset-all-guides",
    action: "reset-guides",
    label: "Reset all Forge Guides",
    description:
      "Make every Guide available to launch automatically again.",
    keywords: [
      "reset",
      "all",
      "guides",
      "tours",
      "walkthroughs",
      "onboarding",
      "help",
    ],
    icon: RotateCcw,
  },
];

const ALL_COMMANDS: CommandItem[] = [
  ...DESTINATIONS,
  ...GUIDES,
  ...ACTIONS,
];

type ForgeCommandPaletteProps = {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
};

export function ForgeCommandPalette({
  open,
  onOpenChange,
}: ForgeCommandPaletteProps) {
  const navigate = useNavigate();

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState(0);

  const shortcutLabel = useMemo(() => {
    if (
      typeof navigator ===
      "undefined"
    ) {
      return "Ctrl K";
    }

    const platform =
      navigator.platform.toLowerCase();

    return platform.includes(
      "mac",
    )
      ? "⌘ K"
      : "Ctrl K";
  }, []);

  const results = useMemo(() => {
    const normalized =
      query
        .trim()
        .toLowerCase();

    if (!normalized) {
      return ALL_COMMANDS;
    }

    return ALL_COMMANDS.filter(
      (command) => {
        const haystack = [
          command.label,
          command.description,
          ...command.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(
          normalized,
        );
      },
    );
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (
      selectedIndex <
      results.length
    ) {
      return;
    }

    setSelectedIndex(
      Math.max(
        0,
        results.length - 1,
      ),
    );
  }, [
    results.length,
    selectedIndex,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        event.preventDefault();

        onOpenChange(false);

        return;
      }

      if (
        event.key ===
          "ArrowDown" &&
        results.length > 0
      ) {
        event.preventDefault();

        setSelectedIndex(
          (current) =>
            (current + 1) %
            results.length,
        );

        return;
      }

      if (
        event.key ===
          "ArrowUp" &&
        results.length > 0
      ) {
        event.preventDefault();

        setSelectedIndex(
          (current) =>
            (current -
              1 +
              results.length) %
            results.length,
        );

        return;
      }

      if (
        event.key ===
          "Enter" &&
        results[
          selectedIndex
        ]
      ) {
        event.preventDefault();

        void runCommand(
          results[
            selectedIndex
          ],
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onOpenChange,
    results,
    selectedIndex,
  ]);

  async function openDestination(
    to: string,
  ) {
    onOpenChange(false);

    await navigate({
      to,
    });
  }

  async function replayGuide(
    tourId: TourId,
    to: string,
  ) {
    onOpenChange(false);

    resetTour(
      tourId,
    );

    await navigate({
      to,
    });

    window.setTimeout(() => {
      startTour(
        tourId,
      );
    }, 400);
  }

  function resetGuides() {
    resetAllTours();

    onOpenChange(false);

    toast.success(
      "All Forge Guides have been reset.",
    );
  }

  async function runCommand(
    command: CommandItem,
  ) {
    if (
      command.type ===
      "navigation"
    ) {
      await openDestination(
        command.to,
      );

      return;
    }

    if (
      command.type ===
      "guide"
    ) {
      await replayGuide(
        command.tourId,
        command.to,
      );

      return;
    }

    if (
      command.action ===
      "reset-guides"
    ) {
      resetGuides();
    }
  }

  function getSectionLabel(
    command: CommandItem,
    index: number,
  ) {
    if (query.trim()) {
      return null;
    }

    if (
      index === 0
    ) {
      return "Navigate";
    }

    if (
      command.type ===
        "guide" &&
      results[
        index - 1
      ]?.type !==
        "guide"
    ) {
      return "Forge Guides";
    }

    if (
      command.type ===
        "action" &&
      results[
        index - 1
      ]?.type !==
        "action"
    ) {
      return "Guide Settings";
    }

    return null;
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/75 px-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Forge search and guides"
      onMouseDown={() =>
        onOpenChange(false)
      }
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />

          <input
            autoFocus
            value={query}
            onChange={(
              event,
            ) =>
              setQuery(
                event.target
                  .value,
              )
            }
            placeholder="Search pages or Forge Guides..."
            className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <span className="hidden rounded-md border border-border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            {shortcutLabel}
          </span>

          <button
            type="button"
            onClick={() =>
              onOpenChange(
                false,
              )
            }
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close command search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-2">
          {results.length ===
          0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold">
                Nothing found.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Try searching for a
                page, Guide, practice,
                story, or insight.
              </p>
            </div>
          ) : (
            results.map(
              (
                command,
                index,
              ) => {
                const Icon =
                  command.icon;

                const selected =
                  index ===
                  selectedIndex;

                const sectionLabel =
                  getSectionLabel(
                    command,
                    index,
                  );

                return (
                  <div
                    key={
                      command.id
                    }
                  >
                    {sectionLabel ? (
                      <p className="px-3 pb-2 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground first:pt-2">
                        {
                          sectionLabel
                        }
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onMouseEnter={() =>
                        setSelectedIndex(
                          index,
                        )
                      }
                      onClick={() => {
                        void runCommand(
                          command,
                        );
                      }}
                      className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        selected
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                        <Icon className="size-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold">
                          {
                            command.label
                          }
                        </span>

                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {
                            command.description
                          }
                        </span>
                      </span>

                      {command.type ===
                      "guide" ? (
                        <span className="mt-1 rounded-full border border-border px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          Guide
                        </span>
                      ) : null}
                    </button>
                  </div>
                );
              },
            )
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
          <span>
            ↑↓ Navigate · Enter Open
          </span>

          <span className="font-mono">
            {shortcutLabel} Anywhere ·
            ESC Close
          </span>
        </div>
      </div>
    </div>
  );
}