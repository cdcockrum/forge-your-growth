type BriefingCardProps = {
  eyebrow: string;
  children: React.ReactNode;
};

export function BriefingCard({
  eyebrow,
  children,
}: BriefingCardProps) {
  return (
    <section className="rounded-2xl border bg-background p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {eyebrow}
      </p>

      <div className="mt-3">
        {children}
      </div>
    </section>
  );
}