import type {
  ReactNode,
} from "react";

type ForgeSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function ForgeSection({
  eyebrow,
  title,
  description,
  action,
  children,
}: ForgeSectionProps) {
  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-3xl text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {action}
      </header>

      {children}
    </section>
  );
}