import {
  Suspense,
  useState,
  type FormEvent,
} from "react";

import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  ArrowRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  ForgeButton,
  ForgeCard,
  ForgeEmptyState,
  ForgePage,
} from "@/components/forge";

import { PageHeader } from "@/components/forge/app-shell";

import { lifeAreasQuery } from "@/features/forge/queries";

import {
  LIFE_AREA_COLORS,
  type LifeArea,
} from "@/features/forge/types";

import { SetupProgress } from "@/features/onboarding";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute(
  "/_authenticated/areas",
)({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      lifeAreasQuery(),
    );
  },

  component: AreasPage,
});

function AreasPage() {
  return (
    <ForgePage>
      <Suspense fallback={<AreasLoadingState />}>
        <AreasContent />
      </Suspense>
    </ForgePage>
  );
}

function AreasLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-36 animate-pulse rounded-2xl bg-muted" />
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />

      <div className="grid gap-3 md:grid-cols-2">
        <div className="h-52 animate-pulse rounded-2xl bg-muted" />
        <div className="h-52 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function AreasContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: areas } = useSuspenseQuery(
    lifeAreasQuery(),
  );

  const [creating, setCreating] = useState(false);
  const [continuing, setContinuing] = useState(false);

  async function continueToSkills() {
    try {
      setContinuing(true);

      const refreshedAreas =
        await queryClient.fetchQuery({
          ...lifeAreasQuery(),
          staleTime: 0,
        });

      if (refreshedAreas.length === 0) {
        toast.error(
          "Add at least one life area before continuing.",
        );

        return;
      }

      await navigate({
        to: "/skills",
      });
    } catch (error) {
      console.error(
        "Continue to skills error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Could not continue to skills.",
        ),
      );
    } finally {
      setContinuing(false);
    }
  }

  return (
    <div className="space-y-8">
      <SetupProgress currentStep={2} />

      <div data-tour="areas-title">
        <PageHeader
          eyebrow="Life Areas"
          title={
            <>
              Where do you want to{" "}
              <span className="text-accent">
                grow
              </span>
              ?
            </>
          }
          action={
            <ForgeButton
              data-tour="areas-new"
              type="button"
              onClick={() => setCreating(true)}
              className="gap-2"
            >
              <Plus className="size-4" />

              New area
            </ForgeButton>
          }
        />
      </div>

      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
        Life Areas organize the parts of your life that
        matter. Choose a few broad domains; you will add
        specific skills next.
      </p>

      {areas.length === 0 && !creating ? (
        <ForgeEmptyState
          title="Choose your first life area."
          description="Start with one or two meaningful areas, such as Creativity, Health, Career, Languages, Relationships, or Spirituality."
          action={
            <ForgeButton
              data-tour="areas-empty-create"
              type="button"
              onClick={() => setCreating(true)}
            >
              Add your first area
            </ForgeButton>
          }
        />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {creating ? (
          <AreaForm
            onClose={() => setCreating(false)}
          />
        ) : null}

        {areas.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
          />
        ))}
      </div>

      {areas.length > 0 ? (
        <SuggestedAreas
          existing={areas.map((area) =>
            area.name.toLowerCase(),
          )}
        />
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {areas.length === 0
            ? "Add at least one area to continue."
            : `${areas.length} ${
                areas.length === 1
                  ? "area"
                  : "areas"
              } selected.`}
        </p>

        <ForgeButton
          data-tour="areas-continue"
          type="button"
          disabled={continuing}
          onClick={() => {
            void continueToSkills();
          }}
          className="gap-2"
        >
          {continuing
            ? "Loading..."
            : "Continue to skills"}

          <ArrowRight className="size-4" />
        </ForgeButton>
      </div>
    </div>
  );
}

function AreaCard({
  area,
}: {
  area: LifeArea;
}) {
  const queryClient = useQueryClient();

  async function remove() {
    const confirmed = window.confirm(
      `Archive "${area.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("life_areas")
        .update({
          archived: true,
        })
        .eq("id", area.id);

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: lifeAreasQuery().queryKey,
      });

      toast.success(
        `${area.name} archived.`,
      );
    } catch (error) {
      console.error(
        "Archive area error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Life area could not be archived.",
        ),
      );
    }
  }

  return (
    <ForgeCard className="group p-5">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="size-10 rounded-xl"
          style={{
            backgroundColor: area.color,
          }}
        />

        <button
          type="button"
          onClick={() => {
            void remove();
          }}
          className="rounded-lg p-2 text-muted-foreground opacity-100 transition hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
          aria-label={`Archive ${area.name}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <h3 className="text-lg font-bold tracking-tight">
        {area.name}
      </h3>

      {area.vision ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {area.vision}
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          A broad domain for your future skills and
          practices.
        </p>
      )}

      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Priority {area.priority}
      </p>
    </ForgeCard>
  );
}

function AreaForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [vision, setVision] = useState("");

  const [color, setColor] = useState<string>(
    LIFE_AREA_COLORS[0],
  );

  const [priority, setPriority] = useState(3);
  const [loading, setLoading] = useState(false);

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedVision = vision.trim();

    if (!trimmedName) {
      toast.error(
        "Enter a name for your life area.",
      );

      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error(
          "User not authenticated.",
        );
      }

      const { error } = await supabase
        .from("life_areas")
        .insert({
          user_id: data.user.id,
          name: trimmedName,
          vision: trimmedVision || null,
          color,
          priority,
        });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: lifeAreasQuery().queryKey,
      });

      await queryClient.refetchQueries({
        queryKey: lifeAreasQuery().queryKey,
      });

      toast.success(
        `${trimmedName} added.`,
      );

      onClose();
    } catch (error) {
      console.error(
        "Create life area error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Life area could not be created.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      data-tour="area-form"
      onSubmit={submit}
      className="rounded-2xl border-2 border-foreground bg-card p-5 md:col-span-2"
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          New life area
        </p>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Close new area form"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-5">
        <label
          data-tour="area-name"
          className="block"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Area name
          </span>

          <input
            autoFocus
            required
            type="text"
            placeholder="e.g. Career, Health, Creativity"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="mt-2 w-full bg-transparent text-2xl font-extrabold tracking-tight outline-none placeholder:text-muted-foreground/40"
          />
        </label>

        <label
          data-tour="area-vision"
          className="block"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Vision
          </span>

          <textarea
            placeholder="Who do you want to become in this area?"
            value={vision}
            onChange={(event) =>
              setVision(event.target.value)
            }
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        <div data-tour="area-color">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Color
          </span>

          <div className="mt-3 flex flex-wrap gap-2">
            {LIFE_AREA_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                className={[
                  "size-8 rounded-lg transition-all",
                  color === option
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "",
                ].join(" ")}
                style={{
                  backgroundColor: option,
                }}
                aria-label={`Select color ${option}`}
                aria-pressed={color === option}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label data-tour="area-priority">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Priority
            </span>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  Number(event.target.value),
                )
              }
              className="mt-2 block h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-2 focus:ring-accent/20"
            >
              {[1, 2, 3, 4, 5].map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ),
              )}
            </select>
          </label>

          <ForgeButton
            data-tour="area-create"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create area"}
          </ForgeButton>
        </div>
      </div>
    </form>
  );
}

