import {
  Suspense,
  useState,
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

import {
  toast,
} from "sonner";

import {
  ForgeButton,
  ForgeCard,
  ForgeEmptyState,
  ForgePage,
} from "@/components/forge";

import {
  PageHeader,
} from "@/components/forge/app-shell";

import {
  lifeAreasQuery,
} from "@/features/forge/queries";

import {
  LIFE_AREA_COLORS,
  type LifeArea,
} from "@/features/forge/types";

import {
  SetupProgress,
} from "@/features/onboarding";

import {
  supabase,
} from "@/integrations/supabase/client";

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
      <Suspense
        fallback={
          <AreasLoadingState />
        }
      >
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

  const {
    data: areas,
  } = useSuspenseQuery(
    lifeAreasQuery(),
  );

  const [creating, setCreating] =
    useState(false);

  function continueToSkills() {
    if (areas.length === 0) {
      toast.error(
        "Add at least one life area before continuing.",
      );

      return;
    }

    void navigate({
      to: "/skills",
    });
  }

  return (
    <div className="space-y-8">
      <SetupProgress
        currentStep={2}
      />

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
            type="button"
            onClick={() =>
              setCreating(true)
            }
            className="gap-2"
          >
            <Plus className="size-4" />

            New area
          </ForgeButton>
        }
      />

      <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
        Life Areas organize the parts
        of your life that matter.
        Choose a few broad domains;
        you will add specific skills
        next.
      </p>

      {areas.length === 0 &&
      !creating ? (
        <ForgeEmptyState
          title="Choose your first life area."
          description="Start with one or two meaningful areas, such as Creativity, Health, Career, Languages, Relationships, or Spirituality."
          action={
            <ForgeButton
              type="button"
              onClick={() =>
                setCreating(true)
              }
            >
              Add your first area
            </ForgeButton>
          }
        />
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {creating ? (
          <AreaForm
            onClose={() =>
              setCreating(false)
            }
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
          existing={areas.map(
            (area) =>
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
          type="button"
          disabled={
            areas.length === 0
          }
          onClick={
            continueToSkills
          }
          className="gap-2"
        >
          Continue to skills

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
  const queryClient =
    useQueryClient();

  async function remove() {
    const confirmed =
      window.confirm(
        `Archive "${area.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("life_areas")
        .update({
          archived: true,
        })
        .eq("id", area.id);

    if (error) {
      toast.error(
        error.message,
      );

      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["life_areas"],
    });

    toast.success(
      `${area.name} archived.`,
    );
  }

  return (
    <ForgeCard className="group p-5">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="size-10 rounded-xl"
          style={{
            backgroundColor:
              area.color,
          }}
        />

        <button
          type="button"
          onClick={remove}
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
          A broad domain for your
          future skills and practices.
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
  const queryClient =
    useQueryClient();

  const [name, setName] =
    useState("");

  const [vision, setVision] =
    useState("");

  const [color, setColor] =
    useState<string>(
      LIFE_AREA_COLORS[0],
    );

  const [priority, setPriority] =
    useState(3);

  const [loading, setLoading] =
    useState(false);

  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Enter a name for your life area.");
      return;
      }

    try {
      setLoading(true);

      const {
        data,
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error(
          "User not authenticated.",
        );
      }

      const { error } =
        await supabase
          .from("life_areas")
          .insert({
            user_id: data.user.id,
            name: name.trim(),
            vision:
              vision.trim() ||
              null,
            color,
            priority,
          });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: [
          "life_areas",
        ],
      });

      toast.success(
        `${name.trim()} added.`,
      );

      onClose();
    } catch (error) {
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
      onSubmit={submit}
      className="rounded-2xl border-2 border-foreground bg-card p-5 md:col-span-2"
    >
      <div className="mb-4 flex items-center justify-between">
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

      <input
        autoFocus
        placeholder="e.g. Career, Health, Creativity"
        value={name}
        onChange={(event) =>
          setName(
            event.target.value,
          )
        }
        className="w-full bg-transparent text-2xl font-extrabold tracking-tight outline-none placeholder:text-muted-foreground/40"
      />

      <textarea
        placeholder="Who do you want to become in this area?"
        value={vision}
        onChange={(event) =>
          setVision(
            event.target.value,
          )
        }
        rows={2}
        className="mt-3 w-full resize-none bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/40"
      />

      <div className="mt-5 flex flex-col gap-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Color
          </span>

          <div className="mt-3 flex flex-wrap gap-2">
            {LIFE_AREA_COLORS.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setColor(option)
                  }
                  className={[
                    "size-8 rounded-lg transition-all",
                    color === option
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "",
                  ].join(" ")}
                  style={{
                    backgroundColor:
                      option,
                  }}
                  aria-label={`Select color ${option}`}
                />
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Priority
            </span>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              className="mt-2 block h-11 rounded-xl border border-border bg-background px-3 text-sm"
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
  const queryClient =
    useQueryClient();

  const remaining =
    SUGGESTIONS.filter(
      (suggestion) =>
        !existing.includes(
          suggestion.name.toLowerCase(),
        ),
    );

  if (remaining.length === 0) {
    return null;
  }

  async function add(
    suggestion: {
      name: string;
      color: string;
    },
  ) {
    try {
      const {
        data,
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error(
          "User not authenticated.",
        );
      }

      const { error } =
        await supabase
          .from("life_areas")
          .insert({
            user_id: data.user.id,
            name: suggestion.name,
            color:
              suggestion.color,
          });

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: [
          "life_areas",
        ],
      });

      toast.success(
        `${suggestion.name} added.`,
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Suggested area could not be added.",
        ),
      );
    }
  }

  return (
    <section>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Suggested areas
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {remaining.map(
          (suggestion) => (
            <button
              key={
                suggestion.name
              }
              type="button"
              onClick={() =>
                add(suggestion)
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:border-foreground/30 hover:bg-muted"
            >
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor:
                    suggestion.color,
                }}
              />

              {suggestion.name}
            </button>
          ),
        )}
      </div>
    </section>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    error instanceof Error
  ) {
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