import type {
  LucideIcon,
} from "lucide-react";

type SectionHeaderProps = {
  eyebrow?: string;

  title: string;

  description?: string;

  icon?: LucideIcon;

  action?: React.ReactNode;

  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <header
      className={[
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      ].join(" ")}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
            <Icon
              aria-hidden="true"
              className="size-5 text-accent"
            />
          </div>
        )}

        <div className="min-w-0">
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-1 text-pretty text-xl font-black tracking-tight sm:text-2xl">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}