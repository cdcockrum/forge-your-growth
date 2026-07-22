import type { ReactNode } from "react";

type ForgeHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function ForgeHero({
  eyebrow,
  title,
  subtitle,
  children,
}: ForgeHeroProps) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground shadow-xl">
      {eyebrow && (
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-80">
          {eyebrow}
        </p>
      )}

      <h1 className="mt-3 text-4xl font-black tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-4 max-w-2xl text-base opacity-90">
          {subtitle}
        </p>
      )}

      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
    </section>
  );
}