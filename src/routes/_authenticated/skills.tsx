import {
  Suspense,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";
import {
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/forge/app-shell";
import { AdaptiveRecommendations } from "@/features/adaptive";
import {
  iso,
  lifeAreasQuery,
  sessionsInRangeQuery,
  skillsQuery,
} from "@/features/forge/queries";
import {
  DAYS,
  DAY_LABELS,
  type LifeArea,
  type Skill,
} from "@/features/forge/types";
import {
  analyzeAdaptivePlanning,
  type SkillAdaptation,
} from "@/features/forge-engine";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute(
  "/_authenticated/skills",
)({
  loader: async ({ context }) => {
    const { start, end } = getHistoryRange();

    await Promise.all([
      context.queryClient.ensureQueryData(skillsQuery()),
      context.queryClient.ensureQueryData(
        lifeAreasQuery(),
      ),
      context.queryClient.ensureQueryData(
        sessionsInRangeQuery(start, end),
      ),
    ]);
  },
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-16 pt-8 md:px-10 md:pt-12">
      <Suspense fallback={<SkillsLoadingState />}>
        <SkillsContent />
      </Suspense>
    </main>
  );
}

function SkillsLoadingState() {
  return (
    <div className="space-y-3">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-2xl bg-muted"
        />
      ))}
    </div>
  );
}

