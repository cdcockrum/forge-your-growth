type ForgeMetricProps = {
  label: string;
  value: string | number;
  subtext?: string;
};

export function ForgeMetric({
  label,
  value,
  subtext,
}: ForgeMetricProps) {
  return (
    <div className="rounded-2xl border bg-background p-4">

      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      {subtext && (
        <p className="mt-1 text-sm text-muted-foreground">
          {subtext}
        </p>
      )}

    </div>
  );
}