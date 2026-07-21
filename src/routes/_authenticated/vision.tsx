import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  createFileRoute,
} from "@tanstack/react-router";

import { toast } from "sonner";

import {
  ForgeButton,
  ForgeCard,
  ForgeEmptyState,
  ForgePage,
  ForgeSection,
} from "@/components/forge";

import {
  useVision,
  visionQuery,
} from "@/features/vision";

export const Route = createFileRoute(
  "/_authenticated/vision",
)({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      visionQuery(),
    );
  },
  component: VisionPage,
});

function VisionPage() {
  return (
    <ForgePage>
      <Suspense fallback={<VisionLoadingState />}>
        <VisionContent />
      </Suspense>
    </ForgePage>
  );
}

function VisionLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      <div className="h-56 animate-pulse rounded-2xl bg-muted" />
      <div className="h-44 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function VisionContent() {
  const {
    vision,
    saveVision,
    saving,
  } = useVision();

  const [mission, setMission] =
    useState("");

  const [northStar, setNorthStar] =
    useState("");

  const [coreValues, setCoreValues] =
    useState<string[]>([]);

  const [identities, setIdentities] =
    useState<string[]>([]);

  const [themes, setThemes] =
    useState<string[]>([]);

  useEffect(() => {
    setMission(
      vision?.mission ?? "",
    );

    setNorthStar(
      vision?.north_star ?? "",
    );

    setCoreValues(
      vision?.core_values ?? [],
    );

    setIdentities(
      vision?.identities ?? [],
    );

    setThemes(
      vision?.themes ?? [],
    );
  }, [vision]);

  async function handleSave() {
    try {
      await saveVision({
        mission,
        north_star: northStar,
        core_values: coreValues,
        identities,
        themes,
      });

      toast.success("Vision saved.");
    } catch (error) {
      console.error(
        "Vision save error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Your Vision could not be saved.",
        ),
      );
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          My Vision
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
          Who are you intentionally becoming?
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          Give Forge the context behind your
          practices. Your mission, North Star,
          values, future identities, and life themes
          will guide planning and coaching.
        </p>
      </header>

      <ForgeCard padding="large">
        <ForgeSection
          eyebrow="Mission"
          title="Name the direction of your life."
        />

        <textarea
          value={mission}
          onChange={(event) =>
            setMission(event.target.value)
          }
          rows={6}
          placeholder="I want to become..."
          className="mt-5 w-full resize-y rounded-2xl border border-border bg-background px-4 py-4 text-base leading-7 outline-none transition focus:border-foreground/40"
        />

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Keep it honest and broad enough to outlast
          a single project or season.
        </p>
      </ForgeCard>

      <ForgeCard padding="large">
        <ForgeSection
          eyebrow="North Star"
          title="The one sentence that should influence every decision."
        />

        <input
          value={northStar}
          onChange={(event) =>
            setNorthStar(event.target.value)
          }
          placeholder="Leave every place better than you found it."
          className="mt-5 h-12 w-full rounded-2xl border border-border bg-background px-4 text-base outline-none transition focus:border-foreground/40"
        />

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          When you feel uncertain, Forge will remind you of this sentence.
        </p>
      </ForgeCard>

      <EditableListCard
        eyebrow="Core values"
        title="What principles should guide your choices?"
        placeholder="Add a value"
        items={coreValues}
        onChange={setCoreValues}
        suggestions={[
          "Curiosity",
          "Discipline",
          "Compassion",
          "Creativity",
          "Stewardship",
          "Courage",
          "Service",
          "Beauty",
        ]}
      />

      <EditableListCard
        eyebrow="Future identities"
        title="Who are you becoming through practice?"
        placeholder="Add an identity"
        items={identities}
        onChange={setIdentities}
        suggestions={[
          "Researcher",
          "Writer",
          "Artist",
          "Teacher",
          "Athlete",
          "Parent",
          "Leader",
          "Craftsman",
        ]}
      />

      <EditableListCard
        eyebrow="Life themes"
        title="What ideas should shape this season?"
        placeholder="Add a theme"
        items={themes}
        onChange={setThemes}
        suggestions={[
          "Adventure",
          "Learning",
          "Service",
          "Family",
          "Health",
          "Mastery",
          "Simplicity",
          "Renewal",
        ]}
      />

      <div className="flex justify-end">
        <ForgeButton
          type="button"
          disabled={saving}
          onClick={handleSave}
        >
          {saving
            ? "Saving..."
            : "Save Vision"}
        </ForgeButton>
      </div>
    </div>
  );
}

type EditableListCardProps = {
  eyebrow: string;
  title: string;
  placeholder: string;
  items: string[];
  suggestions: string[];
  onChange: (items: string[]) => void;
};

function EditableListCard({
  eyebrow,
  title,
  placeholder,
  items,
  suggestions,
  onChange,
}: EditableListCardProps) {
  const [draft, setDraft] =
    useState("");

  function addItem(value: string) {
    const normalized =
      value.trim();

    if (!normalized) {
      return;
    }

    const alreadyExists = items.some(
      (item) =>
        item.toLowerCase() ===
        normalized.toLowerCase(),
    );

    if (alreadyExists) {
      setDraft("");
      return;
    }

    onChange([
      ...items,
      normalized,
    ]);

    setDraft("");
  }

  function removeItem(
    value: string,
  ) {
    onChange(
      items.filter(
        (item) => item !== value,
      ),
    );
  }

  const unusedSuggestions =
    suggestions.filter(
      (suggestion) =>
        !items.some(
          (item) =>
            item.toLowerCase() ===
            suggestion.toLowerCase(),
        ),
    );

  return (
    <ForgeCard padding="large">
      <ForgeSection
        eyebrow={eyebrow}
        title={title}
      />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={draft}
          onChange={(event) =>
            setDraft(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem(draft);
            }
          }}
          placeholder={placeholder}
          className="h-11 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground/40"
        />

        <ForgeButton
          type="button"
          variant="secondary"
          onClick={() =>
            addItem(draft)
          }
        >
          Add
        </ForgeButton>
      </div>

      {items.length === 0 ? (
        <ForgeEmptyState
          title="Nothing added yet."
          description="Add the words that best describe this part of your Vision."
          className="mt-5 py-8"
        />
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                removeItem(item)
              }
              className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-semibold transition hover:border-destructive/40 hover:text-destructive"
              aria-label={`Remove ${item}`}
              title={`Remove ${item}`}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {unusedSuggestions.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-semibold text-muted-foreground">
            Suggestions
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {unusedSuggestions.map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    addItem(suggestion)
                  }
                  className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
                >
                  + {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </ForgeCard>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (
      error as {
        message?: unknown;
      }
    ).message === "string"
  ) {
    return (
      error as {
        message: string;
      }
    ).message;
  }

  return fallback;
}