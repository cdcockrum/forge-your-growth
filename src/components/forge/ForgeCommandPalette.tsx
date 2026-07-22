import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BookOpen,
  Calendar,
  Compass,
  Flame,
  History,
  LayoutDashboard,
  LineChart,
  Search,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "@tanstack/react-router";

type CommandDestination = {
  to: string;
  label: string;
  description: string;
  keywords: string[];
  icon: typeof Search;
};

const DESTINATIONS: CommandDestination[] = [
  {
    to: "/today",
    label: "Today",
    description: "Open your morning briefing and mission.",
    keywords: [
      "today",
      "morning",
      "mission",
      "practices",
    ],
    icon: Target,
  },
  {
    to: "/plan",
    label: "Practice",
    description: "Review and organize your weekly plan.",
    keywords: [
      "plan",
      "practice",
      "schedule",
      "week",
    ],
    icon: Calendar,
  },
  {
    to: "/journey",
    label: "Journey",
    description: "Explore your story and growth over time.",
    keywords: [
      "journey",
      "story",
      "timeline",
      "growth",
    ],
    icon: Compass,
  },
  {
    to: "/intelligence",
    label: "Intelligence",
    description: "Review Forge conclusions and reasoning.",
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
    to: "/vision",
    label: "Profile and Vision",
    description: "Edit your mission, North Star, and identities.",
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
    to: "/dashboard",
    label: "Dashboard",
    description: "Open your detailed Forge overview.",
    keywords: [
      "dashboard",
      "overview",
      "home",
      "metrics",
    ],
    icon: LayoutDashboard,
  },
  {
    to: "/skills",
    label: "Skills",
    description: "Manage the skills you are developing.",
    keywords: [
      "skills",
      "practice",
      "abilities",
      "development",
    ],
    icon: Flame,
  },
  {
    to: "/progress",
    label: "Progress",
    description: "Review completion, time, and streaks.",
    keywords: [
      "progress",
      "streak",
      "completion",
      "statistics",
    ],
    icon: LineChart,
  },
  {
    to: "/story",
    label: "Weekly Story",
    description: "Read this week’s Forge narrative.",
    keywords: [
      "story",
      "weekly",
      "narrative",
      "reflection",
    ],
    icon: BookOpen,
  },
  {
    to: "/timeline",
    label: "Timeline",
    description: "Review meaningful moments over time.",
    keywords: [
      "timeline",
      "history",
      "events",
      "archive",
    ],
    icon: History,
  },
  {
    to: "/review",
    label: "Weekly Review",
    description: "Reflect on wins, challenges, and lessons.",
    keywords: [
      "review",
      "reflection",
      "wins",
      "challenges",
    ],
    icon: BookOpen,
  },
];

type ForgeCommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ForgeCommandPalette({
  open,
  onOpenChange,
}: ForgeCommandPaletteProps) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const results = useMemo(() => {
    const normalized =
      query.trim().toLowerCase();

    if (!normalized) {
      return DESTINATIONS;
    }

    return DESTINATIONS.filter(
      (destination) => {
        const haystack = [
          destination.label,
          destination.description,
          ...destination.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalized);
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
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (
        event.key === "ArrowDown" &&
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
        event.key === "ArrowUp" &&
        results.length > 0
      ) {
        event.preventDefault();

        setSelectedIndex(
          (current) =>
            (current - 1 + results.length) %
            results.length,
        );

        return;
      }

      if (
        event.key === "Enter" &&
        results[selectedIndex]
      ) {
        event.preventDefault();

        void openDestination(
          results[selectedIndex].to,
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

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/75 px-4 pt-[10vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Forge command search"
      onMouseDown={() =>
        onOpenChange(false)
      }
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search Forge..."
            className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close command search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold">
                Nothing found.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Try searching for a page,
                practice, story, or insight.
              </p>
            </div>
          ) : (
            results.map(
              (
                destination,
                index,
              ) => {
                const Icon =
                  destination.icon;

                const selected =
                  index === selectedIndex;

                return (
                  <button
                    key={destination.to}
                    type="button"
                    onMouseEnter={() =>
                      setSelectedIndex(index)
                    }
                    onClick={() =>
                      openDestination(
                        destination.to,
                      )
                    }
                    className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      selected
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                      <Icon className="size-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-bold">
                        {
                          destination.label
                        }
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        {
                          destination.description
                        }
                      </span>
                    </span>
                  </button>
                );
              },
            )
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
          <span>
            ↑↓ Navigate · Enter Open
          </span>

          <span className="font-mono">
            ESC Close
          </span>
        </div>
      </div>
    </div>
  );
}