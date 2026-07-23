type ForgeEmptyStateProps = {
  title: string;
  description: string;
};

export function ForgeEmptyState({
  title,
  description,
}: ForgeEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed p-10 text-center">

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-muted-foreground">
        {description}
      </p>

    </div>
  );
}