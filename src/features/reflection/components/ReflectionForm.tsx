import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import type {
  FocusLevel,
  ReflectionLevel,
} from "@/features/forge-engine/reflection";

import {
  useReflectionByDate,
  useSaveReflection,
} from "../hooks";

import {
  defaultReflectionFormValues,
} from "../types";

import type {
  ReflectionFormValues,
} from "../types";

import {
  ReflectionField,
} from "./ReflectionField";

import {
  ReflectionScale,
} from "./ReflectionScale";

type ReflectionFormProps = {
  reflectionDate: string;
  onSaved?: () => void;
};

const energyOptions: Array<{
  label: string;
  value: ReflectionLevel;
}> = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
];

const focusOptions: Array<{
  label: string;
  value: FocusLevel;
}> = [
  {
    label: "Poor",
    value: "poor",
  },
  {
    label: "Good",
    value: "good",
  },
  {
    label: "Excellent",
    value: "excellent",
  },
];

const stressOptions: Array<{
  label: string;
  value: ReflectionLevel;
}> = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
];

export function ReflectionForm({
  reflectionDate,
  onSaved,
}: ReflectionFormProps) {
  const {
    data: existingReflection,
    isLoading,
    isError,
    error,
  } = useReflectionByDate(
    reflectionDate,
  );

  const saveReflection =
    useSaveReflection();

  const [values, setValues] =
    useState<ReflectionFormValues>(
      defaultReflectionFormValues,
    );

  useEffect(() => {
    if (!existingReflection) {
      setValues(
        defaultReflectionFormValues,
      );

      return;
    }

    setValues({
      energy:
        existingReflection
          .energy as ReflectionLevel,

      focus:
        existingReflection
          .focus as FocusLevel,

      stress:
        existingReflection
          .stress as ReflectionLevel,

      proudOf:
        existingReflection.proud_of,

      obstacle:
        existingReflection.obstacle,

      lesson:
        existingReflection.lesson,

      nextStep:
        existingReflection.next_step,
    });
  }, [
    existingReflection,
    reflectionDate,
  ]);

  const isSaving =
    saveReflection.isPending;

  const hasExistingReflection =
    Boolean(existingReflection);

  const canSubmit = useMemo(() => {
    return (
      values.proudOf.trim().length >
        0 ||
      values.obstacle.trim().length >
        0 ||
      values.lesson.trim().length >
        0 ||
      values.nextStep.trim().length >
        0
    );
  }, [values]);

  function updateValue<
    Key extends keyof ReflectionFormValues,
  >(
    key: Key,
    value: ReflectionFormValues[Key],
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!canSubmit || isSaving) {
      return;
    }

    saveReflection.mutate(
      {
        reflectionDate,
        energy: values.energy,
        focus: values.focus,
        stress: values.stress,
        proudOf: values.proudOf,
        obstacle: values.obstacle,
        lesson: values.lesson,
        nextStep: values.nextStep,
      },
      {
        onSuccess: () => {
          onSaved?.();
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading reflection…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="font-medium text-destructive">
          Unable to load reflection
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="space-y-6 rounded-2xl border bg-card p-5 sm:p-6">
        <ReflectionScale
          label="Energy"
          value={values.energy}
          options={energyOptions}
          onChange={(value) =>
            updateValue(
              "energy",
              value,
            )
          }
          disabled={isSaving}
        />

        <ReflectionScale
          label="Focus"
          value={values.focus}
          options={focusOptions}
          onChange={(value) =>
            updateValue(
              "focus",
              value,
            )
          }
          disabled={isSaving}
        />

        <ReflectionScale
          label="Stress"
          value={values.stress}
          options={stressOptions}
          onChange={(value) =>
            updateValue(
              "stress",
              value,
            )
          }
          disabled={isSaving}
        />
      </div>

      <div className="space-y-6 rounded-2xl border bg-card p-5 sm:p-6">
        <ReflectionField
          id="reflection-proud-of"
          label="What are you proud of today?"
          value={values.proudOf}
          onChange={(value) =>
            updateValue(
              "proudOf",
              value,
            )
          }
          placeholder="Something you completed, attempted, or handled well."
          disabled={isSaving}
        />

        <ReflectionField
          id="reflection-obstacle"
          label="What was the biggest obstacle?"
          value={values.obstacle}
          onChange={(value) =>
            updateValue(
              "obstacle",
              value,
            )
          }
          placeholder="What created friction or made progress harder?"
          disabled={isSaving}
        />

        <ReflectionField
          id="reflection-lesson"
          label="What did you learn?"
          value={values.lesson}
          onChange={(value) =>
            updateValue(
              "lesson",
              value,
            )
          }
          placeholder="One insight worth remembering."
          disabled={isSaving}
        />

        <ReflectionField
          id="reflection-next-step"
          label="What is tomorrow’s first step?"
          value={values.nextStep}
          onChange={(value) =>
            updateValue(
              "nextStep",
              value,
            )
          }
          placeholder="Make it small, specific, and easy to begin."
          disabled={isSaving}
        />
      </div>

      {saveReflection.isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {saveReflection.error instanceof
            Error
              ? saveReflection.error.message
              : "Unable to save the reflection."}
          </p>
        </div>
      ) : null}

      {saveReflection.isSuccess ? (
        <div className="rounded-xl border bg-muted/40 p-4">
          <p className="text-sm font-medium">
            Reflection saved.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Forge can now use this
            reflection to understand your
            recent experience.
          </p>
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            !canSubmit || isSaving
          }
          className={[
            "min-h-11 rounded-xl px-5 py-2.5 text-sm font-medium transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !canSubmit || isSaving
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-foreground text-background hover:opacity-90",
          ].join(" ")}
        >
          {isSaving
            ? "Saving…"
            : hasExistingReflection
              ? "Update reflection"
              : "Save reflection"}
        </button>
      </div>
    </form>
  );
}