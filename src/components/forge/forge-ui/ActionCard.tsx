import type {
  LucideIcon,
} from "lucide-react";

import {
  ArrowRight,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

type ActionCardProps = {
  eyebrow?: string;

  title: string;

  description: string;

  icon?: LucideIcon;

  actionLabel: string;

  onAction: () => void;

  secondaryAction?: ReactNode;

  tone?:
    | "default"
    | "warning"
    | "success";

  disabled?: boolean;

  className?: string;
};

export function ActionCard({
  eyebrow = "Forge Recommendation",
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  secondaryAction,
  tone = "default",
  disabled = false,
  className = "",
}: ActionCardProps) {
  return (
    <article
      className={[
        "group rounded-3xl border p-5 shadow-sm sm:p-6",
        "transition-[border-color,background-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        "motion-reduce:transform-none motion-reduce:transition-none",
        toneClassName(
          tone,
        ),
        disabled
          ? "opacity-60"
          : "",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={[
              "flex size-11 shrink-0 items-center justify-center rounded-2xl border",
              iconClassName(
                tone,
              ),
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              className="size-5"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          )}

          <h3 className="mt-2 text-pretty text-xl font-black tracking-tight sm:text-2xl">
            {title}
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={
            onAction
          }
          disabled={
            disabled
          }
          className={[
            "inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-3",
            "rounded-2xl px-6 py-3",
            "text-sm font-bold tracking-tight sm:text-base",
            "transition-[background-color,color,transform,box-shadow] duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "motion-reduce:transform-none motion-reduce:transition-none",
            buttonClassName(
              tone,
            ),
          ].join(" ")}
        >
          <span>
            {actionLabel}
          </span>

          <ArrowRight
            aria-hidden="true"
            className="
            size-5
            transition-transform
            duration-200
            group-hover:translate-x-1.5
            "
          />
        </button>

        {secondaryAction && (
          <div className="shrink-0">
            {secondaryAction}
          </div>
        )}
      </div>
    </article>
  );
}

function toneClassName(
  tone:
    NonNullable<
      ActionCardProps["tone"]
    >,
): string {
  switch (tone) {
    case "warning":
      return [
        "border-amber-500/20",
        "bg-amber-500/[0.04]",
        "hover:border-amber-500/35",
      ].join(" ");

    case "success":
      return [
        "border-emerald-500/20",
        "bg-emerald-500/[0.04]",
        "hover:border-emerald-500/35",
      ].join(" ");

    case "default":
    default:
    case "default":
    return [
        "border border-action-border",
        "bg-action-surface",
        "text-foreground",
        "shadow-sm",
        "hover:bg-action-surface-hover",
        "hover:shadow-md",
        "active:scale-[0.99]",
    ].join(" ");
      return [
        "border-border",
        "bg-muted/20",
        "hover:border-accent/30",
        "hover:bg-accent/[0.025]",
      ].join(" ");
  }
}

function iconClassName(
  tone:
    NonNullable<
      ActionCardProps["tone"]
    >,
): string {
  switch (tone) {
    case "warning":
      return [
        "border-amber-500/20",
        "bg-amber-500/[0.08]",
        "text-amber-700",
        "dark:text-amber-300",
      ].join(" ");

    case "success":
      return [
        "border-emerald-500/20",
        "bg-emerald-500/[0.08]",
        "text-emerald-700",
        "dark:text-emerald-300",
      ].join(" ");

    case "default":
    default:
      return [
        "border-border",
        "bg-background",
        "text-accent",
      ].join(" ");
  }
}

function buttonClassName(
  tone:
    NonNullable<
      ActionCardProps["tone"]
    >,
): string {
  switch (tone) {
    case "warning":
      return [
        "bg-amber-600",
        "text-white",
        "hover:bg-amber-700",
        "active:scale-[0.98]",
      ].join(" ");

    case "success":
      return [
        "bg-emerald-600",
        "text-white",
        "hover:bg-emerald-700",
        "active:scale-[0.98]",
      ].join(" ");

    case "default":
    default:
      return [
        "bg-zinc-800",
        "text-white",
        "shadow-md",
        "hover:bg-zinc-700",
        "hover:shadow-lg",
        "active:scale-[0.98]",
        ].join(" ");
  }
}