const SUGGESTIONS = [
  {
    name: "Career",
    color: "#0369a1",
  },
  {
    name: "Health",
    color: "#166534",
  },
  {
    name: "Creativity",
    color: "#c2410c",
  },
  {
    name: "Languages",
    color: "#4338ca",
  },
  {
    name: "Finance",
    color: "#a16207",
  },
  {
    name: "Relationships",
    color: "#be185d",
  },
  {
    name: "Spirituality",
    color: "#7c3aed",
  },
  {
    name: "Adventure",
    color: "#0891b2",
  },
];

function SuggestedAreas({
  existing,
}: {
  existing: string[];
}) {
  const queryClient = useQueryClient();

  const [addingName, setAddingName] =
    useState<string | null>(null);

  const remaining = SUGGESTIONS.filter(
    (suggestion) =>
      !existing.includes(
        suggestion.name.toLowerCase(),
      ),
  );

  if (remaining.length === 0) {
    return null;
  }

  async function add(suggestion: {
    name: string;
    color: string;
  }) {
    try {
      setAddingName(suggestion.name);

      const {
        data,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error(
          "User not authenticated.",
        );
      }

      const { error } = await supabase
        .from("life_areas")
        .insert({
          user_id: data.user.id,
          name: suggestion.name,
          vision: null,
          color: suggestion.color,
          priority: 3,
        });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: lifeAreasQuery().queryKey,
      });

      await queryClient.refetchQueries({
        queryKey: lifeAreasQuery().queryKey,
      });

      toast.success(
        `${suggestion.name} added.`,
      );
    } catch (error) {
      console.error(
        "Add suggested area error:",
        error,
      );

      toast.error(
        getErrorMessage(
          error,
          "Suggested area could not be added.",
        ),
      );
    } finally {
      setAddingName(null);
    }
  }

  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Suggested areas
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {remaining.map((suggestion) => {
          const adding =
            addingName === suggestion.name;

          return (
            <button
              key={suggestion.name}
              type="button"
              disabled={addingName !== null}
              onClick={() => {
                void add(suggestion);
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:border-foreground/30 hover:bg-muted disabled:cursor-wait disabled:opacity-50"
            >
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor:
                    suggestion.color,
                }}
              />

              {adding
                ? "Adding..."
                : suggestion.name}
            </button>
          );
        })}
      </div>
    </section>
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