function SkillsContent() {
  const queryClient = useQueryClient();
  const { start, end } = getHistoryRange();

  const { data: skills } = useSuspenseQuery(
    skillsQuery(),
  );

  const { data: areas } = useSuspenseQuery(
    lifeAreasQuery(),
  );

  const { data: sessions } = useSuspenseQuery(
    sessionsInRangeQuery(start, end),
  );

  const [creating, setCreating] = useState(false);
  const [applyingSkillId, setApplyingSkillId] =
    useState<string | null>(null);

  const adaptation = useMemo(
    () =>
      analyzeAdaptivePlanning({
        sessions,
        skills,
      }),
    [sessions, skills],
  );

  async function applyRecommendation(
    recommendation: SkillAdaptation,
  ) {
    try {
      setApplyingSkillId(recommendation.skillId);

      const { error } = await supabase
        .from("skills")
        .update({
          preferred_days:
            recommendation.recommendedDays,
        })
        .eq("id", recommendation.skillId);

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      toast.success(
        `${recommendation.skillName} schedule updated.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The recommendation could not be applied.",
      );
    } finally {
      setApplyingSkillId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title={
          <>
            Deliberate{" "}
            <span className="text-accent">
              practice
            </span>
            .
          </>
        }
        action={
          areas.length > 0 && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:bg-foreground/90"
            >
              <Plus className="size-3.5" />
              New skill
            </button>
          )
        }
      />

      {areas.length === 0 ? (
        <NoAreasState />
      ) : skills.length === 0 && !creating ? (
        <NoSkillsState
          onCreate={() => setCreating(true)}
        />
      ) : (
        <>
          <div className="space-y-3">
            {creating && (
              <SkillForm
                areas={areas}
                onClose={() => setCreating(false)}
              />
            )}

            {skills.map((skill) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                area={areas.find(
                  (area) =>
                    area.id === skill.life_area_id,
                )}
              />
            ))}
          </div>

          <AdaptiveRecommendations
            adaptations={adaptation.skills}
            applyingSkillId={applyingSkillId}
            onApply={applyRecommendation}
          />
        </>
      )}
    </>
  );
}

function NoAreasState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <p className="mb-4 text-sm text-muted-foreground">
        Create a life area first.
      </p>

      <Link
        to="/areas"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background"
      >
        Go to life areas
      </Link>
    </div>
  );
}

function NoSkillsState({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
      <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-muted-foreground">
        Skills are the specific practices that move you forward:
        writing, French, running, painting, guitar, Python, or
        leadership.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background transition hover:bg-foreground/90"
      >
        Add your first skill
      </button>
    </div>
  );
}

type SkillRowProps = {
  skill: Skill;
  area?: LifeArea;
};

function SkillRow({
  skill,
  area,
}: SkillRowProps) {
  const queryClient = useQueryClient();
  const [archiving, setArchiving] = useState(false);

  async function archive() {
    const confirmed = window.confirm(
      `Archive "${skill.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setArchiving(true);

      const { error } = await supabase
        .from("skills")
        .update({
          archived: true,
        })
        .eq("id", skill.id);

      if (error) {
        throw error;
      }

      await queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      toast.success(`${skill.name} archived.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The skill could not be archived.",
      );
    } finally {
      setArchiving(false);
    }
  }

  return (
    <article className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="min-w-0 flex-1">
        {area && (
          <p
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: area.color }}
          >
            {area.name}
          </p>
        )}

        <h3 className="mt-1 truncate text-lg font-bold tracking-tight">
          {skill.name}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          {skill.target_frequency}×/week ·{" "}
          {skill.session_minutes}m · Difficulty{" "}
          {skill.difficulty}/5 · Level{" "}
          {skill.current_level}
        </p>

        <div className="mt-3 flex gap-1">
          {DAYS.map((day) => (
            <span
              key={day}
              className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                skill.preferred_days.includes(day)
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {DAY_LABELS[day][0]}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={archive}
        disabled={archiving}
        className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100 disabled:cursor-wait disabled:opacity-50"
        aria-label={`Archive ${skill.name}`}
      >
        <Trash2 className="size-4" />
      </button>
    </article>
  );
}

type SkillFormProps = {
  areas: LifeArea[];
  onClose: () => void;
};

function SkillForm({
  areas,
  onClose,
}: SkillFormProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState(
    areas[0]?.id ?? "",
  );
  const [frequency, setFrequency] = useState(3);
  const [minutes, setMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState(3);
  const [days, setDays] = useState<string[]>([
    "mon",
    "wed",
    "fri",
  ]);
  const [loading, setLoading] = useState(false);

  function toggleDay(day: string) {
    setDays((current) =>
      current.includes(day)
        ? current.filter(
            (selectedDay) =>
              selectedDay !== day,
          )
        : [...current, day],
    );
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim() || !areaId || days.length === 0) {
      return;
    }

    try {
      setLoading(true);

      const { data, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!data.user) {
        throw new Error("User not authenticated.");
      }

      const { error: insertError } = await supabase
        .from("skills")
        .insert({
          user_id: data.user.id,
          life_area_id: areaId,
          name: name.trim(),
          target_frequency: frequency,
          session_minutes: minutes,
          difficulty,
          preferred_days: days,
        });

      if (insertError) {
        throw insertError;
      }

      await queryClient.invalidateQueries({
        queryKey: ["skills"],
      });

      toast.success(`${name.trim()} created.`);
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "The skill could not be created.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border-2 border-foreground bg-surface p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          New skill
        </p>

        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground transition hover:text-foreground"
          aria-label="Close new skill form"
        >
          <X className="size-4" />
        </button>
      </div>

      <input
        autoFocus
        placeholder="e.g. Deep Writing, French, Running"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        className="w-full bg-transparent text-2xl font-extrabold tracking-tight outline-none placeholder:text-muted-foreground/40"
      />

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SelectField
          label="Life area"
          value={areaId}
          onChange={setAreaId}
        >
          {areas.map((area) => (
            <option
              key={area.id}
              value={area.id}
            >
              {area.name}
            </option>
          ))}
        </SelectField>

        <NumField
          label="Freq/wk"
          value={frequency}
          onChange={setFrequency}
          min={1}
          max={7}
        />

        <NumField
          label="Minutes"
          value={minutes}
          onChange={setMinutes}
          min={5}
          max={240}
          step={5}
        />

        <NumField
          label="Difficulty"
          value={difficulty}
          onChange={setDifficulty}
          min={1}
          max={5}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Preferred days
        </p>

        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
                days.includes(day)
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {DAY_LABELS[day]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={
            loading ||
            !name.trim() ||
            days.length === 0
          }
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create skill"}
        </button>
      </div>
    </form>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

function SelectField({
  label,
  value,
  onChange,
  children,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-2 text-sm"
      >
        {children}
      </select>
    </label>
  );
}

type NumFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
};

function NumField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: NumFieldProps) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-1 h-9 w-full rounded-lg border border-border bg-surface px-2 text-sm"
      />
    </label>
  );
}

function getHistoryRange() {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 83);

  return {
    start: iso(startDate),
    end: iso(endDate),
  };
}