type InsightCardProps = {
  title: string;

  description: string;

  confidence?: string;
};

export function InsightCard({
  title,
  description,
  confidence,
}: InsightCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6">

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm text-muted-foreground">
        {description}
      </p>

      {confidence && (

        <div className="mt-5 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">

          Confidence

          {" "}

          {confidence}

        </div>

      )}

    </div>
  );
}