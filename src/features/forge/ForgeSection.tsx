import type {
  ReactNode,
} from "react";

type ForgeSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ForgeSection({
  eyebrow,
  title,
  description,
  children,
}: ForgeSectionProps) {
  return (
    <section className="space-y-6">

      <header>

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

      </header>

      {children}

    </section>
  );
}